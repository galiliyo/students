import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { NormalizedStudents, Student } from './interfaces/student.interface';
import { environment } from './environments/environment';

@Injectable({
  providedIn: 'root',
})
export class StudentsService {
  constructor(public httpClient: HttpClient) {}

  private _students = new BehaviorSubject<NormalizedStudents | null>(null);
  public students$ = this._students as Observable<NormalizedStudents>;

  loadStudents(): void {
    const url = `${environment.baseUrl}/students`;
    console.log('loadStudents');
    this.httpClient
      .get<Student[]>(url)
      .subscribe((students) =>
        this._students.next(normalizeStudents(students)),
      );
    console.log('students', this._students.value);
  }
}
function normalizeStudents(students: Student[]): NormalizedStudents {
  if (!Array.isArray(students) || !students.length) return new Map();
  return students.reduce((acc, student) => {
    return acc.set(student.id, {
      name: student.name,
      email: student.email,
      joinDate: student.joinDate,
      address: student.address,
    });
  }, new Map());
}
