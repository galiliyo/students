export interface SubjectAverage {
  subjects: string[];
  averages: number[];
}
export interface StudentAverage {
  students: string[];
  averages: number[];
  studentData?: { [key: string]: { sum: number; count: number } };
}

// generic input interface for all carts
export interface inputArguments {
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
