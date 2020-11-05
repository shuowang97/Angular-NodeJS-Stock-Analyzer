import { Component, OnInit } from '@angular/core';
import {Item} from '../../models/item';
import {stringify} from 'querystring';
import {Router} from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  items: Item[];
  selectedIndex: number;
  constructor(private router: Router) { }

  ngOnInit(): void {
    this.items = [new Item('Search', ''),
                  new Item('Watchlist', 'watchlist'),
                  new Item('Portfolio', 'portfolio')];

    let url = window.location.href;
    let subUrl = url.substring(url.lastIndexOf('/') + 1);
    if (subUrl === 'watchlist') {
      this.selectedIndex = 1;
    }else if (subUrl === 'portfolio') {
      this.selectedIndex = 2;
    }else if (!url.includes('details')){
      this.selectedIndex = 0;
    }

    this.router.events.subscribe(() => {
      url = window.location.href;
      subUrl = url.substring(url.lastIndexOf('/') + 1);

      if (url.includes('details')) {
        this.selectedIndex = -1;
      } else {
        if (subUrl === 'watchlist') {
          this.selectedIndex = 1;
        }else if (subUrl === 'portfolio') {
          this.selectedIndex = 2;
        }else if (!url.includes('details')){
          this.selectedIndex = 0;
        }
      }
    });
  }

  select(i: number): void {
    this.selectedIndex = i;
  }
}
