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
  NgComponentOutlet,
  NgForOf,
  NgIf,
  NgSwitchCase,
  NgTemplateOutlet,
} from '@angular/common';
import { ExamsService } from '../exams.service';
import { ChartDataService } from './chart-data.service';

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
  ],
  templateUrl: './analysis.component.html',
  styleUrl: './analysis.component.scss',
})
export class AnalysisComponent implements OnInit {
  components = {
    ['Student Avg']: ChartStudentComponent,
    ['Subject Avg']: ChartSubjectComponent,
    Time: ChartTimeComponent,
  };
  visible = ['Student Avg', 'Time'];
  hidden = ['Subject Avg'];
  // components = {
  //   student: ChartStudentComponent,
  //   subject: ChartSubjectComponent,
  //   time: ChartTimeComponent,
  // };
  examsData: any = this.examsService.exams$;

  constructor(
    protected examsService: ExamsService,
    public chartDataService: ChartDataService,
  ) {}

  ngOnInit(): void {
    this.examsService.exams$.subscribe((exams) => {
      this.examsData = exams;

      // set averages for subject averages chart
      this.chartDataService.generateSubjectAvgsChatData({
        exams,
        selectedSubjects: [],
        selectedStudentIds: [],
      });

      // set averages for subject averages chart
      this.chartDataService.generateStudentAvgsChartData({
        exams,
        selectedSubjects: [],
        selectedStudentIds: [],
      });

      // set averages for averages time series chart
      this.chartDataService.generateAvgTimeSeriesChatData({
        exams,
        selectedSubjects: [],
        selectedStudentIds: [],
      });
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
      console.log('prev Index', event.previousIndex);
      console.log('curr Index', event.currentIndex);

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
    // @ts-ignore
    return this.components[key];
  }
}
