import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {HomepageService} from '../../services/homepage.service';
import {LastPrice} from '../../models/lastPrice';
import {CompanyShort} from '../../models/companyShort';
import {finalize, map, tap} from 'rxjs/operators';

@Component({
  selector: 'app-summary-tab',
  templateUrl: './summary-tab.component.html',
  styleUrls: ['./summary-tab.component.css']
})
export class SummaryTabComponent implements OnInit {
  @Input() lastPrice: LastPrice;
  @Input() companyShort: CompanyShort;
  @Input() loadingLastPrice: boolean;
  @Input() loadingCompanyInfo: boolean;
  @Input() stockDiffer: number;
  @Input() closeMarket: boolean;
  @Output() uploadToDetails: EventEmitter<boolean> = new EventEmitter<boolean>();


  url: string = null;
  ticker: string = null;
  loadingChart = true;
  // lastPrice: LastPrice;
  // companyShort: CompanyShort;
  // companyShortArr = [];
  // loadingPrice = true;
  // loadingInfo = true;
  constructor(private homepageService: HomepageService) { }

  ngOnInit(): void {
    // console.log('tab value', this.parent.loadingChart);
    // this.parent.loadingChart = this.loadingChart;
    this.url = window.location.href;
    this.ticker = this.url.substring(this.url.lastIndexOf('/') + 1);

    // console.log('clocemarket', this.closeMarket);
    // console.log('stockdiffer', this.stockDiffer);

    // this.homepageService.getLastPrice(this.ticker).pipe(
    //   finalize(() => this.loadingPrice = false)
    // ).subscribe(res => {
    //   this.lastPrice = res;
    // });
    // this.homepageService.getCompanyDescription(this.ticker).pipe(
    //   finalize(() => this.loadingInfo = false)
    // ).subscribe(res => {
    //   this.companyShort = res;
    //   this.companyShortArr[0] = this.companyShort;
    // });
    // todo: due to watchList functionality, cannot use below
    // this.homepageService.getExistCompanyShort().pipe(
    //   finalize(() => this.loadingInfo = false)
    // ).subscribe(res => {
    //   this.companyShort = res;
    //   this.companyShortArr[0] = this.companyShort;
    // });
  }


  uploadStatus(statusFromChart: boolean): void {
    // console.log('uploadStatus', statusFromChart);
    this.uploadToDetails.emit(statusFromChart);
  }
}
