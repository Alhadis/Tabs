class TabGroup{
	
	constructor(el, options = {}){
		this.el      = el;
		this.active  = +options.active;
		
		let tabs     = [];
		for(let i of Array.from(el.children))
			tabs.push(new Tab(i, this));
		this.tabs    = tabs;
		
		this.update();
	}
	
	
	update(){
		let maxHeight = 0;
		let offset    = 0;
		for(let i of this.tabs){
			i.offset   = offset;
			let box    = i.label.getBoundingClientRect();
			offset    += Math.round(box.right  - box.left);
			let height = Math.round(box.bottom - box.top);
			if(height > maxHeight)
				maxHeight = height;
		}
		this.el.style.paddingTop = maxHeight + "px";
	}
}
