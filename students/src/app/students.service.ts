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

  // exposing the private BehaviorSubject as a public Observable
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

  updateStudent(student: Student) {
    const url = `${environment.baseUrl}/students/${student.id}`;
    try {
      return this.httpClient.put(url, student);
    } catch (error) {
      console.log(`error updating Student: ${error}`);
      return null;
    }
  }

  createStudent(updatedStudent: Student) {
    const url = `${environment.baseUrl}/students`;
    try {
      return this.httpClient.post(url, updatedStudent);
    } catch (error) {
      console.log(`error creating Student: ${error}`);
      return null;
    }
  }
}
/**
 * Normalizes an array of students into a Map where each student's ID is the key,
 * and the student object with the 'id' field omitted is the value. This is useful
 * for fast lookups of students by ID.
 * @param students An array of student objects.
 * @returns A Map containing normalized student data.
 */
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
