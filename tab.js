"use strict";

const touchEnabled = "ontouchstart" in document.documentElement;
const pressEvent   = touchEnabled ? "touchend" : "click";


class Tab{
	
	constructor(el, group){
		this.el    = el;
		this.group = group;
		
		this.label = el.firstElementChild;
		this.panel = el.lastElementChild;
		
		this.label.addEventListener(pressEvent, e => {
			if(e.type !== "touchend" || e.cancelable){
				group.active = this.index;
				e.preventDefault();
			}
			return false;
		});
	}
	
	
	/**
	 * Whether the tab is currently selected/visible.
	 *
	 * @property
	 * @type {Boolean}
	 */
	get active(){ return this._active }
	set active(input){
		if((input = !!input) !== this._active){
			this.el.classList.toggle("active", input);
			this._active = input;
		}
	}
	

	/**
	 * Label's horizontal offset at the top of the container
	 *
	 * @property
	 * @type {Number}
	 */
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
	
	
	/**
	 * Update the tab's internal margin properties by scanning the label's calculated style.
	 *
	 * As this involves calling to window.getComputedStyle, this method is considerably slow.
	 * Using it is discouraged unless absolutely necessary.
	 *
	 * @return {CSSStyleDeclaration} The value returned by window.getComputedStyle.
	 */
	evalMargins(){
		let style          = window.getComputedStyle(this.label);
		this._marginLeft   = Math.round(parseFloat(style.marginLeft))   || 0;
		this._marginRight  = Math.round(parseFloat(style.marginRight))  || 0;
		this._marginTop    = Math.round(parseFloat(style.marginTop))    || 0;
		this._marginBottom = Math.round(parseFloat(style.marginBottom)) || 0;
		return style;
	}
	
	
	/**
	 * Label element's left horizontal margin.
	 *
	 * @property
	 * @type {Number}
	 */
	get marginLeft(){
		undefined === this._marginLeft && this.evalMargins();
		return this._marginLeft;
	}
	set marginLeft(input){
		if((input = +input) !== this._marginLeft){
			this._marginLeft = input;
			this.label.style.marginLeft = input + "px";
			group.update();
		}
	}
	
	
	/**
	 * Label element's right horizontal margin.
	 *
	 * @property
	 * @type {Number}
	 */
	get marginRight(){
		undefined === this._marginRight && this.evalMargins();
		return this._marginRight;
	}
	set marginRight(input){
		if((input = +input) !== this._marginRight){
			this._marginRight = input;
			this.label.style.marginRight = input + "px";
			group.update();
		}
	}
	
	
	
	/**
	 * Label element's top vertical margin.
	 *
	 * @property
	 * @type {Number}
	 */
	get marginTop(){
		undefined === this._marginTop && this.evalMargins();
		return this._marginTop;
	}
	set marginTop(input){
		if((input = +input) !== this._marginTop){
			this._marginTop = input;
			this.label.style.marginTop = input + "px";
			group.update();
		}
	}
	
	/**
	 * Label element's bottom vertical margin.
	 *
	 * @property
	 * @type {Number}
	 */
	get marginBottom(){
		undefined === this._marginBottom && this.evalMargins();
		return this._marginBottom;
	}
	set marginBottom(input){
		if((input = +input) !== this._marginBottom){
			this._marginBottom = input;
			this.label.style.marginBottom = input + "px";
			group.update();
		}
	}
}
