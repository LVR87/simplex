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

	xIndice: number[];
	constructor(private _formBuilder: FormBuilder) { }

	ngOnInit() {
		this.xIndice = [];
		this.firstFormGroup = this._formBuilder.group({
			metodo: ['', Validators.required]
		});
		this.secondFormGroup = this._formBuilder.group({
			objetivo: ['', Validators.required]
		});
		this.addX();
	}


	addX() {
		this.secondFormGroup.addControl('x' + (this.xIndice.length+1), new FormControl('', Validators.required))
		this.xIndice.push(this.xIndice.length+1);
	}

	delX(i){
		this.secondFormGroup.removeControl('x'+i);
		this.xIndice.splice(i-1,1);

		let bla = []
		let l = this.xIndice.forEach(i=>{
			let ctl = this.secondFormGroup.get('x'+i);
			bla.push( ctl ? ctl.value : '' );
			this.secondFormGroup.removeControl('x'+i);
		})

		let indice = 0;
		this.xIndice = bla.map(b=>{
			this.secondFormGroup.addControl('x'+ ++indice, new FormControl(b, Validators.required);
			return indice;
		});


	}

}
