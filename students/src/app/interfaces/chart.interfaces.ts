import { Exam } from './exams.interface';

export interface SubjectAverage {
  subjects: string[];
  averages: number[];
}
export interface StudentAverage {
  students: string[];
  averages: number[];
}

// generic input interface for all carts
export interface inputArguments {
  exams: Exam[];
  selectedStudentIds: number[];
  selectedSubjects: string[];
  maxStudentNo?: number;
  thisYearOnly?: boolean;
}

export interface TimeSeriesData {
  series: {
    name: string;
    data: [number, number][];
  }[];
}
