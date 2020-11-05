import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PostsComponent } from './components/posts/posts.component';
import { HttpClientModule } from '@angular/common/http';
import { ContactComponent } from './components/contact/contact.component';
import { HomepageComponent } from './components/homepage/homepage.component';
import { WatchlistComponent } from './components/watchlist/watchlist.component';
import { PortfolioComponent } from './components/portfolio/portfolio.component';
import { DetailsComponent } from './components/details/details.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { OverlayModule } from '@angular/cdk/overlay';
import {ReactiveFormsModule} from '@angular/forms';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatInputModule} from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { FooterComponent } from './components/footer/footer.component';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { SummaryTabComponent } from './components/summary-tab/summary-tab.component';
import {MatTabsModule} from '@angular/material/tabs';
import { SummaryChartComponent } from './components/summary-chart/summary-chart.component';
import { NewsCardComponent } from './components/news-card/news-card.component';
import { NewsCardGroupComponent } from './components/news-card-group/news-card-group.component';
import { WatchlistCardComponent } from './components/watchlist-card/watchlist-card.component';
import { BuyModalComponent } from './components/buy-modal/buy-modal.component';
import {MatDialogModule} from '@angular/material/dialog';
import { PortfolioCardComponent } from './components/portfolio-card/portfolio-card.component';
import { ArraySortPipe } from './utils/arraySortPipe';
import { NewsModalComponent } from './components/news-modal/news-modal.component';
import { HistoryChartComponent } from './components/history-chart/history-chart.component';
import {HighchartsChartModule} from 'highcharts-angular';

@NgModule({
  declarations: [
    AppComponent,
    PostsComponent,
    ContactComponent,
    HomepageComponent,
    WatchlistComponent,
    PortfolioComponent,
    DetailsComponent,
    NavbarComponent,
    FooterComponent,
    SummaryTabComponent,
    SummaryChartComponent,
    NewsCardComponent,
    NewsCardGroupComponent,
    WatchlistCardComponent,
    BuyModalComponent,
    PortfolioCardComponent,
    ArraySortPipe,
    NewsModalComponent,
    HistoryChartComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    OverlayModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatInputModule,
    FormsModule,
    MatProgressSpinnerModule,
    MatTabsModule,
    MatDialogModule,
    HighchartsChartModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
