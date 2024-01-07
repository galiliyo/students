import { Component, effect, OnInit } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import {
  ColumnDef,
  GenericTableComponent,
} from '../components/generic-table/generic-table.component';
import { ChartDataService } from '../analysis/chart-data.service';
import { Exam } from '../interfaces/exams.interface';
import { ExamsService } from '../services/exams.service';
import { Subject, takeUntil } from 'rxjs';
import { Student } from '../interfaces/student.interface';
import { StudentAverage } from '../interfaces/chart.interfaces';

interface MonitorData {
  id: number;
  name: string;
  average: number;
  noOfExams: number;
}
@Component({
  selector: 'app-monitor',
  standalone: true,
  imports: [AsyncPipe, GenericTableComponent],
  templateUrl: './monitor.component.html',
  styleUrl: './monitor.component.scss',
})
export class MonitorComponent implements OnInit {
  columnDefinitions: ColumnDef[] = [
    { colId: 'id', header: 'Student ID', sortable: true },
    { colId: 'name', header: 'Name', sortable: true },
    { colId: 'average', header: 'Average', sortable: true },
    { colId: 'noOfExams', header: 'Exams', sortable: true },
  ];
  displayData: MonitorData[] = [];
  protected unFilteredData: MonitorData[] = [];
  private allStudentsAvg: StudentAverage | {} = {};
  private examsData: Exam[] = [];
  private unsubscribe$ = new Subject<void>();
  private studentsOptions:
    | { label: string; value: string | undefined }[]
    | undefined;

  constructor(
    private chartDataService: ChartDataService,
    private examsService: ExamsService,
  ) {
    console.log('this.examsData', this.examsData);
    this.chartDataService.generateStudentAvgsChartData({
      exams: this.examsData,
      selectedSubjects: [],
      selectedStudentIds: [],
    });

    effect(() => {
      this.allStudentsAvg =
        this.chartDataService.$studentAverages()?.studentData ||
        ({} as StudentAverage);

      console.log('studentAveragesMap', this.allStudentsAvg);

      if (this.allStudentsAvg) {
        this.unFilteredData = Object.entries(this.allStudentsAvg).map(
          ([studentName, { sum, count, studentId }]) => ({
            id: studentId,
            name: studentName,
            average: Math.round(sum / count),
            noOfExams: count,
          }),
        );
      }
      console.log('unFilteredData', this.unFilteredData);
    });
  }

  ngOnInit(): void {
    // Subscribe to exams data
    this.examsService.exams$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((exams) => {
        this.examsData = exams;

        // Set student multi-select options
        this.studentsOptions = this.examsService
          .getAllStudents()
          ?.map((student: Student) => ({
            value: student.studentId?.toString(),
            label: student.name,
          }));
        this.chartDataService.generateStudentAvgsChartData({
          exams: this.examsData,
          selectedSubjects: [],
          selectedStudentIds: [],
        });
      });
  }
}
