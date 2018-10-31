import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import Chart from 'chart.js';


@Component({
	selector: 'app-grafico',
	templateUrl: './grafico.component.html',
	styleUrls: ['./grafico.component.css'],
	providers: [CurrencyPipe]
})
export class GraficoComponent implements OnInit {

	@ViewChild('canvas') canvas: ElementRef;
	chart: any[] = [];


	@Input() restricoes: any[];
	@Input() funcao: any[];

	private infinity = 999999;
	private backgroundColor = [
		'rgba(255, 206, 86, 0.4)',
		'rgba(54, 162, 235, 0.4)',
		'rgba(255, 99, 132, 0.4)',
		'rgba(75, 192, 192, 0.4)',
		'rgba(153, 102, 255, 0.4)',
		'rgba(255, 159, 64, 0.4)',
		'rgba(100, 100, 100, 0.4)',
	];
	private borderColor = [
		'rgba(255, 206, 86, 1)',
		'rgba(54, 162, 235, 1)',
		'rgba(255,99,132,1)',
		'rgba(75, 192, 192, 1)',
		'rgba(153, 102, 255, 1)',
		'rgba(100, 100, 100, 1)'
	];;

	private pipe: CurrencyPipe;
	constructor(
		private elementRef: ElementRef
	) {
		this.pipe = new CurrencyPipe('pt-BR');
	}

	ngOnInit() {
		if (!!this.restricoes && !!this.funcao)
			this.loadComponents();
	}

	loadComponents() {
		let coordRegioesRestricoes = this.buildRegioes(Object.assign([], this.restricoes));
		console.log('coordRegioesRestricoes', coordRegioesRestricoes);

		let coordRegiaoInteresse = this.loadRegiaoInteresse(Object.assign([], this.restricoes)).filter(r => r.p.t);
		console.log('coordRegiaoInteresse', coordRegiaoInteresse);


		let valor = this.funcao[0].toUpperCase() === 'MAX' ?
			Math.max(...coordRegiaoInteresse.map(r => this.valorZ(r.p.x, r.p.y)))
			: Math.min(...coordRegiaoInteresse.map(r => this.valorZ(r.p.x, r.p.y)));

		let melhorPonto = coordRegiaoInteresse.filter(r => this.valorZ(r.p.x, r.p.y) == valor);
		console.log('melhorPonto', melhorPonto);

		setTimeout(() => this.buildChart(coordRegioesRestricoes, coordRegiaoInteresse, melhorPonto));
	}

	testeRegiao(x1, x2) {
		// console.log('--- testeRegiao( ' + x1 + ' , ' + x2 + ' )');
		return this.restricoes.map(r => {
			let soma = (r[2] * Math.round(x1)) + (r[3] * Math.round(x2));
			let t;
			switch (r[1]) {
				case "=":
					t = soma == r[0];
					break;
				case ">=":
					t = soma >= r[0];
					break;
				default:
					t = soma <= r[0];
					break;
			}
			// console.log(r[2] + ' * ' + x1 + '  +  ' + r[3] + ' * ' + x2 + ' = ' + soma, r[1], r[0], t);
			return t;
		}).filter(r => !r).length == 0;
	}


	buildRegioes(restricoes) {
		return restricoes.map(r => r.filter(r => Number.isInteger(r))).map((r, i) => {
			let p0 = {
				x: r[1] == 0 ? 0 : r[0] / r[1]
				, y: 0
			}
			p0['t'] = this.testeRegiao(p0.x, p0.y);

			let p1 = {
				x: 0
				, y: r[2] == 0 ? 0 : r[0] / r[2]
			}
			p1['t'] = this.testeRegiao(p1.x, p1.y);

			return [p0, p1]
		}).map((r, i) => { // atribuindo o infinito quando uma constante
			let p1 = r[0];
			let p2 = r[1];
			if (p1.x == 0 && p1.y == 0) {
				p1.x = this.infinity;
				p1.y = p2.y;
			}
			if (p2.x == 0 && p2.y == 0) {
				p2.x = p2.x;
				p2.y = this.infinity;
			}
			console.log('r' + (i + 1), p1, p2);
			return r;
		}).map(r => { // teste de regiao
			r[0]['t'] = this.testeRegiao(r[0].x, r[0].y);
			r[1]['t'] = this.testeRegiao(r[1].x, r[1].y);
			return r;
		});
	}

