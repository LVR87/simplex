import { NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from './material.module';


@NgModule({
	imports: [
		CommonModule
		, MaterialModule
		, FormsModule
		, ReactiveFormsModule
	],
	exports: [
		MaterialModule
		, FormsModule
		, ReactiveFormsModule
	],
	declarations: []
})
export class UiModule { }
