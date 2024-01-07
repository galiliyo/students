import { Component, effect } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import {
  ColumnDef,
  GenericTableComponent,
} from '../components/generic-table/generic-table.component';
import { ChartDataService } from '../analysis/chart-data.service';

interface MonitorData {
  id: number;
  name: string;
  average: number;
  noOfExams: number;
}
@Component({
  selector: 'app-monitor',
  standalone: true,
  imports: [AsyncPipe, GenericTableComponent],
  templateUrl: './monitor.component.html',
  styleUrl: './monitor.component.scss',
})
export class MonitorComponent {
  columnDefinitions: ColumnDef[] = [
    { colId: 'id', header: 'Student ID', sortable: true },
    { colId: 'name', header: 'Name', sortable: true },
    { colId: 'average', header: 'Average', sortable: true },
    { colId: 'noOfExams', header: 'Exams', sortable: true },
  ];
  displayData: MonitorData[] = [];

  constructor(private chartDataService: ChartDataService) {
    effect(() => {
      const studentAveragesMap =
        this.chartDataService.$studentAverages()?.studentAverages;
      const all: any[] = [];
      if (studentAveragesMap) {
        const all: MonitorData[] = [];

        studentAveragesMap.forEach((avg, studentId) => {
          all.push({
            id: studentId,
            name: avg.name,
            average: avg.average,
            noOfExams: avg.noOfExams,
          });
        });

        this.displayData = all;
        console.log('all', all);
      }
      return [];
    });
  }
}
