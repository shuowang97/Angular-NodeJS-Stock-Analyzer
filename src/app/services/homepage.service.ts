import { Injectable } from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {CompanyInfo} from '../models/companyInfo';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {map, tap} from 'rxjs/operators';
import {CompanyShort} from '../models/companyShort';
import {LastPrice} from '../models/lastPrice';
import {News} from '../models/news';
import {NewsList} from '../models/newsList';
import {HttpParams} from '@angular/common/http';
import {tick} from '@angular/core/testing';


const tiingoKEY = 'b46119b62502a8ecc7e70d99b7c265bd9fbfd39d';

@Injectable({
  providedIn: 'root'
})
export class HomepageService {

  private utilityUrl = 'https://api.tiingo.com/tiingo/utilities/search/';
  private descriptionUrl = 'https://api.tiingo.com/tiingo/daily/';
  private lastPriceUrl = 'https://api.tiingo.com/iex';
  private historicalUrl = 'https://api.tiingo.com/tiingo/daily/';
  private newsUrl = 'https://newsapi.org/v2/everything?apiKey=bbef8dd425204e818bbead05dd243053&q=';
  companyShort$: Observable<CompanyShort>;
  lastPrice$: Observable<LastPrice>;
  newsList$: Observable<NewsList>;
  constructor(private http: HttpClient) { }


  getHistoryDataAPI(ticker: string): any {
    const url = '/routes/history/' + ticker;
    const response = this.http.get(url).pipe(
      map(res => {
        return res;
      }));
    console.log(response);
    return response;
  }

  instantSearchAPI(ticker: string): Observable<any> {
    const url = '/routes/utility/' + ticker;
    const response = this.http.get(url).pipe(
      map(res => {
        return res;
      }));
    console.log(response);
    return response;
  }


  instantSearch(input: string): Observable<CompanyInfo[]> {
    return this.http.get<CompanyInfo[]>(`${this.utilityUrl}${input}` + '?token=' + tiingoKEY);
  }

  getInstantPriceAPI(ticker: string): any {
    console.log('inside price API --------------------------------');

    const url = '/routes/lastprice/' + ticker;
    // console.log(this.http.get('routes/lastprice', {params}));
    const response = this.http.get(url).pipe(
      map(res => {
        return res;
      }));
    let ret = response.subscribe((res) => {
      console.log(res);
      return res;
    });
    console.log(ret);
    return ret;
  }

  getLastPriceAPI(ticker: string): any {
    // TODO: can also use below method
    // const opts = { params: new HttpParams({
    //     fromString : url
    //   })};
    // let
    const url = '/routes/lastprice/' + ticker;
    // console.log(this.http.get('routes/lastprice', {params}));
    const response = this.http.get(url).pipe(
      map(res => {
        return res;
      }));
    console.log(response);
    return response;
  }

  getCompanyDescriptionAPI(ticker: string): any {
    const url = '/routes/companyinfo/' + ticker;
    // console.log(this.http.get('routes/lastprice', {params}));
    const response = this.http.get(url).pipe(
      map(res => {
        return res;
      }));
    console.log(response);
    return response;
  }

  getNewsListAPI(ticker: string): any {
    const url = '/routes/news/' + ticker;
    const response = this.http.get(url).pipe(
      map(res => {
        return res;
      }));
    console.log(response);
    return response;
  }

  getLastPrice(ticker: string): Observable<LastPrice> {
    return this.lastPrice$ = this.http.get<LastPrice>(`${this.lastPriceUrl}` + '?tickers=' + `${ticker}` + '&token=' + tiingoKEY);
  }

  getCompanyDescription(ticker: string): Observable<CompanyShort> {
    return this.companyShort$ = this.http.get<CompanyShort>(`${this.descriptionUrl}${ticker}` + '?token=' + tiingoKEY);
  }

  getNewsList(ticker: string): Observable<NewsList> {
    return this.newsList$ = this.http.get<NewsList>(`${this.newsUrl}${ticker}`);
  }
}
