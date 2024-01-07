import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Observable } from 'rxjs';
import { Exam } from '../../interfaces/exams.interface';
import { ExamsService } from '../../services/exams.service';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-exam-form',
  standalone: true,
  templateUrl: './exam-form.component.html',
  styleUrls: ['./exam-form.component.scss'],
  imports: [
    MatButtonModule,
    MatInputModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    AsyncPipe,
  ],
})
export class ExamFormComponent implements OnInit {
  @Input() initialExamData$ = new Observable<Exam | null>();
  @Output() closeDrawer = new EventEmitter<void>();
  @ViewChild('formDirective') formDirective: any;
  examForm: FormGroup;
  protected examId: number | null = null; // indicates if the exam is new or existing

  constructor(
    private fb: FormBuilder,
    private examsService: ExamsService,
  ) {
    this.examForm = this.createExamForm();
  }

  ngOnInit(): void {
    // Determine status of the form ('new' or 'edit' modes) depending on existence of initialExamData$
    this.subscribeToInitialValues();
  }

  onSubmit() {
    if (!this.examForm.valid) {
      // Display error messages and mark fields as touched
      this.examForm.markAllAsTouched();
      return;
    }
    if (this.examId) {
      this.putExam();
    } else {
      this.postExam();
    }
  }

  onCloseDrawer() {
    this.closeDrawer.emit();
    this.resetForm();
  }

  private createExamForm(): FormGroup {
    return this.fb.group({
      subject: ['', Validators.required],
      grade: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      joinDate: ['', Validators.required],
      address: this.fb.group({
        line_1: ['', Validators.required],
        zip: ['', Validators.required],
        city: ['', Validators.required],
        country: ['', Validators.required],
      }),
    });
  }

  private subscribeToInitialValues(): void {
    this.initialExamData$.subscribe((initialValues) => {
      if (initialValues) {
        // the form is in 'edit' mode - fill the form with the initial values
        this.examId = initialValues.id;
        this.examForm.patchValue(initialValues);
      } else {
        // the form is in 'new' mode - reset the form
        this.resetForm();
      }
    });
  }

  private putExam() {
    this.examsService
      .updateExam(this.examId as number, this.examForm.value)
      .subscribe((res) => {
        this.examsService.loadExams();
        this.closeDrawer.emit();
        this.resetForm();
      });
  }

  private postExam() {
    const payload = this.examForm.value;
    this.examsService.createExam(payload).subscribe((res) => {
      this.examsService.loadExams();
      this.closeDrawer.emit();
      this.resetForm();
    });
  }

  private resetForm(): void {
    this.examForm.reset();
    this.examId = null;
    this.formDirective?.resetForm();
  }
}
