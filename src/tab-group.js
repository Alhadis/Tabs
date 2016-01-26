"use strict";


class TabGroup{
	
	constructor(el, options = {}){
		let activeClass    = options.activeClass || "active";
		
		this.el            = el;
		this.activeClass   = activeClass;
		this.enabledClass  = undefined === options.enabledClass ? "tabs" : options.enabledClass;
		this.disabledClass = options.disabledClass;
		
		/** Create a list of Tab instances from the container's children */
		let tabs     = [];
		let index    = 0;
		let firstActiveTab;
		for(let i of Array.from(el.children)){
			
			/** If the tab element's flagged as active, store the current index */
			if(undefined === firstActiveTab && i.classList.contains(activeClass))
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
		
		this.disabled = !!options.disabled;
	}
	
	
	/**
	 * Whether the tab-group's been deactivated.
	 *
	 * @property
	 * @type {Boolean}
	 */
	get disabled(){ return this._disabled; }
	set disabled(input){
		if((input = !!input) !== this._disabled){
			this._disabled = input;
			const classes  = this.el.classList;
			this.enabledClass  && classes.toggle(this.enabledClass,  !input);
			this.disabledClass && classes.toggle(this.disabledClass,  input);
			
			for(let i of this.tabs)
				i.disabled = input;
			
			input
				? this.el.style.paddingTop = null
				: this.update();
		}
	}
	
	
	
	/**
	 * Zero-based index of the currently-selected tab.
	 *
	 * @property
	 * @type {Number}
	 */
	get active(){ return this._active || 0 }
	set active(input){
		if((input = +input) !== this._active){
			for(let i of this.tabs)
				i.active = input === i.index;
			this._active = input;
		}
	}
	
	
	/**
	 * Additional padding to insert between the tab labels and the container's top-edge.
	 *
	 * @property
	 * @type {Number}
	 */
	get topSlug(){ return this._topSlug || 0 }
	set topSlug(input){
		input = +input;
		if(input < 0) input = 0;
		if((input = +input) !== this._topSlug){
			this._topSlug = input;
			this.update();
		}
	}
	
	
	update(){
		let maxHeight = 0;
		let offset    = 0;
		let slug      = this._topSlug;
		for(let i of this.tabs){
			i.offset   = offset;
			let box    = i.label.getBoundingClientRect();
			offset    += Math.round(box.right  - box.left) + i.marginRight;
			let height = Math.round(box.bottom - box.top);
			if(height > maxHeight)
				maxHeight = height;
			
			if(undefined !== slug)
				i.label.style.top = slug > 0 ? slug + "px" : null;
		}
		this.el.style.paddingTop = (maxHeight + this.topSlug) + "px";
	}
}
