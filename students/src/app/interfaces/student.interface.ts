export interface Student {
  id: number;
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

export type NormalizedStudents = Map<number, Omit<Student, 'id'>>;
