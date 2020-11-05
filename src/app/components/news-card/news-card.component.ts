import {Component, Input, OnInit} from '@angular/core';
import {News} from '../../models/news';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {NewsModalComponent} from '../news-modal/news-modal.component';

@Component({
  selector: 'app-news-card',
  templateUrl: './news-card.component.html',
  styleUrls: ['./news-card.component.css']
})


export class NewsCardComponent implements OnInit {
  monthArray = ['January', 'February', 'March', 'April', 'May', 'June', 'July',
    'August', 'September', 'October', 'November', 'December'];

  @Input() news: News;

  constructor(private modalService: NgbModal) {
  }

  ngOnInit(): void {
  }

  openShareModal(): void {
    const modalRef = this.modalService.open(NewsModalComponent);
    // let hostname: string;
    // const startIndex = this.news.url.indexOf('//') + 2;
    // hostname = this.news.url.substring(startIndex, this.news.url.length).split('/')[0];
    // console.log('url', this.news.url);
    // console.log('hostname', hostname);
    // const tempResList = hostname.split('.');
    // let tempRes = '';
    // if (tempResList.length === 3) {
    //   tempRes = tempResList[1];
    // }else {
    //   tempRes = tempResList[0];
    // }
    // modalRef.componentInstance.url = (tempRes.charAt(0).toUpperCase() + tempRes.slice(1));

    modalRef.componentInstance.url = this.news.url;
    modalRef.componentInstance.hostname = this.news.source.name;
    modalRef.componentInstance.image = this.news.urlToImage;
    const date = new Date(this.news.publishedAt);
    let dateString: string;
    dateString = this.monthArray[date.getMonth()] + ' ' + date.getDate() + ', ' + date.getFullYear();
    modalRef.componentInstance.publishDate = dateString;
    console.log('date', dateString);
    modalRef.componentInstance.title = this.news.title;
    modalRef.componentInstance.description = this.news.description;
  }
}