	loadRegiaoInteresse(restricoes) {
		console.log('---- interesse');
		let regioes = this.buildRegioes(restricoes);
		console.log('regioes', regioes);

		let mX = Math.max(...regioes.map(p => Math.max(...p.map(p => p.x !== this.infinity ? p.x : 0))));
		let mY = Math.max(...regioes.map(p => Math.max(...p.map(p => p.y !== this.infinity ? p.y : 0))));
		//equacao geral de reta 
		let egr = regioes.map(r => {
			let p1 = r[0].x > r[1].x ? r[1] : r[0];
			let p2 = r[0].x <= r[1].x ? r[1] : r[0];
			return [p1, p2];//ordenando os pontos
		}).map(r => {
			let p1 = r[0]; // let p1 = { x: 0, y: 1 };
			let p2 = r[1]; // let p2 = { x: 1, y: 3 };

			let x = (p1.y * 1) - (1 * p2.y);
			let y = (1 * p2.x) - (p1.x * 1);
			if (y == 0) y = 1;
			let c = (1 * p1.x * p2.y) - (1 * p1.y * p2.x);
			return { p1: p1, p2: p2, eqr: [x * -1 / y, 0, c * -1 / y] }; //reduzida
		});

		let coord = [];
		egr.map((r, i) => {
			let r1 = r;
			let e1 = Object.assign([], r1.eqr);

			egr.filter(r2 => r1 != r2).map((r2, i2) => {
				let e2 = Object.assign([], r2.eqr);

				let a = e2[2] - e1[2];
				let b = e1[0] - e2[0];

				let p = { x: (b == 0 ? 0 : a / b), y: (e1[0] * (b == 0 ? 0 : a / b) + e1[2]) };
				p['t'] = this.testeRegiao(p.x, p.y);

				console.log('coord', { r1: r1, r2: r2, p: p });
				coord.push({ r1: r1, r2: r2, p: p });
			});
		});
		console.log('bla', coord);
		return coord;
	}

	buildDatasetMelhorPonto(coord) {

		let data = [];
		data.addRange(coord.map(c=>c.p));
		return {
			type: 'line',
			fill: false,
			showLine : true,
			label: 'Melhor Ponto',
			data: data,
			backgroundColor: 'rgba(255,0,0,0.5)',
			borderColor: 'rgba(255,0,0.5)'
		}
	}

	builDatasetInteresse(coord) {

		let data = [];
		data.addRange(coord.filter(c => c.p.t).map(c => c.p));
		data.addRange(coord.filter(c => c.r1.p1.t).map(c => c.r1.p1));
		data.addRange(coord.filter(c => c.r1.p2.t).map(c => c.r1.p2));
		data.addRange(coord.filter(c => c.r2.p1.t).map(c => c.r2.p1));
		data.addRange(coord.filter(c => c.r2.p2.t).map(c => c.r2.p2));
		console.log('builDatasetInteresse', data);

		return {
			type: 'scatter',
			// fill: 'origin',
			// showLine : true,
			label: 'Interesse',
			data: data,
			backgroundColor: this.backgroundColor.last(),
			borderColor: this.borderColor.last()
		}
	}

	buildDatasetRestricoes(regioes) {
		// console.log('---dataset restricoes');
		let indice = -1;
		return regioes.map(p => {
			indice++;
			return {
				type: 'line',
				fill: 'zero',
				showLine: true,
				label: 'R' + (indice + 1),
				data: p,
				backgroundColor: this.backgroundColor[indice],
				borderColor: this.borderColor[indice]
			}
		})
	}

	valorZ(x1, x2) {
		return x1 * this.funcao[1] + x2 * this.funcao[2];
	}

	buildChart(coordRegioesRestricoes, coordRegiaoInteresse, melhorPonto) {
		let dataset = [];
		dataset.push(this.buildDatasetMelhorPonto(melhorPonto));
		dataset.push(this.builDatasetInteresse(coordRegiaoInteresse));
		dataset.addRange(this.buildDatasetRestricoes(coordRegioesRestricoes));

		console.log('dataset', dataset);

		let maxX = Math.max(...dataset.map(ds => Math.max(...ds.data.map(dt => dt.x == this.infinity ? 0 : dt.x)))) + 10;
		let maxY = Math.max(...dataset.map(ds => Math.max(...ds.data.map(dt => dt.y == this.infinity ? 0 : dt.y)))) + 10;

		this.chart = new Chart('canvas', {
			type: 'scatter',
			lineTension: 0,
			data: {
				datasets: dataset
			},
			options: {
				title: {
					display: false,
					text: 'Custom Chart Title'
				},
				tooltips: {
					callbacks: {
						title: (tooltipItem, data) => {
							let x1 = tooltipItem[0].xLabel;
							let x2 = tooltipItem[0].yLabel;
							return this.pipe.transform(this.valorZ(x1, x2), 'R$');
						},
						label: (tooltipItem, data) => {
							var label = '' + Math.round(tooltipItem.xLabel * 100) / 100;;
							if (label) {
								label += ' : ';
							}
							label += Math.round(tooltipItem.yLabel * 100) / 100;
							return label;
						}
					}
				},
				elements: {
					line: {
						tension: 0, // disables bezier curves
					}
				},
				// showLines: true,
				scales: {
					xAxes: [{
						type: 'linear',
						position: 'bottom',
						ticks: {
							min: 0,
							max: maxX
						}
					}],
					yAxes: [{
						type: 'linear',
						position: 'bottom',
						ticks: {
							min: 0,
							max: maxY
						}
					}]
				}
			}
		});
	}



}

