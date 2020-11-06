import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {HomepageService} from '../../services/homepage.service';
import {Options} from 'highcharts';
import IndicatorsCore from 'highcharts/indicators/indicators';
import * as Highcharts from 'highcharts/highstock';
import vbp from 'highcharts/indicators/volume-by-price';
import DateTimeFormat = Intl.DateTimeFormat;
import {interval} from 'rxjs';
IndicatorsCore(Highcharts);
vbp(Highcharts);

@Component({
  selector: 'app-summary-chart',
  templateUrl: './summary-chart.component.html',
  styleUrls: ['./summary-chart.component.css']
})
export class SummaryChartComponent implements OnInit {

  dailyList = [];
  newDailyList = [];
  prices = [];
  chartOptions: Options;
  Highcharts: typeof Highcharts = Highcharts;
  // @Input() stockDiffer: number;
  // @Input() closeMarket: boolean;
  @Input() parent: any;
  @Output() uploadStatus: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() pricesInChart;
  colorString = '';
  updateflag = false;
  stockDiffer = 0;
  closeMarket = false;
  loadingChart = true;

  constructor(private homePageService: HomepageService) {  }
  getInstantStockTrend(subUrl: string): void {
    const subscription = interval(15000).subscribe(x => {
      if (this.closeMarket) {
        console.log('stock daily chart stop updating, caz market is close');
        subscription.unsubscribe();
      }
      this.homePageService.getDailyDataAPI(subUrl).subscribe(res => {
        this.prices = [];
        this.newDailyList = [];
        // console.log(res);
        this.dailyList = res;
        for (const data of this.dailyList) {
          this.newDailyList.push([new Date(data.date).valueOf(), data.close]);
        }
        // console.log(this.newDailyList);
        for (let i = 0; i < this.newDailyList.length; i++) {
          this.prices.push([
            this.newDailyList[i][0], // date
            this.newDailyList[i][1], // close
          ]);
        }
        this.chartOptions.series = [
          {
            name: subUrl,
            type: 'line',
            data: this.prices,
            color: this.colorString
          }
        ];
        this.updateflag = true;
      });
    });
  }

  ngOnInit(): void {
    this.prices = this.pricesInChart;
    console.log('pricesInChart', this.pricesInChart);

    // this.loadingChart = true;
    console.log('stock', this.parent);
    this.stockDiffer = this.parent.stockDiffer;
    this.closeMarket = this.parent.closeMarket;
    const url = window.location.href;
    const subUrl = url.substring(url.lastIndexOf('/') + 1);
    if (this.stockDiffer > 0) {
      this.colorString = 'green';
    } else if (this.stockDiffer < 0) {
      this.colorString = 'red';
    } else {
      this.colorString = 'black';
    }

    this.chartOptions = {

      rangeSelector: {
        enabled: false
      },

      time: {
        timezoneOffset: 7 * 60
      },

      xAxis: {
        type: 'datetime',
        dateTimeLabelFormats: {
          hour: '%H:%M'
        }
      },

      title: {
        text: subUrl
      },

      series: [
        {
          name: subUrl,
          type: 'line',
          data: this.prices,
          color: this.colorString
        }
      ],
      navigator: {
        series: {
          color: this.colorString,
          fillOpacity: 1
        }
      }
    };

    // this.loadingChart = false;
    // console.log('chart value', this.loadingChart);
    // this.updateStatus(this.loadingChart);

    // this.homePageService.getDailyDataAPI(subUrl).subscribe(res => {
    //   console.log(res);
    //   this.dailyList = res;
    //   for (const data of this.dailyList) {
    //     this.newDailyList.push([new Date(data.date).valueOf(), data.close]);
    //   }
    //   console.log(this.newDailyList);
    //
    //   for (let i = 0; i < this.newDailyList.length; i++) {
    //     this.prices.push([
    //       this.newDailyList[i][0], // date
    //       this.newDailyList[i][1], // close
    //     ]);
    //   }
    //   // this.chartOptions = {
    //   //
    //   //   rangeSelector: {
    //   //     enabled: false
    //   //   },
    //   //
    //   //   time: {
    //   //     timezoneOffset: 7 * 60
    //   //   },
    //   //
    //   //   xAxis: {
    //   //     type: 'datetime',
    //   //     dateTimeLabelFormats: {
    //   //       hour: '%H:%M'
    //   //     }
    //   //   },
    //   //
    //   //   title: {
    //   //     text: subUrl
    //   //   },
    //   //
    //   //   series: [
    //   //     {
    //   //       name: subUrl,
    //   //       type: 'line',
    //   //       data: this.prices,
    //   //       color: this.colorString
    //   //     }
    //   //   ],
    //   //   navigator: {
    //   //     series: {
    //   //       color: this.colorString,
    //   //       fillOpacity: 1
    //   //     }
    //   //   }
    //   // };
    //   //
    //   // this.loadingChart = false;
    //   // console.log('chart value', this.loadingChart);
    //   // this.updateStatus(this.loadingChart);
    // });

    if (!this.closeMarket) {
      this.getInstantStockTrend(subUrl);
    }

  }

  updateStatus(loadingChart: boolean): void {
    // console.log('update In Chart', loadingChart);
    this.uploadStatus.emit(loadingChart);
  }
}
