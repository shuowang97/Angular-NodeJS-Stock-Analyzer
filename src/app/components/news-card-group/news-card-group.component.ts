import {Component, Input, OnInit} from '@angular/core';
import {HomepageService} from '../../services/homepage.service';
import {News} from '../../models/news';
import {tick} from '@angular/core/testing';
import {finalize} from 'rxjs/operators';
import {NewsList} from '../../models/newsList';

@Component({
  selector: 'app-news-card-group',
  templateUrl: './news-card-group.component.html',
  styleUrls: ['./news-card-group.component.css']
})
export class NewsCardGroupComponent implements OnInit {
  @Input() selectedIndex: number;

  newsList: NewsList;
  newsArticles: News[];
  numOfArticles: number;
  url: string;
  ticker: string;
  loadingNewsList = true;
  constructor(private homePageService: HomepageService) { }

  ngOnInit(): void {
    if (this.selectedIndex !== 1) {
      this.url = window.location.href;
      this.ticker = this.url.substring(this.url.lastIndexOf('/') + 1);
      if (this.loadingNewsList === true) {
        this.homePageService.getNewsListAPI(this.ticker).pipe(
          finalize(() => this.loadingNewsList = false)
        ).subscribe(res => {
          this.newsList = res;
          this.newsArticles = this.newsList.articles;
          this.numOfArticles = this.newsArticles.length;
          // console.log('it is keep running!!!!!!!!!');
        });
      }
    } else {
      console.log(' return directly');

      // this.url = window.location.href;
      // this.ticker = this.url.substring(this.url.lastIndexOf('/') + 1);
      // if (this.loadingNewsList === true) {
      //   this.homePageService.getNewsList(this.ticker).pipe(
      //     finalize(() => this.loadingNewsList = false)
      //   ).subscribe(res => {
      //     this.newsList = res;
      //     this.newsArticles = this.newsList.articles;
      //     this.numOfArticles = this.newsArticles.length;
      //     console.log('it is keep running!!!!!!!!!');
      //   });
      // }
    }

  }

  addMoreSpace(i: number): object {
    if (this.numOfArticles % 2 === 0) {
      if (i === this.numOfArticles - 1 || i === this.numOfArticles - 2){
        return {'mb-4': true};
      }
    }else {
      if (i === this.numOfArticles - 1) {
        return {'mb-4': true};
      }
    }
  }
}
