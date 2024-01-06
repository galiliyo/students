import { Component, OnInit } from '@angular/core';
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
  NgSwitchCase,
  NgTemplateOutlet,
} from '@angular/common';
import { ExamsService } from '../exams.service';
import { ChartDataService } from './chart-data.service';
import {
  MultiSelectComponent,
  Option,
} from '../components/multi-select/multi-select.component';
import { MatButtonModule } from '@angular/material/button';

type ChartType = 'Student Avg' | 'Time Series' | 'Subject Avg';

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
  ],
  templateUrl: './analysis.component.html',
  styleUrl: './analysis.component.scss',
})
export class AnalysisComponent implements OnInit {
  visible = ['Student Avg', 'Time Series']; //  visible charts
  hidden = ['Subject Avg']; //  hidden chart
  examsData: any[] = [];
  subjectsOptions: Option[] = [];
  studentsOptions: Option[] = [];
  subjectSelections: string[] = [];
  studentSelections: string[] = [];
  components = {
    ['Student Avg']: ChartStudentComponent,
    ['Time Series']: ChartTimeComponent,
    ['Subject Avg']: ChartSubjectComponent,
  };
  protected selectPanelOpened = false;

  constructor(
    protected examsService: ExamsService,
    public chartDataService: ChartDataService,
  ) {}

  ngOnInit(): void {
    this.examsService.exams$.subscribe((exams) => {
      this.examsData = exams;

      this.subjectsOptions = this.examsService
        .getAllSubjects()
        .map((subject) => ({ value: subject, label: subject }));
      this.studentsOptions = this.examsService
        .getAllStudents()
        ?.map((student) => ({
          value: student.studentId?.toString(),
          label: student.name,
        }));
      this.generateAllChartsData();
    });
  }

  drop(event: CdkDragDrop<any>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data.items,
        event.previousIndex,
        event.currentIndex,
      );
    } else {
      const sourceName = event.previousContainer.data.containerName;
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
    return this.components[key as ChartType];
  }

  onStudentSelection($event: string[]) {
    this.studentSelections = $event;
  }

  onSubjectSelection($event: string[]) {
    this.subjectSelections = $event;
  }

  onOpenChanged($event: boolean) {
    this.selectPanelOpened = $event;
  }

  resetFilters() {
    this.studentSelections = [];
    this.subjectSelections = [];
  }

  protected generateAllChartsData() {
    // set averages for subject averages chart
    this.chartDataService.generateSubjectAvgsChatData({
      exams: this.examsData,
      selectedSubjects: this.subjectSelections,
      selectedStudentIds: parseIntArray(this.studentSelections),
    });

    // set averages for subject averages chart
    this.chartDataService.generateStudentAvgsChartData({
      exams: this.examsData,
      selectedSubjects: this.subjectSelections,
      selectedStudentIds: parseIntArray(this.studentSelections),
    });

    // set averages for averages time series chart
    this.chartDataService.generateAvgTimeSeriesChatData({
      exams: this.examsData,
      selectedSubjects: this.subjectSelections,
      selectedStudentIds: parseIntArray(this.studentSelections),
    });

    function parseIntArray(strs: string[]): number[] {
      return strs.map((str) => parseInt(str, 10));
    }
  }
}
