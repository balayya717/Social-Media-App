import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './posts/home/home.component';
import { PostFeedComponent } from './posts/post-feed/post-feed.component';

const routes: Routes = [
  {path:"", component: HomeComponent},
  { path: "postfeed", component: PostFeedComponent },
  {path:"**", redirectTo:'/'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
