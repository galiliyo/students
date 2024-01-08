import { Component, OnInit } from '@angular/core';
import {
  ColumnDef,
  GenericTableComponent,
} from '../components/generic-table/generic-table.component';
import { ExamsService } from '../services/exams.service';
import { BehaviorSubject } from 'rxjs';
import { MatSidenavModule } from '@angular/material/sidenav';
import { AsyncPipe, NgClass } from '@angular/common';
import { ExamFormComponent } from './exam-form/exam-form.component';
import { Exam } from '../interfaces/exams.interface';
import {
  DynamicFilterComponent,
  FilterOutput,
  FilterState,
} from '../components/dynamic-filter/dynamic-filter.component';
import { dataTypes } from '../components/dynamic-filter/dynamic-filter.config';
import { LocalStorageService } from '../services/local-storage.service';

@Component({
  selector: 'app-averages',
  standalone: true,
  imports: [
    GenericTableComponent,
    MatSidenavModule,
    NgClass,
    ExamFormComponent,
    AsyncPipe,
    DynamicFilterComponent,
  ],
  templateUrl: './data.component.html',
  styleUrls: ['./data.component.scss'],
})
export class DataComponent implements OnInit {
  unFilteredExams: Exam[] = []; // All exams
  filteredExams: Exam[] = []; // Displayed in the table
  selectedRowId: number | null = null;

  columnDefinitions: ColumnDef[] = [
    { colId: 'id', header: 'Exam ID', sortable: true },
    { colId: 'name', header: 'Name', sortable: true },
    { colId: 'joinDate', header: 'Join Date', sortable: true },
    { colId: 'subject', header: 'Subject', sortable: true },
    { colId: 'grade', header: 'Grade', sortable: true },
  ];
  showNewExamForm$ = new BehaviorSubject<boolean>(false);
  dynamicFilterConfig = [
    { column: 'name', label: 'Name', dataType: dataTypes.string },
    { column: 'grade', label: 'Grade', dataType: dataTypes.number },
    { column: 'subject', label: 'Subject', dataType: dataTypes.string },
    { column: 'joinDate', label: 'Date', dataType: dataTypes.date },
  ];
  protected dynamicFilterInitialValues: FilterState | null = null;
  private selectedRow$ = new BehaviorSubject<Exam | null>(null);
  selectedStudent$ = this.selectedRow$.asObservable();

  constructor(
    private examsService: ExamsService,
    private localStorageService: LocalStorageService,
  ) {}

  ngOnInit() {
    // no need to manually unsubscribe from these observables since Angular's router
    // automatically destroys components on routes and unsubscribes
    this.examsService.exams$.subscribe((exams: Exam[]) => {
      this.unFilteredExams = exams?.map(formatExamDate) || [];
      this.filteredExams = [...this.unFilteredExams];
    });

    this.selectedRow$.subscribe((selectedRow) => {
      this.selectedRowId = selectedRow?.id || null;
    });

    this.dynamicFilterInitialValues =
      this.localStorageService.getFromLocalStorage('data_filters');
    console.log(this.dynamicFilterInitialValues);
  }

  selectedRowChange(newSelectedRow: Exam) {
    this.selectedRow$.next(
      newSelectedRow.id === this.selectedRowId ? null : newSelectedRow,
    );
  }

  openNewExamDrawer() {
    this.selectedRow$.next(null);
    this.showNewExamForm$.next(true);
  }

  closeExamDrawer() {
    this.selectedRow$.next(null);
    this.showNewExamForm$.next(false);
  }

  deleteRow(examId: number) {
    this.examsService.deleteExam(examId).subscribe(() => {
      this.examsService.loadExams();
      this.showNewExamForm$.next(false);
      this.selectedRow$.next(null);
    });
  }

  setFilteredData(eventData: FilterOutput) {
    this.filteredExams = eventData.filteredData as Exam[];
    this.localStorageService.saveToLocalStorage(
      'data_filters',
      eventData.filters,
    );
  }
}

function formatExamDate(exam: Exam) {
  return { ...exam, joinDate: exam.joinDate.split('T')[0] };
}
