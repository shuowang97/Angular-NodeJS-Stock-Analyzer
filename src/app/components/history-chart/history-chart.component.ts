import { Component, OnInit } from '@angular/core';
import {HomepageService} from '../../services/homepage.service';
import * as Highcharts from 'highcharts/highstock';
import { Options } from 'highcharts/highstock';
import IndicatorsCore from 'highcharts/indicators/indicators';
import vbp from 'highcharts/indicators/volume-by-price';
IndicatorsCore(Highcharts);
vbp(Highcharts);

@Component({
  selector: 'app-history-chart',
  templateUrl: './history-chart.component.html',
  styleUrls: ['./history-chart.component.css']
})

export class HistoryChartComponent implements OnInit {

  Highcharts: typeof Highcharts = Highcharts;
  chartOptions: Options;
  historyList = [];
  newHistory = [];
  ohlc = [];
  volume = [];
  constructor(private homePageService: HomepageService) {
    const url = window.location.href;
    const subUrl = url.substring(url.lastIndexOf('/') + 1);
    homePageService.getHistoryDataAPI(subUrl).subscribe(res => {
      console.log(res);
      this.historyList = res;
      for (const data of this.historyList) {
        this.newHistory.push([new Date(data.date).valueOf(), data.open, data.high, data.low, data.close, data.volume]);
      }
      console.log(this.newHistory);
      for (let i = 0; i < this.newHistory.length; i += 1) {
        this.ohlc.push([
          this.newHistory[i][0], // the date
          this.newHistory[i][1], // open
          this.newHistory[i][2], // high
          this.newHistory[i][3], // low
          this.newHistory[i][4] // close
        ]);

        this.volume.push([
          this.newHistory[i][0], // the date
          this.newHistory[i][5] // the volume
        ]);
      }
      this.chartOptions =  {

        rangeSelector: {
          selected: 2
        },

        title: {
          text: subUrl + ' Historical'
        },

        subtitle: {
          text: 'With SMA and Volume by Price technical indicators'
        },

        yAxis: [{
          startOnTick: false,
          endOnTick: false,
          labels: {
            align: 'right',
            x: -3
          },
          title: {
            text: 'OHLC'
          },
          height: '60%',
          lineWidth: 2,
          resize: {
            enabled: true
          }
        }, {
          labels: {
            align: 'right',
            x: -3
          },
          title: {
            text: 'Volume'
          },
          top: '65%',
          height: '35%',
          offset: 0,
          lineWidth: 2
        }],

        tooltip: {
          split: true
        },

        plotOptions : {
          series: {
            dataGrouping: {
              units: [[ 'day', [1, 1, 1, 1, 1]], ['week',  [1] ]]
            }
          }
        },

        series: [{
          type: 'candlestick',
          name: subUrl,
          id: subUrl.toLowerCase(),
          zIndex: 2,
          data: this.ohlc
        }, {
          type: 'column',
          name: 'Volume',
          id: 'volume',
          data: this.volume,
          yAxis: 1
        }, {
          type: 'vbp',
          linkedTo: subUrl.toLowerCase(),
          params: {
            volumeSeriesID: 'volume'
          },
          dataLabels: {
            enabled: false
          },
          zoneLines: {
            enabled: false
          }
        }, {
          type: 'sma',
          linkedTo: subUrl.toLowerCase(),
          zIndex: 1,
          marker: {
            enabled: false
          }
        }]
      };

    });

  }

  ngOnInit(): void {
  }

}
