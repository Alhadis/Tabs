"use strict";


class Tab{
	
	constructor(el, group){
		this.el    = el;
		this.group = group;
		
		this.label = el.firstElementChild;
		this.panel = el.lastElementChild;
		
		this.label.addEventListener()
	}
	
	get active(){ return this._active }
	set active(input){
		if((input = !!input) !== this._active){
			this.el.classList.toggle("active", input);
			this._active = input;
		}
	}
	
	
	get offset(){
		if(undefined === this._offset)
			this._offset = parseInt(this.label.style.left) || 0;
		
		return this._offset;
	}
	set offset(input){
		if((input = +input) !== this._offset){
			this._offset = input;
			this.label.style.left = input + "px";
		}
	}
}
