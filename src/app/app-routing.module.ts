import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DetailPostComponent } from './detail-post/detail-post.component';
import { ListPopularProfileComponent } from './list-popular-profile/list-popular-profile.component';
import { ListPostComponent } from './list-post/list-post.component';
import { SearchResultComponent } from './search-result/search-result.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: 'post/:id',
    component: DetailPostComponent
  },
  {
    path: 'user/:id',
    component: ListPostComponent
  },
  {
    path: 'home',
    component: ListPopularProfileComponent
  },
  {
    path: 'search/:keyword',
    component: SearchResultComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
