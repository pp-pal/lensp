import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ApolloModule } from 'apollo-angular';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ListPostComponent } from './list-post/list-post.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { DetailPostComponent } from './detail-post/detail-post.component';
import { ListPopularProfileComponent } from './list-popular-profile/list-popular-profile.component';
import { MatDialogModule } from '@angular/material/dialog';
import { ModalPopupComponent } from './shared/modal-popup/modal-popup.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { SearchPopupComponent } from './shared/search-popup/search-popup.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { SearchResultComponent } from './search-result/search-result.component';
import { WalletService } from './services/wallet.service';
import { AddProfilePopupComponent } from './shared/add-profile-popup/add-profile-popup.component';
import { UserCardComponent } from './shared/user-card/user-card.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatBadgeModule } from '@angular/material/badge';
import { CreatePostPopupComponent } from './shared/create-post-popup/create-post-popup.component';
import { IsIndexedPopupComponent } from './shared/is-indexed-popup/is-indexed-popup.component';

@NgModule({
  declarations: [
    AppComponent,
    ListPostComponent,
    DetailPostComponent,
    ListPopularProfileComponent,
    ModalPopupComponent,
    SearchPopupComponent,
    SearchResultComponent,
    AddProfilePopupComponent,
    UserCardComponent,
    CreatePostPopupComponent,
    IsIndexedPopupComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ApolloModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatCardModule,
    MatButtonModule,
    MatDialogModule,
    MatSnackBarModule,
    MatIconModule,
    MatFormFieldModule,
    FormsModule,
    MatInputModule,
    MatTooltipModule,
    MatBadgeModule
  ],
  providers: [WalletService],
  bootstrap: [AppComponent]
})
export class AppModule { }
