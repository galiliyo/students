import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { environment } from '../environments/environment';
import { Exam } from '../interfaces/exams.interface';
import { Student } from '../interfaces/student.interface';

@Injectable({
  providedIn: 'root',
})
export class ExamsService {
  private _exams = new BehaviorSubject<Exam[] | null>(null);
  public exams$ = this._exams as Observable<Exam[]>; // expose as observable

  constructor(public httpClient: HttpClient) {}

  loadExams(): void {
    const url = `${environment.baseUrl}/exams`;
    this.httpClient
      .get<Exam[]>(url)
      .subscribe((exams) => this._exams.next(exams));
  }

  updateExam(id: number, exam: Exam) {
    const url = `${environment.baseUrl}/exams/${id}`;
    try {
      return this.httpClient.put(url, exam);
    } catch (error) {
      console.log(`error updateExam: ${error}`);
      return of(error);
    }
  }

  createExam(newExam: Exam) {
    const allStudents = this.getAllStudents();
    // check if student exists (by name) - if so, use existing studentId, else create new studentId
    // as to not create duplicate students
    const studentExists = allStudents.find(
      (student) => student.name === newExam.name,
    );

    if (studentExists) {
      newExam.studentId = studentExists.studentId;
    } else {
      newExam.studentId = Math.round(Math.random() * 10000);
    }
    const url = `${environment.baseUrl}/exams`;
    try {
      return this.httpClient.post(url, newExam);
    } catch (error) {
      console.log(`error createExam: ${error}`);
      return of(error);
    }
  }

  deleteExam(examId: number) {
    const url = `${environment.baseUrl}/exams/${examId}`;
    try {
      return this.httpClient.delete(url);
    } catch (error) {
      console.log(`error deleteExam: ${error}`);
      return of(error);
    }
  }

  getAllSubjects() {
    // returns an array of subjects (History, Math etc.) with no duplicates
    const subjects = this._exams.value?.map((exam) => exam.subject);
    return [...new Set(subjects)];
  }

  getAllStudents(): Student[] {
    // returns an array of students with no duplicates, also checks that all Students have ids
    return (
      this._exams.value?.reduce((acc, curr) => {
        const existingStudent = acc.find(
          (student) => student.studentId === curr.studentId,
        );

        if (curr.studentId && !existingStudent) {
          acc.push({ name: curr.name, studentId: curr.studentId });
        }

        return acc;
      }, [] as Student[]) || []
    );
  }
}
