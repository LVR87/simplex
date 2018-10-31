import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { GraficoComponent } from './grafico/grafico.component';
@Component({
	selector: 'app-calc',
	templateUrl: './calc.component.html',
	styleUrls: ['./calc.component.css']
})
export class CalcComponent implements OnInit {
	@ViewChild(GraficoComponent)
	grafico: GraficoComponent;

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
	showGraficoComp: boolean;
	showSimplexComp: boolean;


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


		this.addX();

		this.loadEx2();
		// this.loadEx4();
		// this.loadExPhPSimplexGrafico();
		this.showGrafico();
	}

	ngOnDestroy() {
		this.sub.map(s => s.unsubscribe());
	}


	showGrafico() {
		this.showGraficoComp = true;
		this.showSimplexComp = false;
		setTimeout(() => {
			this.grafico.restricoes = this.restricoes;
			this.grafico.funcao = this.funcao;
			this.grafico.loadComponents();
		});
	}

	showSimplex() {
		this.showSimplexComp = true;
		this.showGraficoComp = false;
	}

	getRestricoes() {
		return this.restricoes;
	}

	loadRestricoes(form?) {
		if (!form) form = this.restricaoFormGroup;

		let restricoesCtrl = this.rIndice.map(r => Object.keys(form).filter(k => k.includes('r' + r))).filter(r => r.length > 0);
		this.restricoes = restricoesCtrl.map(r => r.order(r=>r).map(r => form[r]));

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
	};

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
		this.buildFormRestricao();
	}

	

	buildFormRestricao() {
		this.rIndice = [];
		if (!this.restricaoFormGroup) {
			this.restricaoFormGroup = new FormGroup({});
			this.sub.add(this.restricaoFormGroup.valueChanges.subscribe(form=>this.loadRestricoes(form)));
		} else {
			Object.keys(this.restricaoFormGroup.controls).map(k => this.restricaoFormGroup.removeControl(k));
		}
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
		console.log('r' + i);
		this.restricaoFormGroup.removeControl('r' + i);
		this.restricaoFormGroup.removeControl('r' + i + 'op');
		this.xIndice.map(x => this.restricaoFormGroup.removeControl('r' + i + 'x' + x));

		this.rIndice.splice(i - 1, 1);

		let bla = [];
		this.rIndice.forEach(i => {
			let l = [];

			let ctl = this.restricaoFormGroup.get('r' + i);
			l.push(ctl ? ctl.value : '');
			this.restricaoFormGroup.removeControl('r' + i);

			ctl = this.restricaoFormGroup.get('r' + i + 'op');
			l.push(ctl ? ctl.value : '');
			this.restricaoFormGroup.removeControl('r' + i + 'op');

			let x = [];
			this.xIndice.map(() => {
				let name = 'r' + i + 'x' + x.length + 1;
				ctl = this.restricaoFormGroup.get(name);
				x.push(ctl ? ctl.value : '');
				this.restricaoFormGroup.removeControl(name);
			});
			l.push(x);
			bla.push(l);
		});

		console.log('bla',bla);

		let indiceR = 0;
		this.rIndice = bla.map(l => {
			indiceR++;

			let indiceX = 1;
			l[2].forEach(xx => {
				this.restricaoFormGroup.addControl('r' + indiceR + 'x' + indiceX++, new FormControl(xx, Validators.required))
			});

			this.restricaoFormGroup.addControl('r' + indiceR + 'op', new FormControl(l[1], Validators.required));
			this.restricaoFormGroup.addControl('r' + indiceR, new FormControl(l[0], Validators.required));

			return indiceR;
		});

		if (this.rIndice.length == 0) this.buildFormRestricao();
	}

	loadEx2() {
		console.log('loading exercicio 02...');
		
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
		this.addR();
		this.restricaoFormGroup.controls['r4x1'].setValue(1);
		this.restricaoFormGroup.controls['r4x2'].setValue(0);
		this.restricaoFormGroup.controls['r4op'].setValue('>=');
		this.restricaoFormGroup.controls['r4'].setValue(10);
		this.addR();
		this.restricaoFormGroup.controls['r5x1'].setValue(0);
		this.restricaoFormGroup.controls['r5x2'].setValue(1);
		this.restricaoFormGroup.controls['r5op'].setValue('>=');
		this.restricaoFormGroup.controls['r5'].setValue(5);
		this.addR();
		this.restricaoFormGroup.controls['r6x1'].setValue(1);
		this.restricaoFormGroup.controls['r6x2'].setValue(2);
		this.restricaoFormGroup.controls['r6op'].setValue('>=');
		this.restricaoFormGroup.controls['r6'].setValue(30);
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

}

