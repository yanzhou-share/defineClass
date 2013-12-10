;(function(){
	function defineClass(data){
		var classname = data.name;
		var superclass = data.extend || Object;
		var constructor = data.construct || function(){};
		var methods = data.methods || {};
		var statics = data.statics || {};
		var borrows;
		var provides;
		
		if(!data.borrows)	borrows = [];
		else if(data.borrows instanceof Array)	borrows = data.borrows;
		else borrows = [data.borrows];
		
		if(!data.provides)	provides = [];
		else if(data.provides instanceof Array)	provides = data.provides;
		else provides = [data.provides];
		
		var proto = new superclass();
		
		for(var p in proto){
			if(proto.hasOwnProperty(p))	delete proto[p];
		}
		
		for(var i=0, l=borrows.length;i<l;i++){
			var c = data.borrows[i];
			borrows[i] = c;
			for(var p in c.prototype){
				if(typeof c.prototype[p] != 'function') continue;
				proto[p] = c.prototype[p];
			}
		}
		
		for(var p in methods)	proto[p] = methods[p];
		proto.constructor = constructor;
		proto.superclass = superclass;
		if(classname)	proto.classname = classname;
		
		for(var i=0, l=provides.length;i<l;i++){
			var c = provides[i];
			for(var p in c.prototype){
				if(typeof c.prototype[p] != 'function')	continue;
				if(p == 'constructor' || p == "superclass") continue;
				if(p in proto && typeof proto[p] == "function" && proto[p].length == c.prototype[p].length) continue;
				throw new Error("Class do not provider " + p);
			}
		}
		
		constructor.prototype = proto;
		
		for(var p in statics)	constructor[p] = data.statics[p];
		
		return constructor;
	}
	
	window.define = defineClass;
})();
