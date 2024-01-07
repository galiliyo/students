import {
  ChangeDetectionStrategy,
  Component,
  effect,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { AsyncPipe } from '@angular/common';
import {
  ColumnDef,
  GenericTableComponent,
} from '../components/generic-table/generic-table.component';
import { ChartDataService } from '../analysis/chart-data.service';
import { ExamsService } from '../services/exams.service';
import { Subject, takeUntil } from 'rxjs';
import { Student } from '../interfaces/student.interface';
import { StudentAverage } from '../interfaces/chart.interfaces';
import { MatButtonModule } from '@angular/material/button';
import {
  MultiSelectComponent,
  Option,
} from '../components/multi-select/multi-select.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';
import { LocalStorageService } from '../services/local-storage.service';

interface MonitorData {
  id: number;
  name: string;
  average: number;
  noOfExams: number;
  passed: boolean;
}
@Component({
  selector: 'app-monitor',
  standalone: true,
  imports: [
    AsyncPipe,
    GenericTableComponent,
    MatButtonModule,
    MultiSelectComponent,
    MatCheckboxModule,
    FormsModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './monitor.component.html',
  styleUrl: './monitor.component.scss',
})
export class MonitorComponent implements OnInit, OnDestroy {
  columnDefinitions: ColumnDef[] = [
    { colId: 'id', header: 'Student ID', sortable: true },
    { colId: 'name', header: 'Name', sortable: true },
    { colId: 'average', header: 'Average', sortable: true },
    { colId: 'noOfExams', header: 'Exams', sortable: true },
  ];
  selectPanelOpened = false; // for disabling the buttons when the select panel is open
  studentSelections: string[] = [];
  showPassedCheck = true;
  showFailedCheck = true;
  PASS_GRADE = 65;
  filteredData: MonitorData[] = []; // data to display in the table after filtering
  protected unFilteredData: MonitorData[] = [];
  protected studentsOptions: Option[] = []; // options for student multi-select
  private unsubscribe$ = new Subject<void>();

  constructor(
    private chartDataService: ChartDataService,
    private examsService: ExamsService,
    private localStorageService: LocalStorageService,
  ) {
    effect(() => {
      const allStudentsAvg =
        this.chartDataService.$studentAverages()?.studentData ||
        ({} as StudentAverage);

      // Convert the student averages object to an array of MonitorData objects
      if (allStudentsAvg) {
        this.unFilteredData = Object.entries(allStudentsAvg).map(
          ([studentName, { sum, count, studentId }]) => ({
            id: studentId,
            name: studentName,
            average: Math.round(sum / count),
            noOfExams: count,
            passed: Math.round(sum / count) >= this.PASS_GRADE,
          }),
        );
      }

      // Get filter selections from local storage
      const filterSelections =
        this.localStorageService.getFromLocalStorage('monitor_filters');
      if (filterSelections) {
        this.studentSelections = filterSelections.studentSelections;
        this.showPassedCheck = filterSelections.showPassedCheck;
        this.showFailedCheck = filterSelections.showFailedCheck;
      }

      this.filterData();
    });
  }

  ngOnInit(): void {
    // Subscribe to exams data
    this.examsService.exams$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((exams) => {
        // Set student multi-select options
        this.studentsOptions = this.examsService
          .getAllStudents()
          ?.map((student: Student) => ({
            value: student.studentId?.toString(),
            label: student.name,
          }));
        this.chartDataService.generateStudentAvgsChartData({
          selectedSubjects: [],
          selectedStudentIds: [],
        });
      });
  }

  resetFilters() {
    this.studentSelections = [];
    this.showPassedCheck = true;
    this.showFailedCheck = true;
    this.filterData();
    this.localStorageService.clearLocalStorage('monitor_filters');
  }

  onOpenChanged($event: boolean) {
    this.selectPanelOpened = $event;
  }

  onStudentSelection($event: string[]) {
    this.studentSelections = $event;
  }

  filterData() {
    this.filteredData = this.unFilteredData.filter((student) => {
      // Filter by student selection and passed/failed
      return (
        (this.studentSelections.includes(student.id?.toString()) ||
          this.studentSelections.length === 0) &&
        ((this.showPassedCheck && student.passed) ||
          (this.showFailedCheck && !student.passed))
      );
    });

    this.localStorageService.saveToLocalStorage('monitor_filters', {
      studentSelections: this.studentSelections,
      showPassedCheck: this.showPassedCheck,
      showFailedCheck: this.showFailedCheck,
    });
  }

  ngOnDestroy(): void {
    // Complete the subject to signal the observables to unsubscribe
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
