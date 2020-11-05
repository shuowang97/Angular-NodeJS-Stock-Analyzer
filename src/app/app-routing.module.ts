import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {PostsComponent} from './components/posts/posts.component';
import {ContactComponent} from './components/contact/contact.component';
import {HomepageComponent} from './components/homepage/homepage.component';
import {WatchlistComponent} from './components/watchlist/watchlist.component';
import {PortfolioComponent} from './components/portfolio/portfolio.component';
import {DetailsComponent} from './components/details/details.component';

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
    path: 'details/:id',
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
