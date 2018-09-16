import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { UiModule } from './ui/ui.module';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule
    , UiModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
