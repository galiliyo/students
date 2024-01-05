import { ApexOptions } from 'ng-apexcharts/lib/model/apex-types';

export const chartDefaultOptions: Partial<ApexOptions> = {
  theme: { mode: 'dark' },
  plotOptions: {
    bar: {
      distributed: true,
    },
  },
  colors: ['#12f3b7', '#cc1860', '#FF9F1C', '#B2B2B2'],
  series: [
    {
      name: 'Average',
      data: [],
    },
  ],
  chart: {
    height: 450,
    align: 'center',
    offsetX: 20,
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
