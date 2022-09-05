import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { StopWatchComponent } from './stop-watch/stop-watch.component';

import { NumToDatePipe } from './num-to-date.pipe';

@NgModule({
  declarations: [
    AppComponent,
    StopWatchComponent,
    NumToDatePipe,
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
