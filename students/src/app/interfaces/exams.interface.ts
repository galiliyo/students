export type SchoolSubject = 'literature' | 'math' | 'french' | 'history';

export interface Exam {
  subject: SchoolSubject;
  grade: number;
  examId: string;
  studentId: string;
}

export interface ExamWithStudentData extends Exam {
  name: string;
  email: string;
  joinDate: string;
  address: {
    line_1: string;
    zip: string;
    city: string;
    country: string;
  };
}
