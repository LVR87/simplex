import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
	selector: 'app-calc',
	templateUrl: './calc.component.html',
	styleUrls: ['./calc.component.css']
})
export class CalcComponent implements OnInit {
	isLinear = true;
	funcaoFormGroup: FormGroup;
	restricaoFormGroup: FormGroup;
	xIndice: number[];
	rIndice: number[];


	labelFO: string = '';
	funcao: any[];
	labelRestricao: string[] = [];
	restricoes: any[];

	disabledGrafico: boolean;
	showGrafico: boolean;
	showSimplex: boolean;


	private sub: any[];

	constructor(private _formBuilder: FormBuilder) { }

	ngOnInit() {
		this.sub = [];
		this.xIndice = [];
		this.rIndice = [];

		this.funcaoFormGroup = new FormGroup({
			objetivo: new FormControl('', Validators.required)
		});

		this.sub.push(this.funcaoFormGroup.valueChanges.subscribe(form => {
			this.funcao = [];
			this.funcao[0] = form.objetivo;

			this.labelFO = form.objetivo + '(z) = ';
			let i = 1;
			while (form['x' + i]) {
				if (i != 1)
					this.labelFO += ' + ';

				this.funcao.push(form['x' + i]);
				this.labelFO += form['x' + i] + '.x' + i;
				i++;
			}
		}));

		this.restricaoFormGroup = new FormGroup({});
		this.sub.push(this.restricaoFormGroup.valueChanges.subscribe(form => {

			let restricoesCtrl = this.rIndice.map(r => Object.keys(form).filter(k => k.includes('r' + r)).map(k => k));
			this.restricoes = restricoesCtrl.order(r => r).map(r => r.map(r => form[r]));

			let i = 0;
			this.labelRestricao = restricoesCtrl.map(r => {
				let label = this.xIndice.map(x => r.filter(r => r.includes('x' + x))
					.map(r => form[r] == 1 ? 'x' + x : form[r] + '.x' + x)
					.filter(r => !r.includes('0')))
					.toString()
					.replace(',', ' + ')
					.trim();
				if (label.endsWith('+'))
					label = label.substr(0, label.length - 2).trim();
				if (label.startsWith('+'))
					label = label.substr(1, label.length - 1).trim();

				label += ' ' + form[r.find(r => r.includes('op'))];
				label += ' ' + form[r.find(r => r === 'r' + ++i)];

				return label;
			});

			this.disabledGrafico = this.xIndice.length > 2;

		}));


		this.addX();

		// this.loadEx2();
		// this.loadEx4();
		this.loadExPhPSimplexGrafico();
		this.grafico();
	}

	ngOnDestroy() {
		this.sub.map(s => s.unsubscribe());
	}


	grafico() {
		this.showGrafico = true;
		this.showSimplex = false;
	}

	simplex() {
		this.showSimplex = true;
		this.showGrafico = false;
	}

	loadEx2() {
		// 1 passo
		this.addX();
		this.funcaoFormGroup.controls['objetivo'].setValue('Max');
		this.funcaoFormGroup.controls['x1'].setValue(100);
		this.funcaoFormGroup.controls['x2'].setValue(150);

		// 2 pass
		this.restricaoFormGroup.controls['r1x1'].setValue(2);
		this.restricaoFormGroup.controls['r1x2'].setValue(3);
		this.restricaoFormGroup.controls['r1op'].setValue('<=');
		this.restricaoFormGroup.controls['r1'].setValue(120);
		this.addR();
		this.restricaoFormGroup.controls['r2x1'].setValue(1);
		this.restricaoFormGroup.controls['r2x2'].setValue(0);
		this.restricaoFormGroup.controls['r2op'].setValue('<=');
		this.restricaoFormGroup.controls['r2'].setValue(40);
		this.addR();
		this.restricaoFormGroup.controls['r3x1'].setValue(0);
		this.restricaoFormGroup.controls['r3x2'].setValue(1);
		this.restricaoFormGroup.controls['r3op'].setValue('<=');
		this.restricaoFormGroup.controls['r3'].setValue(30);
	}

	loadEx4() {
		// 1 passo
		this.addX();
		this.funcaoFormGroup.controls['objetivo'].setValue('Max');
		this.funcaoFormGroup.controls['x1'].setValue(6);
		this.funcaoFormGroup.controls['x2'].setValue(8);

		// 2 pass
		this.restricaoFormGroup.controls['r1x1'].setValue(4);
		this.restricaoFormGroup.controls['r1x2'].setValue(10);
		this.restricaoFormGroup.controls['r1op'].setValue('<=');
		this.restricaoFormGroup.controls['r1'].setValue(600);
		this.addR();
		this.restricaoFormGroup.controls['r2x1'].setValue(8);
		this.restricaoFormGroup.controls['r2x2'].setValue(4);
		this.restricaoFormGroup.controls['r2op'].setValue('<=');
		this.restricaoFormGroup.controls['r2'].setValue(400);
		
	}

