void function(){
	window.AsyncProxyBrowser =  AsyncProxy = function(ischain){
		var me = arguments.callee;
		if(!(this instanceof me)) return new me(ischain);
		this.ischain = ischain||false; //是否链式调用,默认是false
	}
	AsyncProxy._listener = function(order, ap){//建立事件监听函数，私有方法
			if(--ap.length===0)	ap.callback();
		}
	AsyncProxy.prototype.rec = function(order){ //当异步返回入口
		AsyncProxy._listener(order, this); 
		if(this.ischain && ++order<this.asyncs.length){	this.asyncs[order](order);}
		return {total:this.asyncs.length, rec:this.asyncs.length - this.length}
	}	
	AsyncProxy.prototype.recfunc = function(callback){
		var ap = this;
		return function(order){
				return callback(function(){
					return ap.rec(order);
				});		
			}	
	}
	AsyncProxy.prototype.ap = function(){ //主入口
		var ap = this, i=-1, len = arguments.length - 1;
			ap.asyncs = [].slice.apply(arguments, [0, len]); //将参数eventname1-n转存成events 数组
			ap.callback = arguments[len];
		var length = ap.length = ap.asyncs.length;
			while(i++ < length-1){
				ap.asyncs[i] = ap.recfunc(ap.asyncs[i]);
				if(!ap.ischain) ap.asyncs[i](i);
			}
			if(ap.ischain) ap.asyncs[0](0);
			return length;
	}
}()