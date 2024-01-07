import { Component, effect, ViewChild } from '@angular/core';

import { ChartComponent, NgApexchartsModule } from 'ng-apexcharts';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ChartDataService } from '../chart-data.service';
import { ApexOptions } from 'ng-apexcharts/lib/model/apex-types';
import { defaultChartOptions } from '../chart-default-config';
import { SubjectAverage } from '../../interfaces/chart.interfaces';

const chartOptions: Partial<ApexOptions> = {
  ...defaultChartOptions,
  colors: ['#c2185b', '#cc1860', '#FF9F1C', '#B2B2B2'],
  series: [
    {
      name: 'Average',
      data: [],
    },
  ],
  title: {
    text: 'Averages per Subject',
    style: {
      fontSize: '14px',
      fontWeight: '400',
    },
  },
} as Partial<ApexOptions>;

@Component({
  selector: 'app-chart-subject',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, NgApexchartsModule, CommonModule],
  templateUrl: './chart-subject.component.html',
  styleUrl: './chart-subject.component.scss',
})
export class ChartSubjectComponent {
  @ViewChild('chart') chart: ChartComponent | null = null;
  public chartOptions = chartOptions as any;

  constructor(public chartDataService: ChartDataService) {
    effect(() => {
      const data = this.chartDataService.$subjectAverages();
      if (data) {
        this.updateChart(data);
      }
    });

    this.chartOptions = chartOptions;
  }

  private updateChart(data: SubjectAverage) {
    this.chartOptions.xaxis = {
      categories: data.subjects,
    };
    // chart update could not handle the change in values and categories simultaneously,
    // so I use setTimeout
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
