import { ApexOptions } from 'ng-apexcharts/lib/model/apex-types';

export const defaultChartOptions: Partial<ApexOptions> = {
  theme: { mode: 'dark' },
  plotOptions: {
    bar: {
      distributed: true,
    },
  },
  colors: [
    '#c2185bff',
    '#01baefff',
    '#a4f9c8ff',
    '#fee440ff',
    '#89ce94ff',
    '#c3a995ff',
    '#abc4abff',
    '#f3a712ff',
    '#d8cbc7ff',
  ],
  series: [
    {
      name: 'Average',
      data: [],
    },
  ],
  chart: {
    height: 450,
    align: 'center',
    width: '94%',
    type: 'bar',
  },
  title: {
    text: 'Averages per Student',
    style: {
      fontSize: '14px',
      fontWeight: '400',
    },
  },
  xaxis: {
    categories: [],
  },
  yaxis: {
    min: 0,
    max: 100,
  },
} as Partial<ApexOptions>;
