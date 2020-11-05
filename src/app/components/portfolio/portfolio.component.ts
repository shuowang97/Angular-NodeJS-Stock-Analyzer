import { Component, OnInit } from '@angular/core';
import {HomepageService} from '../../services/homepage.service';
import {PortfolioRenderItem} from '../../models/portfolioRenderItem';
import {LastPrice} from '../../models/lastPrice';

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.css']
})
export class PortfolioComponent implements OnInit {

  portfolioRenderItems: PortfolioRenderItem[] = [];
  totalCards: number;
  currentCards = 0;
  showUpAlert = false;
  constructor(private homePageService: HomepageService) { }

  ngOnInit(): void {
    let portfolioLocal = JSON.parse(localStorage.getItem('portfolio'));
    if (portfolioLocal === null || portfolioLocal.length === 0) {
      this.showUpAlert = true;
      portfolioLocal = [];
    }
    portfolioLocal.sort((a, b) => a.name.localeCompare(b.name));
    this.totalCards = portfolioLocal.length;
    for (let i = 0; i < portfolioLocal.length; i++) {
      const item = portfolioLocal[i];
      let lastPrice: LastPrice = new LastPrice();
      const renderItem: PortfolioRenderItem = new PortfolioRenderItem();
      this.homePageService.getLastPriceAPI(item.ticker).subscribe(res => {
        lastPrice = res;
        renderItem.ticker = item.ticker;
        renderItem.name = item.name;
        renderItem.qty = item.qty;
        renderItem.totalPrice = item.totalPrice;
        renderItem.currentPrice = parseFloat(lastPrice[0].last);
        renderItem.share = parseFloat((item.totalPrice / item.qty).toFixed(3));
        renderItem.change = renderItem.currentPrice - renderItem.share;
        renderItem.marketValue = renderItem.qty * renderItem.currentPrice;
        renderItem.index = i;
        this.portfolioRenderItems[renderItem.index] = renderItem;
        this.currentCards ++;
      });
    }
  }

  deletePortfolioItem(ticker: string): void {
    for (let i = 0; i < this.portfolioRenderItems.length; i++) {
      const curItem = this.portfolioRenderItems[i];
      if (curItem.ticker === ticker) {
        this.portfolioRenderItems.splice(i, 1);
        break;
      }
    }
    if (this.portfolioRenderItems.length === 0) {
      this.showUpAlert = true;
    }
  }
}
