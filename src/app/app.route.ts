import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { IntroducaoComponent } from './cap/introducao/introducao.component';
import { CalcComponent } from './calc/calc.component';

const routes: Routes = [
	{ path: '', component: CalcComponent }
	, { path: 'calculadora', component: CalcComponent }
	, { path: '**', redirectTo: '', pathMatch: 'full' }
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule { }
