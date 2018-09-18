import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app.route';
import { UiModule } from './ui/ui.module';
import { AppComponent } from './app.component';
import { IntroducaoComponent } from './cap/introducao/introducao.component';
import { CalcComponent } from './calc/calc.component';

@NgModule({
  declarations: [
    AppComponent,
    IntroducaoComponent,
    CalcComponent
  ],
  imports: [
    BrowserModule
    , FormsModule
    , ReactiveFormsModule
    , AppRoutingModule
    , UiModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
