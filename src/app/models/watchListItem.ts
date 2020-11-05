export class WatchListItem {
  ticker: string;
  name: string;
  last: number;
  change: number;
  changePercent: number;

  constructor(ticker: string, name: string, last: number, change: number, changePercent: number) {
    this.ticker = ticker;
    this.name = name;
    this.last = last;
    this.change = change;
    this.changePercent = changePercent;
  }
}
