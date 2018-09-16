import { Inject, Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root'
})
export class ImageService {

	private _text: string;
	private _backgroud: string;
	private _color: string;
	private _width: number;
	private _height: number;

	private _server: string;
	private _ext: string;

	constructor() {
		this.default();
	}

	public default(){
		this._server = 'https://dummyimage.com';
		this._width = 320;
		this._height = 320;
		this._backgroud = '673ab7';
		this._color = 'ededed';
		this._ext = 'gif';
		this._text = 'beesmart';
		return this;
	}

	size(w:number, h:number){
		this._width = w;
		this._height =h;
		return this;
	}
	text(text: string){
		this._text = text;
		return this;
	}

	public build() {
		let url =`${this._server}/${this._width}x${this._height}/${this._backgroud}/${this._color}.${this._ext}&text=${this._text}`;
		console.log(url);
		
		return url;
	}
}	
