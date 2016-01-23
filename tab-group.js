"use strict";


class TabGroup{
	
	constructor(el, options = {}){
		this.el      = el;
		
		/** Create a list of Tab instances from the container's children */
		let tabs     = [];
		let index    = 0;
		let firstActiveTab;
		for(let i of Array.from(el.children)){
			
			/** If the tab element's flagged as active, store the current index */
			if(undefined === firstActiveTab && i.classList.contains("active"))
				firstActiveTab = index;
			
			let tab   = new Tab(i, this);
			tab.index = index++;
			tabs.push(tab);
		}
		this.tabs    = tabs;
		
		
		/**
		 * If a tab element was flagged in the DOM as active, default to its index if
		 * the option hash's .active property wasn't explicitly provided. Otherwise,
		 * default to the first tab.
		 */
		this.active  = undefined === options.active
			? (undefined === firstActiveTab ? 0 : firstActiveTab)
			: options.active;
		
		this.update();
	}
	
	
	get active(){ return this._active || 0 }
	set active(input){
		if((input = +input) !== this._active){
			for(let i of this.tabs)
				i.active = input === i.index;
			this._active = input;
		}
	}
	
	
	update(){
		let maxHeight = 0;
		let offset    = 0;
		for(let i of this.tabs){
			i.offset   = offset;
			let box    = i.label.getBoundingClientRect();
			offset    += Math.round(box.right  - box.left) + i.marginRight;
			let height = Math.round(box.bottom - box.top);
			if(height > maxHeight)
				maxHeight = height;
		}
		this.el.style.paddingTop = maxHeight + "px";
	}
}
