import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {HomepageService} from '../../services/homepage.service';
import {finalize, takeUntil} from 'rxjs/operators';
import {CompanyShort} from '../../models/companyShort';
import {LastPrice} from '../../models/lastPrice';
import {interval, Observable} from 'rxjs';
import {MatTabGroup} from '@angular/material/tabs';
import {NewsList} from '../../models/newsList';
import {NgbActiveModal, NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {BuyModalComponent} from '../buy-modal/buy-modal.component';
import {PricePair} from '../../models/pricePair';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit {
  @ViewChild('tabGroup', {static: false}) tab: MatTabGroup;

  url: string = null;
  ticker: string = null;
  // retMap: Map<any, any> = null;
  loadingCompanyInfo = true;
  loadingLastPrice = true;
  companyShort: CompanyShort;
  lastPrice: LastPrice;
  lastP: LastPrice;
  stockDiffer: number;
  changePercent: number;
  currentTime: Date;
  lastSuccessTime: Date;
  timeString: string;
  closeDate: string;
  closeMarket: boolean;
  showAlert = false;
  existInLocalStorage = false;
  selectedIndex = 0;
  lastSuccessTimeString: string;
  newsList: NewsList;
  modalIsOpen = false;

  pricePair: PricePair;
  successBuyAlert = false;
  modalRef: NgbModalRef;
  loadingChart = true;
  dailyList = [];
  newDailyList = [];
  prices = [];
  constructor(private homePageService: HomepageService,
              private modalService: NgbModal) {
  }

  open(): void {
    this.modalRef = this.modalService.open(BuyModalComponent);
    this.modalRef.componentInstance.ticker = this.lastP.ticker;
    this.modalRef.componentInstance.price = this.lastP.last;
    // const subscription = interval(15000).subscribe(() => {
    //   this.modalRef.componentInstance.ticker = this.lastP.ticker;
    //   this.modalRef.componentInstance.price = this.lastP.last;
    // });
    this.modalRef.result.then(result => {
      // subscription.unsubscribe();
      this.pricePair = result;
      this.successBuyAlert = true;
      if (this.successBuyAlert) {
        interval(3000).subscribe(() => {
          this.successBuyAlert = false;
        });
      }
      let portfolioItems = JSON.parse(localStorage.getItem('portfolio'));
      if (portfolioItems === null) {
        portfolioItems = [];
      }
      const boughtItem = {
        ticker: this.ticker,
        name: this.companyShort.name,
        qty: this.pricePair.quantity,
        totalPrice: this.pricePair.totalPrice
      };
      let index = -1;
      for (let i = 0; i < portfolioItems.length; i++) {
        if (portfolioItems[i].ticker === boughtItem.ticker) {
          portfolioItems[i].qty += boughtItem.qty;
          portfolioItems[i].totalPrice += boughtItem.totalPrice;
          portfolioItems[i].totalPrice = parseFloat(portfolioItems[i].totalPrice.toFixed(2));
          index = i;
          break;
        }
      }
      if (index === -1) {
        portfolioItems.push(boughtItem);
      }
      localStorage.setItem('portfolio', JSON.stringify(portfolioItems));
    })
      .catch(res => {
        console.log('click close');
      });

  }

  ngOnInit(): void {
    this.url = window.location.href;
    this.ticker = this.url.substring(this.url.lastIndexOf('/') + 1);

    this.homePageService.getLastPriceAPI(this.ticker).pipe(
      finalize(() => this.loadingLastPrice = false)
    ).subscribe(res => {
      this.lastPrice = res;
      this.lastP = this.lastPrice[0];
      this.stockDiffer = parseFloat((parseFloat(this.lastPrice[0].last) - parseFloat(this.lastPrice[0].prevClose)).toFixed(2));
      this.changePercent = parseFloat((this.stockDiffer * 100 / parseFloat(this.lastPrice[0].prevClose)).toFixed(2));
      this.lastSuccessTime = new Date(this.lastPrice[0].timestamp);
      this.closeDate = this.lastPrice[0].timestamp.substring(0, 10);
      this.closeMarket = (this.currentTime.valueOf() - this.lastSuccessTime.valueOf()) >= 100000;
      if (this.closeMarket) {
        this.lastSuccessTimeString = this.lastSuccessTime.toString().substring(16, 24);
      }
      if (!this.closeMarket) {
        this.getOnChangingPrice(this.ticker);
      }
    });

    this.homePageService.getCompanyDescriptionAPI(this.ticker).pipe(
      finalize(() => this.loadingCompanyInfo = false)
    ).subscribe(res => {
      this.companyShort = res;
      this.existInLocalStorage = this.checkLocalStorage();
    });

    // this.homePageService.getNewsList(this.ticker).subscribe(res => {
    //   this.newsList = res;
    //   // this.newsArticles = this.newsList.articles;
    //   // this.numOfArticles = this.newsArticles.length;
    // });

    // this.homePageService.getExistCompanyShort().pipe(
    //   finalize(() => this.loadingCompanyInfo = false)
    // ).subscribe(res => {
    //   this.companyShort = res;
    //   this.companyShortArr[0] = this.companyShort;
    // });
    this.getCurrentTimeString();
    this.getDailyData(this.ticker);
  }

  private checkLocalStorage(): boolean {
    const newItem = {
      ticker: this.ticker,
      name: this.companyShort.name
    };
    const items = JSON.parse(localStorage.getItem('watchList'));
    let index = -1;
    for (let i = 0; items !== null && i < items.length; i++) {
      if (items[i].ticker === newItem.ticker) {
        index = i;
        break;
      }
    }
    return index !== -1;
  }

  private getCurrentTimeString(): void {
    this.currentTime = new Date();
    this.timeString = this.currentTime.getFullYear() + '-' +
      (this.currentTime.getMonth() + 1 < 10 ? '0' + (this.currentTime.getMonth() + 1) : this.currentTime.getMonth() + 1) + '-' +
      (this.currentTime.getDate() + 1 < 10 ? '0' + (this.currentTime.getDate()) : this.currentTime.getDate()) + ' ' +
      (this.currentTime.getHours() < 10 ? '0' + this.currentTime.getHours() : this.currentTime.getHours()) + ':' +
      (this.currentTime.getMinutes() < 10 ? '0' + this.currentTime.getMinutes() : this.currentTime.getMinutes()) + ':' +
      (this.currentTime.getSeconds() < 10 ? '0' + this.currentTime.getSeconds() : this.currentTime.getSeconds());
  }

  private getOnChangingPrice(ticker: string): void {
    // TODO: change it back later, 15s
    const subscription = interval(15000).subscribe(x => {
      this.homePageService.getLastPriceAPI(this.ticker).subscribe(res => {
        // const curSelectedIndex = this.tab.selectedIndex;
        console.log('running every 15s');
        this.lastPrice = res;
        this.lastP = this.lastPrice[0];
        this.stockDiffer = parseFloat((parseFloat(this.lastPrice[0].last) - parseFloat(this.lastPrice[0].prevClose)).toFixed(2));
        this.changePercent = parseFloat((this.stockDiffer * 100 / parseFloat(this.lastPrice[0].prevClose)).toFixed(2));
        this.lastSuccessTime = new Date(this.lastPrice[0].timestamp);
        this.closeDate = this.lastPrice[0].timestamp.substring(0, 10);
        this.closeMarket = (this.currentTime.valueOf() - this.lastSuccessTime.valueOf()) >= 100000;
        if (this.closeMarket) {
          this.lastSuccessTimeString = this.lastSuccessTime.toString().substring(16, 24);
        }
        // send value to modal, do not need to subscribe again in above open() function;
        // this.modalRef.componentInstance.price = this.lastP.last;

        this.getCurrentTimeString();
        console.log('current', this.timeString);
        // this.selectedIndex = curSelectedIndex;
        if (this.closeMarket) {
          subscription.unsubscribe();
          console.log('unsub..............');
        }
      });
    });
  }

  styleChoice(): object {
    if (this.stockDiffer < 0) {
      return {color: 'red'};
    } else if (this.stockDiffer > 0) {
      return {color: 'green'};
    } else {
      return {color: 'black'};
    }
  }

  changeButton(): void {
    const cur = this.checkLocalStorage();
    this.showAlert = true;
    const newItem = {
      ticker: this.ticker,
      name: this.companyShort.name
    };
    let items = JSON.parse(localStorage.getItem('watchList'));
    if (items === null) { items = []; }

    if (!this.existInLocalStorage) {
      items.push(newItem);
    } else {
      let index = -1;
      for (let i = 0; i < items.length; i++) {
        if (items[i].ticker === newItem.ticker) {
          index = i;
          break;
        }
      }
      if (index > -1) {
        items.splice(index, 1);
      }
    }
    localStorage.setItem('watchList', JSON.stringify(items));
    this.existInLocalStorage = !cur;
    if (this.showAlert) {
      interval(3000).subscribe(() => {
        this.showAlert = false;
      });
    }
  }

  receiveInDetails(statusFromChart: boolean): void {
    // console.log('statusFromChart', statusFromChart);
    this.loadingChart = statusFromChart;
  }

  getDailyData(ticker: string): any {
    this.loadingChart = true;
    this.homePageService.getDailyDataAPI(ticker).subscribe(res => {
      console.log(res);
      this.dailyList = res;
      for (const data of this.dailyList) {
        this.newDailyList.push([new Date(data.date).valueOf(), data.close]);
      }
      console.log(this.newDailyList);

      for (let i = 0; i < this.newDailyList.length; i++) {
        this.prices.push([
          this.newDailyList[i][0], // date
          this.newDailyList[i][1], // close
        ]);
      }
      this.loadingChart = false;
      console.log('loading in dETAILS', this.loadingChart);
    });
  }
}

