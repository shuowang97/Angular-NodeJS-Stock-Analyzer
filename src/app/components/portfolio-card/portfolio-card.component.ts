import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {HomepageService} from '../../services/homepage.service';
import {PortfolioRenderItem} from '../../models/portfolioRenderItem';
import {BuyModalComponent} from '../buy-modal/buy-modal.component';
import {interval} from 'rxjs';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {PricePair} from '../../models/pricePair';
import {Router} from '@angular/router';
import {finalize, map} from 'rxjs/operators';
import {LastPrice} from '../../models/lastPrice';

@Component({
  selector: 'app-portfolio-card',
  templateUrl: './portfolio-card.component.html',
  styleUrls: ['./portfolio-card.component.css']
})
export class PortfolioCardComponent implements OnInit {
  @Input() itemToRender: PortfolioRenderItem;
  @Output() deletePortfolioItem: EventEmitter<string> = new EventEmitter<string>();

  pricePair: PricePair;
  loadingPrice = false;
  lastPrice: LastPrice;
  lastP: LastPrice;
  constructor(private modalService: NgbModal,
              private router: Router,
              private homepageService: HomepageService) { }

  ngOnInit(): void {
    // console.log('in here =========================');
  }

  styleChoice(): object {
    if (this.itemToRender.change < 0) {
      return {color: 'red'};
    } else if (this.itemToRender.change > 0) {
      return {color: 'green'};
    } else {
      return {color: 'black'};
    }
  }

  open(): void {
    const modalRef = this.modalService.open(BuyModalComponent);
    modalRef.componentInstance.ticker = this.itemToRender.ticker;
    modalRef.componentInstance.price = this.itemToRender.currentPrice;
    modalRef.result.then(result => {
      this.pricePair = result;
      const portfolioItems = JSON.parse(localStorage.getItem('portfolio'));
      this.itemToRender.qty += this.pricePair.quantity;

      this.itemToRender.totalPrice += this.pricePair.totalPrice;
      this.homepageService.getLastPriceAPI(this.itemToRender.ticker).subscribe(res => {
        this.lastPrice = res;
        this.lastP = this.lastPrice[0];
        // console.log(this.lastP);
        // console.log(this.lastP.last)
        this.itemToRender.currentPrice = parseFloat(this.lastP.last);

        this.itemToRender.share = parseFloat((this.itemToRender.totalPrice / this.itemToRender.qty).toFixed(3));
        this.itemToRender.change = this.itemToRender.currentPrice - this.itemToRender.share;
        this.itemToRender.marketValue = this.itemToRender.qty * this.itemToRender.currentPrice;
        for (const portfolioItem of portfolioItems) {
          if (portfolioItem.ticker === this.itemToRender.ticker) {
            portfolioItem.qty += this.pricePair.quantity;
            portfolioItem.totalPrice += this.pricePair.totalPrice;
          }
        }
        localStorage.setItem('portfolio', JSON.stringify(portfolioItems));
      });
      // this.itemToRender.currentPrice = parseFloat(parseFloat(this.lastP.last).toFixed(2));
      //
      // this.itemToRender.share = parseFloat((this.itemToRender.totalPrice / this.itemToRender.qty).toFixed(3));
      // this.itemToRender.change = this.itemToRender.currentPrice - this.itemToRender.share;
      // this.itemToRender.marketValue = this.itemToRender.qty * this.itemToRender.currentPrice;
      // for (const portfolioItem of portfolioItems) {
      //   if (portfolioItem.ticker === this.itemToRender.ticker) {
      //     portfolioItem.qty += this.pricePair.quantity;
      //     portfolioItem.totalPrice += this.pricePair.totalPrice;
      //   }
      // }
      // localStorage.setItem('portfolio', JSON.stringify(portfolioItems));
    })
      .catch(res => {
        console.log('click close');
      });
    // this.itemToRender.currentPrice = this.homepageService.getInstantPriceAPI(this.itemToRender.ticker).
    // pipe(map(res => {
    //   return res;
    // }));



  }

    // let lastPrice = null;
    // this.homepageService.getLastPriceAPI(this.itemToRender.ticker).pipe(
    //   finalize(() => {
    //     this.loadingPrice = false;
    //   })
    // ).subscribe(res => {
    //     lastPrice = res;
    //     this.itemToRender = lastPrice[0];
    //     console.log('curprice', this.itemToRender.currentPrice);
    //   });


  sell(): void {
    const modalRef = this.modalService.open(BuyModalComponent);
    modalRef.componentInstance.ticker = this.itemToRender.ticker;
    modalRef.componentInstance.price = this.itemToRender.currentPrice;
    modalRef.componentInstance.isSelling = true;
    modalRef.result.then(result => {
      this.pricePair = result;
      const portfolioItems = JSON.parse(localStorage.getItem('portfolio'));

      this.itemToRender.qty -= this.pricePair.quantity;
      this.itemToRender.totalPrice -= this.pricePair.totalPrice;

      this.homepageService.getLastPriceAPI(this.itemToRender.ticker).subscribe(res => {
        this.lastPrice = res;
        this.lastP = this.lastPrice[0];
        // console.log(this.lastP);
        // console.log(this.lastP.last)
        this.itemToRender.currentPrice = parseFloat(this.lastP.last);
        this.itemToRender.share = parseFloat((this.itemToRender.totalPrice / this.itemToRender.qty).toFixed(3));
        this.itemToRender.change = this.itemToRender.currentPrice - this.itemToRender.share;
        this.itemToRender.marketValue = this.itemToRender.qty * this.itemToRender.currentPrice;
        for (let i = 0; i < portfolioItems.length; i++) {
          const portfolioItem = portfolioItems[i];
          if (portfolioItem.ticker === this.itemToRender.ticker) {
            portfolioItem.qty -= this.pricePair.quantity;
            portfolioItem.totalPrice -= this.pricePair.totalPrice;
            // console.log('qty', portfolioItem.qty);
            if (portfolioItem.qty === 0) {
              portfolioItems.splice(i, 1);
              this.onDelete(portfolioItem.ticker);
            }
          }
        }
        localStorage.setItem('portfolio', JSON.stringify(portfolioItems));
      });

      // this.itemToRender.share = parseFloat((this.itemToRender.totalPrice / this.itemToRender.qty).toFixed(3));
      // this.itemToRender.change = this.itemToRender.currentPrice - this.itemToRender.share;
      // this.itemToRender.marketValue = this.itemToRender.qty * this.itemToRender.currentPrice;
      // for (let i = 0; i < portfolioItems.length; i++) {
      //   const portfolioItem = portfolioItems[i];
      //   if (portfolioItem.ticker === this.itemToRender.ticker) {
      //     portfolioItem.qty -= this.pricePair.quantity;
      //     portfolioItem.totalPrice -= this.pricePair.totalPrice;
      //     console.log('qty', portfolioItem.qty);
      //     if (portfolioItem.qty === 0) {
      //       portfolioItems.splice(i, 1);
      //       this.onDelete(portfolioItem.ticker);
      //     }
      //   }
      // }
      // localStorage.setItem('portfolio', JSON.stringify(portfolioItems));
    })
      .catch(res => {
        console.log('click close');
      });
  }

  onDelete(ticker: string): void {
    this.deletePortfolioItem.emit(ticker);
  }

  goToDetails(): void {
    this.router.navigate(['/details/' + `${this.itemToRender.ticker}`]).then(response => {
      console.log(response);
    });
  }
}
