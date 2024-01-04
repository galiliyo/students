import { Component, OnInit } from '@angular/core';
import {
  ColumnDef,
  GenericTableComponent,
} from '../components/generic-table/generic-table.component';
import { ExamsService } from '../exams.service';
import { BehaviorSubject, combineLatest, skip, Subject } from 'rxjs';
import { MatSidenavModule } from '@angular/material/sidenav';
import { AsyncPipe, NgClass } from '@angular/common';
import { ExamFormComponent } from './exam-form/exam-form.component';
import { Exam } from '../interfaces/exams.interface';

function newSubject<T>(b: boolean) {}

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
  displayData: Exam[] = []; // data to display in the table
  selectedRowId: number | null = null;

  columnDefinitions: ColumnDef[] = [
    { colId: 'id', header: 'Exam ID', sortable: true },
    { colId: 'name', header: 'Name', sortable: true },
    { colId: 'joinDate', header: 'Join Date', sortable: true },
    { colId: 'subject', header: 'Subject', sortable: true },
    { colId: 'grade', header: 'Grade', sortable: true },
  ];

  private _selectedRow$ = new BehaviorSubject<Exam | null>(null);
  selectedStudent$ = this._selectedRow$.asObservable();
  showNewExamForm$ = new BehaviorSubject<boolean>(false);

  constructor(private examsService: ExamsService) {}

  ngOnInit() {
    this.examsService.loadExams();

    this.examsService.exams$.subscribe((exams) => {
      this.displayData = exams?.map((exam) => formatExamData(exam));
    });

    //todo: unsubscribe
    this._selectedRow$.subscribe((selectedRow) => {
      this.selectedRowId = selectedRow?.id || null;
      console.log('_selectedRow$', selectedRow);
    });
  }

  selectedRowChange(newSelectedRow: Exam) {
    if (newSelectedRow.id === this.selectedRowId) {
      this._selectedRow$.next(null);
      return;
    }
    this._selectedRow$.next(newSelectedRow);
  }

  openNewExamDrawer() {
    this._selectedRow$.next(null);
    this.showNewExamForm$.next(true);
  }

  closeExamDrawer() {
    this._selectedRow$.next(null);
    this.showNewExamForm$.next(false);
  }
  deleteRow(examId: number) {
    this.examsService.deleteExam(examId).subscribe((res) => {
      this.examsService.loadExams();
      this.showNewExamForm$.next(false);
      this._selectedRow$.next(null);
    });
  }
}

function formatExamData(exam: Exam) {
  return { ...exam, joinDate: exam.joinDate.split('T')[0] };
}
