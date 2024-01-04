export interface Exam {
  subject: string;
  grade: number;
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
