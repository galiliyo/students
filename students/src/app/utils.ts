function shortenName(name: string): string {
  const names = name.split(' ');
  if (names.length > 1) {
    return `${names[0]} ${names[names.length - 1].charAt(0)}.`;
  }
  return name;
}

export { shortenName };

// manual db data point creation
function getRandomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const subjectsAndDates = [
  {
    subject: 'Literature',
    dates: ['jan 10 2023', 'may 5 2023', 'september 2 2023'],
  },
  {
    subject: 'Math',
    dates: ['jan 14 2023', 'may 12 2023', 'september 6 2023'],
  },
  {
    subject: 'French',
    dates: ['jan 20 2023', 'may 18 2023', 'september 10 2023'],
  },
  {
    subject: 'History',
    dates: ['jan 24 2023', 'may 20 2023', 'september 14 2023'],
  },
  {
    subject: 'Biology',
    dates: ['jan 28 2023', 'may 24 2023', 'september 18 2023'],
  },
];

function generateRandomStudent(): any {
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
    'Lopez',
    'Cohen',
    'Taylor',
    'Hernandez',
    'Brown',
    'Wang',
    'Williams',
    'Lee',
    'Rodriguez',
    'Jones',
    'Fernandez',
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
    address: generateRandomUSAddress(),
    studentId: Math.floor(Math.random() * 10000),
  };

  return student;
}

// Function to generate random exams for students
function generateRandomExams() {
  const exams: {
    id: number;
    studentId: number;
    subject: any;
    grade: number;
    name: any;
    email: any;
    joinDate: any;
    address: any;
  }[] = [];
  let examId = 100;

  for (let i = 1; i <= 15; i++) {
    const student = generateRandomStudent();

    // @ts-ignore
    subjectsAndDates.forEach(({ subject, dates }) => {
      dates.forEach((date: any) => {
        const grade = Math.min(
          100,
          Math.floor(getNormallyDistributedRandomNumber(70, 20)),
        ); // Generate a random grade between 0 and 100
        exams.push({
          id: examId++,
          subject,
          grade,
          studentId: student.studentId,
          name: student.name,
          email: student.email,
          joinDate: new Date(date).toISOString(),
          address: student.address,
        });
      });
    });
  }

  return exams;
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

function getNormallyDistributedRandomNumber(mean: number, stddev: number) {
  function boxMullerTransform() {
    const u1 = Math.random();
    const u2 = Math.random();

    const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
    const z1 = Math.sqrt(-2.0 * Math.log(u1)) * Math.sin(2.0 * Math.PI * u2);

    return { z0, z1 };
  }

  const { z0, z1 } = boxMullerTransform();

  return Math.ceil(z0 * stddev + mean);
}

// console.log('++++++++++++++++++++++++++++++++++++++++++');
// console.log(JSON.stringify(generateRandomExams(), null, 2));
// console.log(generateNubberArray());
