import { Component, effect, ViewChild } from '@angular/core';

import { ChartComponent, NgApexchartsModule } from 'ng-apexcharts';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ChartDataService } from '../chart-data.service';
import { ApexOptions } from 'ng-apexcharts/lib/model/apex-types';
import { defaultChartOptions } from '../chart-default-config';
import { StudentAverage } from '../../interfaces/chart.interfaces';
import { shortenName } from '../../utils';

// initial chart options
const chartOptions: Partial<ApexOptions> = {
  ...defaultChartOptions,
  colors: ['#12f3b7', '#cc1860', '#FF9F1C', '#B2B2B2'],
  series: [
    {
      name: 'Average',
      data: [],
    },
  ],
  title: {
    text: 'Averages per Student',
    style: {
      fontSize: '14px',
      fontWeight: '400',
    },
  },
} as Partial<ApexOptions>;

@Component({
  selector: 'app-chart-student',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, NgApexchartsModule, CommonModule],
  templateUrl: './chart-student.component.html',
  styleUrl: './chart-student.component.scss',
})
export class ChartStudentComponent {
  @ViewChild('chart') chart: ChartComponent | null = null;
  public chartOptions = chartOptions as any;

  constructor(public chartDataService: ChartDataService) {
    effect(() => {
      const data = this.chartDataService.$studentAverages();
      if (data) {
        this.updateChart(data);
      }
    });

    this.chartOptions = chartOptions;
  }

  private updateChart(data: StudentAverage) {
    this.chartOptions.xaxis = {
      categories: data.students.map((student) => shortenName(student)),
    };
    // chart update could not handle the change in values and categories simultaneously,
    // so I use setTimeout as a last resort
    setTimeout(
      () =>
        (this.chartOptions.series = [
          {
            name: 'Average',
            data: data.averages,
          },
        ]),
      0,
    );
  }
}
