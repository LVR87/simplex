import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
	selector: 'app-calc',
	templateUrl: './calc.component.html',
	styleUrls: ['./calc.component.css']
})
export class CalcComponent implements OnInit {
	isLinear = true;
	firstFormGroup: FormGroup;
	secondFormGroup: FormGroup;
	thirdFormGroup: FormGroup;
	xIndice: number[];
	rIndice: number[];

	constructor(private _formBuilder: FormBuilder) { }

	ngOnInit() {
		this.xIndice = [];
		this.rIndice = [];
		this.firstFormGroup = this._formBuilder.group({
			metodo: ['', Validators.required]
		});
		this.secondFormGroup = this._formBuilder.group({
			objetivo: ['', Validators.required]
		});
		this.addX();
		this.thirdFormGroup = this._formBuilder.group({
			r1: ['', Validators.required]
		});
		this.rIndice.push(1);

	}


	addX() {
		this.secondFormGroup.addControl('x' + (this.xIndice.length + 1), new FormControl('', Validators.required))
		this.xIndice.push(this.xIndice.length + 1);
	}

	delX(i) {
		this.secondFormGroup.removeControl('x' + i);
		this.xIndice.splice(i - 1, 1);

		let bla = []
		let l = this.xIndice.forEach(i => {
			let ctl = this.secondFormGroup.get('x' + i);
			bla.push(ctl ? ctl.value : '');
			this.secondFormGroup.removeControl('x' + i);
		})

		let indice = 0;
		this.xIndice = bla.map(b => {
			this.secondFormGroup.addControl('x' + ++indice, new FormControl(b, Validators.required));
			return indice;
		});
	}


}
