import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { NormalizedStudents, Student } from '../interfaces/student.interface';
import { StudentsService } from '../students.service';
import {
  ColumnDef,
  GenericTableComponent,
} from '../components/generic-table/generic-table.component';
import {
  Exam,
  ExamWithStudentData,
  SchoolSubject,
} from '../interfaces/exams.interface';
import { ExamsService } from '../exams.service';
import {
  BehaviorSubject,
  combineLatest,
  forkJoin,
  Observable,
  skip,
  Subject,
} from 'rxjs';
import {MatSidenavModule} from "@angular/material/sidenav";

// interface StudentTableDisplayRow {
//   studentId: number;
//   name: string;
//   date: string;
//   subject: SchoolSubject;
//   grade: number;
// }

@Component({
  selector: 'app-data',
  standalone: true,
  imports: [GenericTableComponent, MatSidenavModule],
  templateUrl: './data.component.html',
  styleUrls: ['./data.component.scss'],
})
export class DataComponent implements OnInit {
  students: Student[] = [];
  columnDefinitions: ColumnDef[] = [
    { colId: 'id', header: 'Exam ID', sortable: true },
    { colId: 'name', header: 'Name', sortable: true },
    { colId: 'joinDate', header: 'Join Date', sortable: true },
    { colId: 'subject', header: 'Subject', sortable: true },
    { colId: 'grade', header: 'Grade', sortable: true },
  ];

  protected displayData: ExamWithStudentData[] = [];
  private _selectedRow$ = new BehaviorSubject<ExamWithStudentData | null>(null);
  protected selectedRowId: string | number | null = null;

  constructor(
    private studentsService: StudentsService,
    private examsService: ExamsService,
  ) {}

  ngOnInit() {
    this.studentsService.loadStudents();
    this.examsService.loadExams();

    // Combine data from the examsService and studentsService observables using combineLatest.
    // We use skip(1) to wait for both observables to emit at least once before processing.
    // Once both observables emit, we map the exams and students data to create ExamWithStudentData objects.
    // If a student is not found for an exam, default values are provided.
    // The merged data is assigned to the 'displayData' property.
    combineLatest([this.examsService.exams$, this.studentsService.students$])
      .pipe(
        skip(1), // Skip the initial emissions to wait for both observables to emit at least once
      )
      .subscribe(([exams, students]) => {
        const joinedData: ExamWithStudentData[] = exams.map((exam) => {
          const student = students.get(exam.studentId);

          return {
            ...exam,
            id: exam.examId,
            name: student?.name || 'not found',
            email: student?.email || 'not found',
            joinDate: student?.joinDate || 'not found',
            address: student?.address || {
              line_1: 'not found',
              zip: 'not found',
              city: 'not found',
              country: 'not found',
            },
          };
        });
        this.displayData = joinedData;
      });

    this._selectedRow$.subscribe((selectedRow) => {
      this.selectedRowId = selectedRow?.examId || null;
    });
  }

  selectedRowChange($event: ExamWithStudentData) {
    if ($event.examId === this.selectedRowId) {
      this._selectedRow$.next(null);
      return;
    }
    this._selectedRow$.next($event);
  }
}
