import { Component, Input, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';

import { Item, PikerService, Source } from '../../piker.service';
import { ModalService } from '../../../../shared/components/modal/modal.service';

@Component({
  selector: 'flx-analytics',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.scss'],
})
export class AnalyticsComponent implements OnInit {
  @Input() source: Source;
  @Input() filters: any[];

  // editingItem: Item;

  // highcharts stuff....
  Highcharts: typeof Highcharts = Highcharts; // required
  chartConstructor: string = 'chart'; // optional string, defaults to 'chart'
  // chartOptions: Highcharts.Options = {}; // required
  chartCallback: Highcharts.ChartCallbackFunction = function (chart) {}; // optional function, defaults to null
  updateFlag: boolean = false; // optional boolean
  oneToOneFlag: boolean = true; // optional boolean, defaults to false
  runOutsideAngular: boolean = false; // optional boolean, defaults to false

  loading = false;
  m2PricePerMonthChartOptions: Highcharts.Options;

  constructor(private _service: PikerService, private modalService: ModalService) {}

  async ngOnInit() {
    this.getm2PricePerMonthChartOptions();
  }

  async getm2PricePerMonthChartOptions(): Promise<void> {
    this.loading = true;
    const reportData = await this._service.getReport(this.filters);
    this.loading = false;
    console.log('reportData:', reportData);

    // Remap the data into the format Highcharts expects for a time series
    const seriesData = reportData.map((item) => {
      // Convert the date string to a Unix timestamp (milliseconds since 1970)
      const timestamp = new Date(item.month).getTime();
      // Return an array with the timestamp and the itemsCount value
      return [timestamp, item.m2PriceMedianAverage];
    });

    this.m2PricePerMonthChartOptions = {
      chart: {
        height: 400,
      },
      title: {
        text: 'm2 price median average per month',
      },
      // subtitle: {
      //   text: 'Podaci od rujna 2025.',
      // },
      series: [
        {
          data: seriesData,
          type: 'line',
          name: 'm2 price median average',
        },
      ],
      xAxis: {
        // Set the x-axis type to 'datetime' to handle timestamps
        type: 'datetime',
        title: {
          text: '',
        },
      },
      yAxis: {
        title: {
          text: '',
        },
      },
      legend: {
        enabled: true,
      },
    };
  }
}
