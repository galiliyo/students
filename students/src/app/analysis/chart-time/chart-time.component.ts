import { Component, effect, ViewChild } from '@angular/core';
import { ChartComponent, NgApexchartsModule } from 'ng-apexcharts';
import { ApexOptions } from 'ng-apexcharts/lib/model/apex-types';
import { ChartDataService } from '../chart-data.service';
import { TimeSeriesData } from '../../interfaces/chart.interfaces';
import { defaultChartOptions } from '../chart-default-config';

const chartOptions: Partial<ApexOptions> = {
  ...defaultChartOptions,
  series: [],
  chart: {
    type: 'line',
    stacked: false,
    offsetX: 20,
    width: '94%',
    height: 450,
    zoom: {
      type: 'x',
      enabled: false,
      autoScaleYaxis: true,
    },
    toolbar: {
      autoSelected: 'zoom',
    },
  },
  dataLabels: {
    enabled: false,
  },
  markers: {
    size: 0,
  },
  title: {
    ...defaultChartOptions.title,
    text: 'Student Averages',
    align: 'left',
  },
  stroke: {
    width: 1,
  },
  yaxis: {
    labels: {
      formatter: function (val) {
        return (val / 1000000).toFixed(0);
      },
    },
    title: {
      text: 'Average',
    },
  },
  xaxis: {
    type: 'datetime',
  },
  tooltip: {
    shared: false,
    y: {
      formatter: function (val: number) {
        return (val / 1000000).toFixed(0);
      },
    },
  },
} as Partial<ApexOptions>;
@Component({
  selector: 'app-chart-time',
  standalone: true,
  imports: [NgApexchartsModule],
  templateUrl: './chart-time.component.html',
  styleUrl: './chart-time.component.scss',
})
export class ChartTimeComponent {
  @ViewChild('chart') chart: ChartComponent | null = null;
  public chartOptions = chartOptions as any;

  constructor(public chartDataService: ChartDataService) {
    effect(() => {
      const data = this.chartDataService.$timeSeriesData();
      if (data && data.series.length) {
        this.updateChart(data);
      }
    });

    this.chartOptions = chartOptions;
  }

  private updateChart(data: TimeSeriesData) {
    this.chartOptions.series = data.series;
  }
}
