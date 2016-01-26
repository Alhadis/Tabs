"use strict";


class Tab{
	
	constructor(el, group){
		const label = el.firstElementChild;
		const panel = el.lastElementChild;
		
		this.el    = el;
		this.group = group;
		this.label = label;
		this.panel = panel;
		this.ariaEnabled = !group.noAria;
		
		if(!group.noKeys){
			label.tabIndex = 0;
			label.addEventListener("keydown", this.onKeyDown = e => {
				const key = e.keyCode;
				let tab;
				
				switch(key){
					
					/** Right arrow: Focus on next tab */
					case 39:{
						if(tab = group.tabs[1 + this.index])
							tab.label.focus();
						else return;
						break;
					}
					
					/** Left arrow: Focus on previous tab */
					case 37:{
						if(tab = group.tabs[this.index - 1])
							tab.label.focus();
						else return;
						break;
					}
					
					/** Enter: Select tab */
					case 13:{
						group.active = this.index;
						break;
					}
					
					/** Escape: clear focus */
					case 27:{
						label.blur();
						break;
					}
					
					default:{
						return;
					}
				}
				
				e.preventDefault();
				return false;
			});
		}
		
		this.label.addEventListener(pressEvent, this.onPress = e => {
			if(e.type !== "touchend" || e.cancelable){
				group.active = this.index;
				e.preventDefault();
			}
			return false;
		});
	}
	
	
	/**
	 * Whether the tab's been deactivated.
	 *
	 * Generally not set directly; altered through a TabGroup's .disabled property.
	 *
	 * @property
	 * @type {Boolean}
	 */
	get disabled(){ return this._disabled }
	set disabled(input){
		if((input = !!input) !== !!this._disabled){
			const group    = this.group;
			const label    = this.label;
			const classes  = this.el.classList;
			const active   = group.activeClass;
			const style    = label.style;
			
			/** Deactivated */
			if(this._disabled = input){
				label.removeEventListener(pressEvent, this.onPress);
				classes.remove(active);
				style.left = null;
				
				if(undefined !== this._marginLeft)   style.marginLeft   = null;
				if(undefined !== this._marginRight)  style.marginRight  = null;
				if(undefined !== this._marginTop)    style.marginTop    = null;
				if(undefined !== this._marginBottom) style.marginBottom = null;
				
				if(this.onKeyDown){
					label.removeEventListener("keydown", this.onKeyDown);
					label.removeAttribute("tabindex");
				}
				
				if(this._ariaEnabled){
					this.ariaEnabled = false;
					this._ariaEnabled = true;
				}
			}
			
			/** Reactivated */
			else{
				label.addEventListener(pressEvent, this.onPress);
				group.active === this.index && classes.add(active);
				style.left = this._offset + "px";
				
				if(this.onKeyDown){
					label.addEventListener("keydown", this.onKeyDown);
					label.tabIndex = 0;
				}
			}
		}
	}
	
	
	
	/**
	 * Add or remove relevant ARIA attributes from the tab's elements.
	 *
	 * @property
	 * @type {Boolean}
	 */
	get ariaEnabled(){ return this._ariaEnabled; }
	set ariaEnabled(input){
		if((input = !!input) !== !!this._ariaEnabled){
			const label = this.label;
			const panel = this.panel;
			this._ariaEnabled = input;
			
			/** Enable ARIA-attribute management */
			if(input){
				label.setAttribute("role", "tab");
				panel.setAttribute("role", "tabpanel");
				
				
				/** Ensure the tab's elements have unique ID attributes. */
				const labelSuffix  = "-heading";
				const panelSuffix  = "-content";
				const active       = !!this._active;
				let elID           = this.el.id;
				let id;
				
				/** Neither of the tab's elements have an ID attribute */
				if(!label.id && !panel.id){
					id        = elID || uniqueID("a");
					label.id  = id + labelSuffix;
					panel.id  = id + panelSuffix;
				}
				
				/** Either the label or panel lack an ID */
				else if(!panel.id) panel.id   = (elID || label.id) + panelSuffix;
				else if(!label.id) label.id   = (elID || panel.id) + labelSuffix;
				
				/** Finally, double-check each element's ID is really unique */
				const $ = s => document.querySelectorAll("#"+s);
				while($(panel.id).length > 1 || $(label.id).length > 1){
					id       = uniqueID("a");
					panel.id = id + panelSuffix;
					label.id = id + labelSuffix;
				}
				
				/** Update ARIA attributes */
				label.setAttribute("aria-controls",   panel.id);
				panel.setAttribute("aria-labelledby", label.id);				
				
				
				/** Update the attributes that're controlled by .active's setter */
				label.setAttribute("aria-selected",  active);
				label.setAttribute("aria-expanded",  active);
				panel.setAttribute("aria-hidden",   !active);
			}
			
			/** Disabling; remove all relevant attributes */
			else{
				label.removeAttribute("role");
				label.removeAttribute("aria-controls");
				label.removeAttribute("aria-selected");
				label.removeAttribute("aria-expanded");
				
				panel.removeAttribute("role");
				panel.removeAttribute("aria-labelledby");
				panel.removeAttribute("aria-hidden");
			}
		}
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
			this.el.classList.toggle(this.group.activeClass, input);
			this._active = input;
			
			/** Update ARIA attributes */
			if(this.ariaEnabled){
				const label = this.label;
				label.setAttribute("aria-selected",      input);
				label.setAttribute("aria-expanded",      input);
				this.panel.setAttribute("aria-hidden",  !input);
			}
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
