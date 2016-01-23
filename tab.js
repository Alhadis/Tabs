class Tab{
	
	constructor(el, group){
		this.el    = el;
		this.group = group;
		
		this.label = el.firstElementChild;
		this.panel = el.lastElementChild;
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
