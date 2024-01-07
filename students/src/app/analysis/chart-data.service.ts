import { Injectable, signal } from '@angular/core';
import {
  inputArguments,
  StudentAverage,
  SubjectAverage,
  TimeSeriesData,
} from '../interfaces/chart.interfaces';
import { ExamsService } from '../services/exams.service';
import { Exam } from '../interfaces/exams.interface';

@Injectable({
  providedIn: 'root',
})
export class ChartDataService {
  // Chart data calculated and stored in signals
  $subjectAverages = signal<SubjectAverage | null>(null);
  $studentAverages = signal<StudentAverage | null>(null);
  $timeSeriesData = signal<TimeSeriesData | null>(null);
  private exams: Exam[] = [];

  constructor(public examsService: ExamsService) {
    this.examsService.exams$.subscribe((exams) => {
      this.exams = exams;
      this.generateAvgTimeSeriesChatData({
        selectedStudentIds: [],
        selectedSubjects: [],
      });
      this.generateSubjectAvgsChatData({
        selectedStudentIds: [],
        selectedSubjects: [],
      });
      this.generateStudentAvgsChartData({
        selectedStudentIds: [],
        selectedSubjects: [],
      });
    });
  }

  // Exposed public methods to generate and set chart data

  public generateAvgTimeSeriesChatData({
    selectedStudentIds,
    selectedSubjects,
  }: inputArguments) {
    const results = this.calculateTimeSeriesData({
      selectedStudentIds,
      selectedSubjects,
    });
    this.$timeSeriesData.set(results);
  }

  public generateSubjectAvgsChatData({
    selectedStudentIds,
    selectedSubjects,
  }: inputArguments) {
    const results = this.calculateSubjectAverages({
      selectedStudentIds,
      selectedSubjects,
    });
    this.$subjectAverages.set(results);
  }

  public generateStudentAvgsChartData({
    selectedStudentIds,
    selectedSubjects,
  }: inputArguments) {
    const results = this.calculateStudentAverages({
      selectedStudentIds,
      selectedSubjects,
    });
    this.$studentAverages.set(results);
  }

  // Data calculation functions

  /**
   * Calculates time series data for a TIME SERIES CHART based on the exams, selected student IDs,
   * and selected subjects. The function generates data points representing the average grades of selected
   * students for selected subjects over time.
   *
   * @param exams An array of Exam objects containing student grades and exam details.
   * @param selectedStudentIds An array of selected student IDs to consider (empty array for all students).
   * @param selectedSubjects An array of selected subjects to consider (empty array for all subjects).
   * @param thisYearOnly consider results from past year only (default: true).
   * @param maxStudentNo only the first maxStudentNo students will be considered (default: 10).
   * @returns Time series data in the specified format for a time series chart.
   */
  private calculateTimeSeriesData({
    selectedStudentIds,
    selectedSubjects,
    maxStudentNo = 10,
    thisYearOnly = true,
  }: inputArguments) {
    if (!this.exams || this.exams.length === 0) return { series: [] };

    // Sort exams by date in ascending order
    this.exams.sort(
      (a, b) => new Date(a.joinDate).getTime() - new Date(b.joinDate).getTime(),
    );

    // Create a map to store the sum and count of grades for each student,
    // this map will be updated as we iterate through the exams. The key is student ID
    const studentData: Map<number, { sum: number; count: number }> = new Map();

    // Create the time series data in the specified format
    const series: { name: string; data: [number, number][] }[] = []; // {name:'student name' , data :[timestamp, average]}[]

    // Iterate through the sorted exams to calculate sum and count for each student
    for (const studentExam of this.exams) {
      // filter the exams based on the selected students and subjects
      if (
        selectedStudentIds.length === 0 ||
        selectedStudentIds.includes(studentExam.studentId)
      ) {
        if (
          selectedSubjects.length === 0 ||
          selectedSubjects.includes(studentExam.subject)
        ) {
          // Check if the exam is from the past year if thisYearOnly is true
          if (
            !thisYearOnly ||
            isDateInPast12Months(new Date(studentExam.joinDate))
          ) {
            const { studentId, grade } = studentExam;

            if (!studentData.has(studentId)) {
              studentData.set(studentId, { sum: 0, count: 0 });
            }

            const studentSumCount = studentData.get(studentId); // get the data up till this point for this student

            studentSumCount!.sum += grade;
            studentSumCount!.count++;

            const timestamp = new Date(studentExam.joinDate).getTime();
            let average = 0;
            try {
              // Calculate the average grade and timestamp up to this point
              // for this student and round it to the nearest integer
              average = Math.round(
                studentSumCount!.sum / studentSumCount!.count,
              );
            } catch (error) {
              console.log(
                `calculation error for student ${studentId} : ${error}`,
              );
            }
            // Find or create the series entry for this student
            let studentSeries = series.find(
              (entry) => entry.name === studentExam.name,
            );
            if (!studentSeries) {
              studentSeries = { name: studentExam.name, data: [] };
              series.push(studentSeries);
            }

            studentSeries.data.push([timestamp, average]);
          }
        }
      }
    }

    return { series: series.slice(0, maxStudentNo) };
  }

