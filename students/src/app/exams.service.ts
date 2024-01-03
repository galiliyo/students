import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Student } from './interfaces/student.interface';
import { environment } from './environments/environment';
import { Exam } from './interfaces/exams.interface';

@Injectable({
  providedIn: 'root',
})
export class ExamsService {
  constructor(public httpClient: HttpClient) {}

  private _exams = new BehaviorSubject<Exam[] | null>(null);
  public exams$ = this._exams as Observable<Exam[]>;

  loadExams(): void {
    const url = `${environment.baseUrl}/exams`;
    this.httpClient
      .get<Exam[]>(url)
      .subscribe((exams) => this._exams.next(exams));
  }

  updateExam(exam: Exam) {
    const url = `${environment.baseUrl}/exams/${exam.examId}`;
    return this.httpClient.put(url, exam).subscribe((res) => {
      console.log(res);
    });
  }
}
