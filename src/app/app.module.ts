import { NgModule, LOCALE_ID } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import localept from '@angular/common/locales/pt';
import { HashLocationStrategy, LocationStrategy, registerLocaleData } from '@angular/common';
registerLocaleData(localept, 'pt');

import { AppRoutingModule } from './app.route';
import { UiModule } from './ui/ui.module';
import { AppComponent } from './app.component';
import { IntroducaoComponent } from './cap/introducao/introducao.component';
import { CalcComponent } from './calc/calc.component';
import { GraficoComponent } from './calc/grafico/grafico.component';
import { SimplexComponent } from './calc/simplex/simplex.component';

@NgModule({
  declarations: [
    AppComponent,
    IntroducaoComponent,
    CalcComponent,
    GraficoComponent,
    SimplexComponent
  ],
  imports: [
    BrowserModule
    , FormsModule
    , ReactiveFormsModule
    , AppRoutingModule
    , UiModule
  ],
  providers: [{ provide: LOCALE_ID, useValue: "pt" }],
  bootstrap: [AppComponent]
})
export class AppModule { }
