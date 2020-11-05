import { Component, OnInit } from '@angular/core';
import {HomepageService} from '../../services/homepage.service';
import {WatchListItem} from '../../models/watchListItem';
import {LastPrice} from '../../models/lastPrice';

@Component({
  selector: 'app-watchlist',
  templateUrl: './watchlist.component.html',
  styleUrls: ['./watchlist.component.css']
})
export class WatchlistComponent implements OnInit {

  watchListItems = [];
  watchListItem: WatchListItem;
  renderList: WatchListItem[] = [];
  lastPrice: LastPrice;
  stockDiffer: number;
  showUpAlert = false;
  constructor(private  homePageService: HomepageService) { }
  ngOnInit(): void {

    this.watchListItems = JSON.parse(localStorage.getItem('watchList'));
    if (this.watchListItems === null || this.watchListItems.length === 0) {
      this.watchListItems = [];
      this.showUpAlert = true;
    }
    for (const curItem of this.watchListItems) {
      this.homePageService.getLastPriceAPI(curItem.ticker).subscribe(res => {
        this.lastPrice = res;
        this.stockDiffer = parseFloat((parseFloat(this.lastPrice[0].last) - parseFloat(this.lastPrice[0].prevClose)).toFixed(2)),
        this.watchListItem = new WatchListItem(curItem.ticker, curItem.name, this.lastPrice[0].last,
          this.stockDiffer, parseFloat((this.stockDiffer * 100 / parseFloat(this.lastPrice[0].prevClose)).toFixed(2)));
        this.renderList.push(this.watchListItem);
        this.renderList.sort((a, b) => a.ticker.localeCompare(b.ticker));
      });
    }
    console.log(this.renderList);
  }

  addMoreSpace(i: number): object {
    if (i === this.renderList.length - 1) {
      return {'mb-5': true};
    }
    return {};
  }

  deleteItem(listItem: WatchListItem): void {
    // delete in renderList
    for (let i = 0; i < this.renderList.length; i++) {
      const curItem = this.renderList[i];
      if (listItem.ticker === curItem.ticker) {
        this.renderList.splice(i, 1);
        break;
      }
    }
    if (this.renderList.length === 0) {
      this.showUpAlert = true;
    }
    this.watchListItems = JSON.parse(localStorage.getItem('watchList'));
    // why we need to do it again for watchList? because renderList has a different sequence
    // delete in localStorage
    for (let i = 0; i < this.watchListItems.length; i++) {
      const curItem = this.watchListItems[i];
      if (listItem.ticker === curItem.ticker) {
        this.watchListItems.splice(i, 1);
        break;
      }
    }
    localStorage.setItem('watchList', JSON.stringify(this.watchListItems));
  }
}
