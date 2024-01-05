import { Exam } from './interfaces/exams.interface';

function getRandomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateRandomStudent(id: number): any {
  const firstNames = [
    'John',
    'Emma',
    'William',
    'Olivia',
    'James',
    'Sophia',
    'Daniel',
    'Isabella',
    'Liam',
    'Mia',
    'Alexander',
    'Charlotte',
    'Michael',
    'Abigail',
    'Ethan',
    'Emily',
    'David',
    'Madison',
    'Matthew',
    'Harper',
    'Andrew',
    'Grace',
    'Joseph',
    'Elizabeth',
    'Samuel',
    'Ava',
    'Benjamin',
    'Chloe',
    'Nicholas',
    'Lily',
  ];

  const lastNames = [
    'Smith',
    'Garcia',
    'Kim',
    'Müller',
    'Chen',
    'Singh',
    'Sato',
    'Martinez',
    'Khan',
    'Nguyen',
    'Gonzalez',
    'Li',
    'Patel',
    'López',
    'Cohen',
    'Taylor',
    'Hernandez',
    'Brown',
    'Wang',
    'Williams',
    'Lee',
    'Rodriguez',
    'Jones',
    'Fernández',
    'Johnson',
    'Suzuki',
    'Gomez',
    'Lam',
    'Smith',
    'Gupta',
    'Jansen',
    'Choi',
    'Herrera',
    'Adams',
    'Silva',
    'Mendoza',
    'Schmidt',
    'Lefebvre',
  ];
  const emailProviders = ['gmail', 'gmail', 'yahoo', 'aol', 'outlook'];
  const randomFirstName = firstNames[getRandomInt(0, firstNames.length - 1)];
  const randomLastName = lastNames[getRandomInt(0, lastNames.length - 1)];
  const fullName = `${randomFirstName} ${randomLastName}`;
  const first = randomFirstName.toLowerCase();
  const last = randomLastName.toLowerCase();
  const student = {
    name: fullName,
    email: `${first}.${last}@${emailProviders[getRandomInt(0, 4)]}.com`,
    joinDate: generateRandomDatePast3Years(),
    address: generateRandomUSAddress(),
  };

  return student;
}

function generateExams(students: any[]): Exam[] {
  let idCounter = 100;
  const exams: Exam[] = [];
  const subjects = ['literature', 'math', 'french', 'history'];
  students.forEach((student) => {
    subjects.forEach((subject) => {
      idCounter++;
      const newExam: Exam = {
        subject: subject,
        grade: Math.min(getNormallyDistributedRandomNumber(75, 20), 100),
        id: idCounter,
        ...student,
      };
      exams.push(newExam);
    });
  });
  return exams;
}

const studentsArray = [];
for (let id = 101; id <= 150; id++) {
  studentsArray.push(generateRandomStudent(id));
}

function generateRandomUSAddress(): Record<string, string> {
  const usCities: string[] = [
    'New York',
    'Los Angeles',
    'Chicago',
    'Houston',
    'Phoenix',
    'Philadelphia',
    'San Antonio',
    'San Diego',
    'Dallas',
    'San Jose',
    'Austin',
    'Jacksonville',
    'San Francisco',
    'Columbus',
    'Indianapolis',
    'Fort Worth',
    'Charlotte',
    'Seattle',
    'Denver',
    'Washington',
    'Boston',
    'El Paso',
    'Nashville',
    'Oklahoma City',
    'Las Vegas',
    'Detroit',
    'Portland',
    'Memphis',
    'Louisville',
  ];

  // Select a random city
  const city: string = usCities[Math.floor(Math.random() * usCities.length)];

  // Generate a random street address
  const streetNumber: number = Math.floor(Math.random() * 999) + 1;
  const streetNames: string[] = [
    'Main St.',
    'Elm St.',
    'Oak St.',
    'Maple Ave.',
    'Cedar Rd.',
    'Pine Ln.',
    'Birch Dr.',
  ];
  const streetName: string =
    streetNames[Math.floor(Math.random() * streetNames.length)];
  const line1: string = `${streetNumber} ${streetName}`;

  // Generate a random ZIP code
  const zipCode: string = Math.floor(Math.random() * 90000) + 10000 + '';

  // Create the address object
  const address: Record<string, string> = {
    line_1: line1,
    zip: zipCode,
    city: city,
    country: 'USA',
  };

  return address;
}

function generateRandomDatePast3Years(): string {
  const currentDate: Date = new Date();
  const currentYear: number = currentDate.getFullYear();
  const minYear: number = currentYear - 3;
  const maxMonth: number = currentDate.getMonth();
  const minMonth: number =
    maxMonth === 0 ? 0 : Math.floor(Math.random() * (maxMonth + 1));
  const maxDay: number = currentDate.getDate();
  const minDay: number = Math.floor(Math.random() * (maxDay + 1));

  const randomYear: number =
    Math.floor(Math.random() * (currentYear - minYear + 1)) + minYear;
  const randomMonth: number =
    minYear === currentYear ? minMonth : Math.floor(Math.random() * 12);
  const randomDay: number =
    minYear === currentYear && randomMonth === maxMonth
      ? minDay
      : Math.floor(Math.random() * 31);

  const randomDate: Date = new Date(randomYear, randomMonth, randomDay);
  return randomDate.toISOString();
}

function getNormallyDistributedRandomNumber(mean, stddev) {
  function boxMullerTransform() {
    const u1 = Math.random();
    const u2 = Math.random();

    const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
    const z1 = Math.sqrt(-2.0 * Math.log(u1)) * Math.sin(2.0 * Math.PI * u2);

    return { z0, z1 };
  }

  const { z0, _ } = boxMullerTransform();

  return Math.ceil(z0 * stddev + mean);
}

console.log('++++++++++++++++++++++++++++++++++++++++++');
console.log(JSON.stringify(generateExams(studentsArray), null, 2));
// console.log(generateNubberArray());
