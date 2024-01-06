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
  public exams$ = this._exams as Observable<Exam[]>;

  constructor(public httpClient: HttpClient) {}

  loadExams(): void {
    const url = `${environment.baseUrl}/exams`;
    this.httpClient
      .get<Exam[]>(url)
      .subscribe((exams) => this._exams.next(exams));
  }
  // todo: load
  updateExam(id: number, exam: Exam) {
    const url = `${environment.baseUrl}/exams/${id}`;
    try {
      return this.httpClient.put(url, exam);
    } catch (error) {
      console.log(`error updateExam: ${error}`);
      return of(error);
    }
  }

  createExam(updatedExam: Exam) {
    const allStudents = this.getAllStudents();
    const studentExists = allStudents.find(
      (student) => student.name === updatedExam.name,
    );
    if (studentExists) {
      updatedExam.studentId = studentExists.studentId;
    } else {
      updatedExam.studentId = Math.round(Math.random() * 10000);
    }
    const url = `${environment.baseUrl}/exams`;
    try {
      return this.httpClient.post(url, updatedExam);
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
    const subjects = this._exams.value?.map((exam) => exam.subject);
    return [...new Set(subjects)];
  }

  // returns an array of students with no duplicates
  getAllStudents(): Student[] {
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
