import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {WatchListItem} from '../../models/watchListItem';
import {Router} from '@angular/router';

@Component({
  selector: 'app-watchlist-card',
  templateUrl: './watchlist-card.component.html',
  styleUrls: ['./watchlist-card.component.css']
})
export class WatchlistCardComponent implements OnInit {

  @Input() watchListItem: WatchListItem;
  @Output() deleteItem: EventEmitter<WatchListItem> = new EventEmitter<WatchListItem>();

  renderItem: WatchListItem;
  constructor( private router: Router) { }

  ngOnInit(): void {
    this.renderItem = this.watchListItem;
  }

  styleChoice(): object {
    if (this.renderItem.change < 0) {
      return {color: 'red'};
    } else if (this.renderItem.change > 0) {
      return {color: 'green'};
    } else {
      return {color: 'black'};
    }
  }

  onDelete(renderItem: WatchListItem): void {
    this.deleteItem.emit(renderItem);
  }

  goToDetails(): void {
    this.router.navigate(['/details/' + `${this.watchListItem.ticker}`]).then(response => {
      console.log(response);
    });
  }
}
