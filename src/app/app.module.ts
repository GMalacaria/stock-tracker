import { registerLocaleData } from '@angular/common';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import localeIt from '@angular/common/locales/it';
registerLocaleData(localeIt);

@NgModule({
  declarations: [AppComponent],
  imports: [AppRoutingModule, BrowserModule, RouterModule],
  providers: [],
  exports: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
