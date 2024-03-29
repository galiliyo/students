import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  CdkDrag,
  CdkDragDrop,
  CdkDragPreview,
  CdkDropList,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
import { ChartStudentComponent } from './chart-student/chart-student.component';
import { ChartSubjectComponent } from './chart-subject/chart-subject.component';
import { ChartTimeComponent } from './chart-time/chart-time.component';
import {
  JsonPipe,
  NgComponentOutlet,
  NgForOf,
  NgIf,
  NgOptimizedImage,
  NgSwitchCase,
  NgTemplateOutlet,
} from '@angular/common';

import { ChartDataService } from './chart-data.service';
import {
  MultiSelectComponent,
  Option,
} from '../components/multi-select/multi-select.component';
import { MatButtonModule } from '@angular/material/button';
import { Student } from '../interfaces/student.interface';
import { ExamsService } from '../services/exams.service';
import { Subject, takeUntil } from 'rxjs';
import { LocalStorageService } from '../services/local-storage.service';
import { ControlBarComponent } from '../components/control-bar/control-bar.component';

type ChartType = 'Student Averages' | 'Time Series' | 'Subject Averages';

@Component({
  selector: 'app-analysis',
  standalone: true,
  imports: [
    CdkDropList,
    ChartStudentComponent,
    ChartSubjectComponent,
    ChartTimeComponent,
    CdkDrag,
    NgForOf,
    NgSwitchCase,
    NgIf,
    NgTemplateOutlet,
    NgComponentOutlet,
    CdkDragPreview,
    MultiSelectComponent,
    MatButtonModule,
    JsonPipe,
    ControlBarComponent,
    NgOptimizedImage,
  ],
  templateUrl: './analysis.component.html',
  styleUrl: './analysis.component.scss',
})
export class AnalysisComponent implements OnInit, OnDestroy {
  visible = ['Student Averages', 'Time Series']; //  visible charts
  hidden = ['Subject Averages']; //  hidden chart
  subjectsOptions: Option[] = []; // options for subject multi-select
  studentsOptions: Option[] = []; // options for student multi-select
  subjectSelections: string[] = []; // selected subjects
  studentSelections: string[] = []; // selected students

  components = {
    ['Student Averages']: ChartStudentComponent,
    ['Time Series']: ChartTimeComponent,
    ['Subject Averages']: ChartSubjectComponent,
  };

  protected selectPanelOpened = false; // whether a multi-select select panel is opened
  private unsubscribe$: Subject<void> = new Subject<void>(); // used to unsubscribe from observables

  constructor(
    private examsService: ExamsService,
    private chartDataService: ChartDataService,
    private localStorageService: LocalStorageService,
  ) {
    // Get filter selections from local storage
    const filterSelections =
      this.localStorageService.getFromLocalStorage('analysis_filters');
    if (filterSelections) {
      this.studentSelections = filterSelections.studentSelections;
      this.subjectSelections = filterSelections.subjectSelections;
    }
  }

  ngOnInit(): void {
    // Subscribe to exams data
    this.examsService.exams$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => {
        // Set subject multi-select options
        this.subjectsOptions = this.examsService
          .getAllSubjects()
          .map((subject: string) => ({ value: subject, label: subject }));

        // Set student multi-select options
        this.studentsOptions = this.examsService
          .getAllStudents()
          ?.map((student: Student) => ({
            value: student.studentId?.toString(),
            label: student.name,
          }));
        this.generateAllChartsData();
      });
  }

  drop(event: CdkDragDrop<any>) {
    // Handle drag and drop of charts
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data.items,
        event.previousIndex,
        event.currentIndex,
      );
    } else {
      const sourceName =
        event.previousContainer.data.containerName === 'visible' ? 1 : 0;
      const remainingItemIdx = event.previousIndex === 0 ? 1 : 0;
      const removedItem = this.visible[event.previousIndex];
      const remainingItem = this.visible[remainingItemIdx];

      this.visible =
        event.previousIndex === 0
          ? [remainingItem, ...this.hidden]
          : [...this.hidden, remainingItem];
      this.hidden = [removedItem];
    }
  }

  getComponent(key: string) {
    // Provide the component to the dynamic component in the template
    return this.components[key as ChartType];
  }

  onStudentSelection($event: string[]) {
    this.studentSelections = $event;
  }

  onSubjectSelection($event: string[]) {
    this.subjectSelections = $event;
  }

  onOpenChanged($event: boolean) {
    // Handle multi-select panel open/close in order to disable the filter buttons
    this.selectPanelOpened = $event;
  }

  resetFilters() {
    this.studentSelections = [];
    this.subjectSelections = [];
    this.generateAllChartsData();
    this.localStorageService.clearLocalStorage('analysis_filters');
  }

  saveFilterData() {
    const filterSelections = {
      studentSelections: this.studentSelections,
      subjectSelections: this.subjectSelections,
    };

    this.localStorageService.saveToLocalStorage(
      'analysis_filters',
      filterSelections,
    );
  }

  ngOnDestroy(): void {
    // Complete the subject to signal the observables to unsubscribe
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  protected generateAllChartsData() {
    // set averages for subject averages chart
    this.chartDataService.generateSubjectAvgsChatData({
      selectedSubjects: this.subjectSelections,
      selectedStudentIds: parseIntArray(this.studentSelections),
    });

    // set averages for subject averages chart
    this.chartDataService.generateStudentAvgsChartData({
      selectedSubjects: this.subjectSelections,
      selectedStudentIds: parseIntArray(this.studentSelections),
    });

    // set averages for averages time series chart
    this.chartDataService.generateAvgTimeSeriesChatData({
      selectedSubjects: this.subjectSelections,
      selectedStudentIds: parseIntArray(this.studentSelections),
    });

    this.saveFilterData();

    function parseIntArray(strs: string[]): number[] {
      return strs.map((str) => parseInt(str, 10));
    }
  }
}
