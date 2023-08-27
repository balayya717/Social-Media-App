import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations'
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './posts/home/home.component';

import{MatButtonModule} from '@angular/material/button'
import{MatBottomSheetModule} from '@angular/material/bottom-sheet'
import {MatCardModule} from '@angular/material/card';
import { AuthenticatorComponent } from './tools/authenticator/authenticator.component'
import { HttpClientModule } from '@angular/common/http';
import { MatDialogModule} from '@angular/material/dialog';
import {MatIconModule} from '@angular/material/icon';
import { CreatePostComponent } from './posts/create-post/create-post.component';
import { PostComponent } from './tools/post/post.component';
import { PostFeedComponent } from './posts/post-feed/post-feed.component';
import { UpdatePostComponent } from './tools/update-post/update-post.component';
import { CommentComponent } from './tools/comment/comment.component';
import { FormsModule } from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule} from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { SearchPipe } from './search.pipe';
import {MatRadioModule} from '@angular/material/radio'
 


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AuthenticatorComponent,
    CreatePostComponent,
    PostComponent,
    PostFeedComponent,
    UpdatePostComponent,
    CommentComponent,
    SearchPipe,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule, 
    MatButtonModule,
    MatCardModule,
    MatBottomSheetModule,
    HttpClientModule,
    MatDialogModule,
    MatIconModule,
    FormsModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatRadioModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

