import { Student } from './student.interface';

export type SchoolSubject = 'literature' | 'math' | 'french' | 'history';

export interface Exam {
  subject: SchoolSubject;
  grade: number;
  examId: string;
  studentId: string;
}

export interface ExamWithStudentData extends Exam, Omit<Student, 'id'> {}
