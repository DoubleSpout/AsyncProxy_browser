AsyncProxy_browser.js是相当轻巧的异步代理JQUERY插件，我们知道jquery1.5+引入的Deferred对象，能够实现ajax并发和队列。但是同样，jq1.5的文件大小达到了90KB左右，而同样1.4+的JQ大小仅为58kb，大了将近30KB，而这30kb中大部分功能就是为了我们之前提到的AJAX并发回调和队列。
之前编写的AsyncProxy是在node.js端运行的，而AsyncProxy_browser.js更为轻巧，未压缩版仅为25行1kb。

AsyncProxy_browser.js的特点
1、支持链式调用，什么是链式调用呢？比如“异步1”、“异步2”，如果"异步2"需要用到"异步1"返回的数据，则必须等待"异步1"返回以后再开始异步2。对于这样耦合度高的异步请求完全支持，可以很方便的取到上一步，或者上几步的数据。
2、增加异步返回状态，能够在每次异步请求返回后，知道当前已经返回异步请求数和总共需要返回请求数，方便查找系统的瓶颈。
3、支持AJAX并发，和最后回调，大大提高了性能
4、支持同时多条ajax队列，只需实例化多次即可，互不影响
缺点：gc需要手动处理。




应用实例:
有一个需求，发送ary.length个异步请求到ary[x]存着的url中，，并且将对应返回的结果按ary内的顺序插入到ary2中，当所有数据返回调用ADD方法。因为ary.length的长度不确定，所以使用普通嵌套式编写只能递归编写，而且请求只能链式调用，如果我们使用 AsyncProxy_browser 插件则不但可以并发，更可以避免递归。看代码：

var as = new AsyncProxy_browser(),  ary2, asary=[];
var allfunc = function(data){
 ary2 = data;
 alert('全部完成');
}
for(var i=0; i<ary.length; i++){
 var asfunc = function(order){
  $.get(ary[order],{'action':'getdata'},function(data){
   as.rec(order, data);
  },'json')
 }
 asary.push(asfunc )
}
asfunc.push(allfunc)
as.ap.apply(as, asary);
这样就将数据按顺序返回至ary2数组中去了。




测试用例可以作为示例来运行。
testasync的测试结果：

需要返回的异步处理数： 4
f4 is ok
已经返回：1/4
f3 is ok
已经返回：2/4
f2 is ok
已经返回：3/4
f1 is ok
f1_data || f2_data || f3_data || f4 || 
已经返回：4/4

testchain的测试结果

需要返回的异步处理数： 4
f1 is ok
已经返回：1/4
f2 is ok!前一个返回结果: f1_data
已经返回：2/4
f3 is ok前一个返回结果: f2_data
已经返回：3/4
f4 is ok前一个返回结果: f3_data
f1_data || f2_data || f3_data || f4 || 
已经返回：4/4