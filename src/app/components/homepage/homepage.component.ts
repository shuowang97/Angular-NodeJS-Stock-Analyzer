import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup, NgForm} from '@angular/forms';
import {Observable, of} from 'rxjs';
import {CompanyInfo} from '../../models/companyInfo';
import {HomepageService} from '../../services/homepage.service';
import {map, filter, switchMap, tap, debounceTime, finalize} from 'rxjs/operators';
import {Router} from '@angular/router';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit {

  myControl = new FormControl();
  filteredOptions: CompanyInfo[];
  public keyword = '';

  loading = false;
  constructor(private homepageService: HomepageService,
              private router: Router) {}

  ngOnInit(): void {
      this.keyword = '';
      this.myControl.valueChanges.pipe(
        debounceTime(300),
        tap(() => this.loading = true),
        switchMap(value => this.homepageService.instantSearchAPI(value).pipe(
          map(companyInfoList => companyInfoList.filter(this.isExist)),
          finalize(() => this.loading = false)
        )),
      ).subscribe(res => {
        this.filteredOptions = res;
      });
  }

  private isExist(element, index, array): boolean {
    return (element.ticker && element.name);
  }

  displayFn(companyInfo: CompanyInfo): string {
    return companyInfo && companyInfo.name && companyInfo.ticker ? companyInfo.ticker : '';
  }
  // if we use [value]="option.ticker in mat-option, then we should use this function
  // displayFn(ticker: string): string {
  //   return ticker;
  // }

  onSubmit(): void {
    console.log(this.myControl.value.ticker);
    this.router.navigate(['/details/' + `${this.myControl.value.ticker}`]).then(response => {
      console.log(response);
    });
  }

}
