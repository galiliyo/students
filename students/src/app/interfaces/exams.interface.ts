import { Student } from './student.interface';

export interface Exam {
  subject: string;
  grade: number;
  id: number;
  studentId: number;
}

export interface ExamWithStudentData extends Exam, Omit<Student, 'id'> {}