	loadExPhPSimplexGrafico() {
		// 1 passo
		this.addX();
		this.funcaoFormGroup.controls['objetivo'].setValue('Max');
		this.funcaoFormGroup.controls['x1'].setValue(3);
		this.funcaoFormGroup.controls['x2'].setValue(2);

		// 2 pass
		this.restricaoFormGroup.controls['r1x1'].setValue(2);
		this.restricaoFormGroup.controls['r1x2'].setValue(1);
		this.restricaoFormGroup.controls['r1op'].setValue('<=');
		this.restricaoFormGroup.controls['r1'].setValue(18);
		this.addR();
		this.restricaoFormGroup.controls['r2x1'].setValue(2);
		this.restricaoFormGroup.controls['r2x2'].setValue(3);
		this.restricaoFormGroup.controls['r2op'].setValue('<=');
		this.restricaoFormGroup.controls['r2'].setValue(42);
		this.addR();
		this.restricaoFormGroup.controls['r3x1'].setValue(3);
		this.restricaoFormGroup.controls['r3x2'].setValue(1);
		this.restricaoFormGroup.controls['r3op'].setValue('<=');
		this.restricaoFormGroup.controls['r3'].setValue(24);
		
	}


	addX() {
		this.funcaoFormGroup.addControl('x' + (this.xIndice.length + 1), new FormControl('', Validators.required))
		this.xIndice.push(this.xIndice.length + 1);

		this.buildFormRestricao();
	}

	delX(i) {
		this.funcaoFormGroup.removeControl('x' + i);
		this.xIndice.splice(i - 1, 1);

		let bla = []
		let l = this.xIndice.forEach(i => {
			let ctl = this.funcaoFormGroup.get('x' + i);
			bla.push(ctl ? ctl.value : '');
			this.funcaoFormGroup.removeControl('x' + i);
		})

		let indice = 0;
		this.xIndice = bla.map(b => {
			this.funcaoFormGroup.addControl('x' + ++indice, new FormControl(b, Validators.required));
			return indice;
		});

		if (this.xIndice.length == 0) this.addX();
	}


	buildFormRestricao() {
		this.restricaoFormGroup.reset();
		this.rIndice = [];
		this.addR();
	}

	addR() {
		this.restricaoFormGroup.addControl('r' + (this.rIndice.length + 1), new FormControl('', Validators.required));
		this.restricaoFormGroup.addControl('r' + (this.rIndice.length + 1) + 'op', new FormControl('<=', Validators.required));

		let x = 1;
		this.xIndice.map(() => {
			let name = 'r' + (this.rIndice.length + 1) + 'x' + x++;
			this.restricaoFormGroup.addControl(name, new FormControl('', Validators.required));
		});


		this.rIndice.push(this.rIndice.length + 1);
	}

	delR(i) {
		this.restricaoFormGroup.removeControl('r' + i);
		this.restricaoFormGroup.removeControl('r' + i + 'op');

		this.xIndice.map(x => this.restricaoFormGroup.removeControl('r' + i + 'x' + x));

		this.rIndice.splice(i - 1, 1);

		let bla = [];
		this.rIndice.forEach(i => {
			let l = [];
			let ctl = this.funcaoFormGroup.get('r' + i);
			l.push(ctl ? ctl.value : '');
			this.funcaoFormGroup.removeControl('r' + i);

			ctl = this.funcaoFormGroup.get('r' + i + 'op');
			l.push(ctl ? ctl.value : '');
			this.funcaoFormGroup.removeControl('r' + i + 'op');

			let x = [];
			this.xIndice.map(() => {
				let name = 'r' + i + 'x' + x.length + 1;
				ctl = this.funcaoFormGroup.get(name);
				x.push(ctl ? ctl.value : '');
				this.funcaoFormGroup.removeControl(name);
			});
			l.push(x);
			bla.push(l);
		});

		let indice = 0;
		this.rIndice = bla.map(l => {
			indice++;

			this.funcaoFormGroup.addControl('r' + indice, new FormControl(l[0], Validators.required))
			this.funcaoFormGroup.addControl('r' + indice + 'op', new FormControl(l[1], Validators.required))

			let indiceX = 1;
			l[2].forEach(xx => {
				this.funcaoFormGroup.addControl('r' + indice + 'x' + indiceX++, new FormControl(xx, Validators.required))
			});
			return indice;
		});

		if (this.rIndice.length == 0) this.addR();
	}


}

