import { Component, OnInit } from '@angular/core';
import { Student } from '../interfaces/student.interface';
import { StudentsService } from '../students.service';
import {
  ColumnDef,
  GenericTableComponent,
} from '../components/generic-table/generic-table.component';
import { ExamWithStudentData } from '../interfaces/exams.interface';
import { ExamsService } from '../exams.service';
import { BehaviorSubject, combineLatest, skip } from 'rxjs';
import { MatSidenavModule } from '@angular/material/sidenav';
import { AsyncPipe, NgClass } from '@angular/common';
import { ExamFormComponent } from './exam-form/exam-form.component';

@Component({
  selector: 'app-data',
  standalone: true,
  imports: [
    GenericTableComponent,
    MatSidenavModule,
    NgClass,
    ExamFormComponent,
    AsyncPipe,
  ],
  templateUrl: './data.component.html',
  styleUrls: ['./data.component.scss'],
})
export class DataComponent implements OnInit {
  students: Student[] = [];
  displayData: ExamWithStudentData[] = []; // data to display in the table
  selectedRowId: string | number | null = null;

  columnDefinitions: ColumnDef[] = [
    { colId: 'id', header: 'Exam ID', sortable: true },
    { colId: 'name', header: 'Name', sortable: true },
    { colId: 'joinDate', header: 'Join Date', sortable: true },
    { colId: 'subject', header: 'Subject', sortable: true },
    { colId: 'grade', header: 'Grade', sortable: true },
  ];

  private _selectedRow$ = new BehaviorSubject<ExamWithStudentData | null>(null);
  selectedStudent$ = this._selectedRow$.asObservable();

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
      .pipe(skip(1))
      .subscribe(([exams, students]) => {
        this.displayData = exams?.map((exam) => {
          const student = students.get(exam.studentId);

          return {
            ...exam,
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
      });

    this._selectedRow$.subscribe((selectedRow) => {
      this.selectedRowId = selectedRow?.examId || null;
    });
  }

  selectedRowChange(e: ExamWithStudentData) {
    if (e.examId === this.selectedRowId) {
      this._selectedRow$.next(null);
      return;
    }
    this._selectedRow$.next(e);
  }
}
