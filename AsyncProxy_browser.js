void function(){
	window.AsyncProxy_browser =  AsyncProxy = function(ischain){
		this.data = [];//存放异步返回结果的数组
		this.ischain = ischain||false; //是否链式调用,默认是false
	}
	AsyncProxy.listener = function(order, data, ap){//建立事件监听函数，私有方法
			ap.prev = ap.data[order] = data;
			if(--ap.length===0)	ap.callback(ap.data);
		}
	AsyncProxy.prototype.rec = function(order, data){ //当异步返回入口
		AsyncProxy.listener(order, data, this); 
		if(this.ischain && ++order<this.asyncs.length){	this.asyncs[order](order);}
		return {total:this.asyncs.length, rec:this.asyncs.length - this.length}
	}	
	AsyncProxy.prototype.ap = function(){ //主入口
		var ap = this, i=0, len = arguments.length - 1;
			ap.asyncs = [].slice.apply(arguments, [0, len]); //将参数eventname1-n转存成events 数组
			ap.callback = arguments[len];
			if((ap.length=ap.asyncs.length)&&!ap.ischain){ //如果非链式调用
				while(i++ < ap.asyncs.length){ ap.asyncs[i-1](i-1);}
			}
			else ap.asyncs[0](0);
			return ap.asyncs.length;
	}
}()