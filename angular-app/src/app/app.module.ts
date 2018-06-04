import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { CookieModule } from 'ngx-cookie';

import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { HomeComponent } from './home/home.component';
import { IndexComponent } from './index/index.component';
import { NewsComponent } from './news/news.component';
import { StocksComponent } from './stocks/stocks.component';
import { AuthorizationService } from './authorization.service';
import { NavigationHeaderComponent } from './navigation-header/navigation-header.component';
import { AccountComponent } from './account/account.component';
import { AdminComponent } from './admin/admin.component';
import { FooterComponent } from './footer/footer.component';

import { AuthGuard } from './auth.guard';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    IndexComponent,
    NewsComponent,
    StocksComponent,
    NavigationHeaderComponent,
    AccountComponent,
    AdminComponent,
    FooterComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    HttpClientModule,
    AppRoutingModule,
    CookieModule.forRoot()
  ],
  providers: [AuthorizationService, AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
