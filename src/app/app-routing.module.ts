import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {PostsComponent} from './posts/posts.component';
import {ContactComponent} from './contact/contact.component';
import {HomepageComponent} from './homepage/homepage.component';
import {WatchlistComponent} from './watchlist/watchlist.component';
import {PortfolioComponent} from './portfolio/portfolio.component';
import {DetailsComponent} from './details/details.component';

const routes: Routes = [
  {
    path: '',
    component: HomepageComponent
  },
  {
    path: 'watchlist',
    component: WatchlistComponent
  },
  {
    path: 'portfolio',
    component: PortfolioComponent
  },
  {
    path: 'details',
    component: DetailsComponent
  },
  {
    path: 'posts',
    component: PostsComponent
  },
  {
    path: 'contact',
    component: ContactComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