  /**
   * Calculates the average grades for selected students and subjects for the STUDENT AVG CHART.
   *
   * @param exams An array of Exam objects containing student grades and subjects.
   * @param selectedStudents An array of selected student names to consider (empty array for all students).
   * @param selectedSubjects An array of selected subjects to consider (empty array for all subjects).
   * @returns An object containing two arrays - 'subjects' with subject names and 'averages' with their respective average grades.
   */
  private calculateSubjectAverages({
    selectedStudentIds,
    selectedSubjects,
  }: inputArguments): SubjectAverage {
    if (!this.exams || this.exams.length === 0)
      return { subjects: [], averages: [] };

    // Create an object to store the sum and count of grades for each subject
    const subjectData: { [key: string]: { sum: number; count: number } } = {};

    // Iterate through the students to calculate sum and count for each subject
    for (const studentExam of this.exams) {
      if (
        selectedStudentIds.length === 0 ||
        selectedStudentIds.includes(studentExam.studentId)
      ) {
        if (
          selectedSubjects.length === 0 ||
          selectedSubjects.includes(studentExam.subject)
        ) {
          const { subject, grade } = studentExam;
          if (!subjectData[subject]) {
            subjectData[subject] = { sum: 0, count: 0 };
          }
          subjectData[subject].sum += grade;
          subjectData[subject].count++;
        }
      }
    }

    // Calculate the average grade for each subject and create arrays for subjects and averages
    const subjects: string[] = [];
    const averages: number[] = [];

    for (const subject in subjectData) {
      if (subjectData.hasOwnProperty(subject)) {
        const average = Math.round(
          subjectData[subject].sum / subjectData[subject].count,
        );
        subjects.push(subject);
        averages.push(average);
      }
    }
    return { subjects, averages };
  }

  /**
   * Calculates the average grade per student based on the selected subjects for the subjects chart.
   *
   * @param exams An array of Exam objects containing student grades and subjects.
   * @param selectedStudents An array of selected student names to consider (empty array for all students).
   * @param selectedSubjects An array of selected subjects to consider (empty array for all subjects).
   * @param maxStudentNo only the first maxStudentNo students will be considered (default: 20).
   * @returns An object containing two arrays - 'students' with student names and 'averages' with their respective average grades.
   */
  private calculateStudentAverages({
    selectedStudentIds,
    selectedSubjects,
    maxStudentNo = 15,
  }: inputArguments): StudentAverage {
    if (!this.exams || this.exams.length === 0)
      return { students: [], averages: [] };

    // Create an object to store the sum and count of grades for each student
    const studentData: {
      [key: string]: { sum: number; count: number; studentId: number };
    } = {};

    // Iterate through the exams to calculate sum and count for each student
    for (const studentExam of this.exams) {
      if (
        selectedStudentIds.length === 0 ||
        selectedStudentIds.includes(studentExam.studentId)
      ) {
        if (
          selectedSubjects.length === 0 ||
          selectedSubjects.includes(studentExam.subject)
        ) {
          const { name, grade } = studentExam;
          if (!studentData[name]) {
            studentData[name] = {
              sum: 0,
              count: 0,
              studentId: studentExam.studentId,
            };
          }
          studentData[name].sum += grade;
          studentData[name].count++;
          studentData[name].studentId = studentExam.studentId;
        }
      }
    }

    // Calculate the average grade for each student and create arrays for students and averages
    const students: string[] = [];
    const averages: number[] = [];

    for (const student in studentData) {
      if (studentData.hasOwnProperty(student)) {
        const average = Math.round(
          studentData[student].sum / studentData[student].count || 1,
        );
        students.push(student);
        averages.push(average);
      }
    }
    return {
      students: students.slice(0, maxStudentNo),
      averages: averages.slice(0, maxStudentNo),
      studentData,
    };
  }
}

function isDateInPast12Months(givenDate: Date) {
  // Create a date object for the current date
  const currentDate = new Date();

  // Calculate the date 12 months ago from the current date
  const twelveMonthsAgo = new Date(currentDate);
  twelveMonthsAgo.setMonth(currentDate.getMonth() - 12);

  // Convert the given date to a Date object if it's not already
  givenDate = new Date(givenDate);

  // Check if the given date is within the past 12 months
  return givenDate >= twelveMonthsAgo && givenDate <= currentDate;
}
