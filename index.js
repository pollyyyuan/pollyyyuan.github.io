var _prefix = (function(temp){
	var aPrefix = ["webkit", "Moz", "o", "ms"],
		props = "";
	for(var i in aPrefix){
		props = aPrefix[i] + "Transition";
		if(temp.style[ props ] !== undefined){
			return "-"+aPrefix[i].toLowerCase()+"-";
		}
	}
	return false;
})(document.createElement(Fullpage));
//滑动对象
var Fullpage=(function(){
	function Fullpage(contain,dots){
		this.contain=contain;
		this.pageArr=this.contain.querySelectorAll('.page');
		this.dots=dots;
		this.lastIndex=0;
	}
	Fullpage.prototype={
		init:function(dom){
			var me=this;
			//页面的个数
			me.canscroll = true;
			me.pageNum=me.pageArr.length;
			me.main=new Main(me.contain.parentNode);
			me.initDot();
			//初始化方法
			me.initEvent();
		},
		//初始化dot点,创建节点
		initDot:function(){
			var me=this;
			if(me.pageNum)
			{	
				var str='';
				//根据页面个数创建节点
				for(var i=0;i<me.pageNum;i++)
				{
					str+='<span class="dot" data-index='+i+'></span>';
				}
				//节点加到页面上
				me.dots.innerHTML=str;
				//增加高亮效果
				me.dotArr=me.dots.querySelectorAll('.dot');
				me.dotArr[0].setAttribute('class','dot active');
			}
		},
		activeDot:function(){
			this.dots.querySelector('.active').setAttribute('class','dot');
			this.dotArr[this.lastIndex].setAttribute('class','dot active');
		},	
		prve : function(){
			var me = this;
			if(me.lastIndex > 0){
				me.lastIndex --;
			}else{
				me.lastIndex = me.pageNum - 1;
			}
			me.main.bindUp();
			me.move();
		},
		next : function(){
			var me = this;
			if(me.lastIndex < me.pageNum){
				me.lastIndex ++;
			}else{
				me.lastIndex = 0;
			}
			if(me.lastIndex==1){
				var page=document.getElementById('page1'),
					photo=page.querySelector('.icon-photo'),
					dom=page.querySelectorAll('li');
				var doms=Array.prototype.slice.call(dom);
				doms.unshift(photo);
				var text=new Text(doms);
				text.init();
			}
			me.main.bindDown();
			me.move();
		},
		//绑定事件
		initEvent:function(){
			var me=this;
			// 节点点击事件
			me.contain.addEventListener("mousewheel DOMMouseScroll", function(e){
				e.preventDefault();
				var delta = e.originalEvent.wheelDelta || -e.originalEvent.detail;
				if(me.canscroll){
					if(delta > 0 && (me.lastIndex>0)){
						me.prve();
					}else if(delta < 0 && (me.lastIndex < (me.pageNum-1))){
						me.next();
					}
				}
			});
			document.onkeydown=function(event){
           		var e = event || window.event || arguments.callee.caller.arguments[0];
           	    var key=e.keyCode;
           	   	if(key == 37 || key == 38){
					me.prve();
				}else if(key == 39 || key == 40){
					me.next();
				}
          	}; 
		},
		move:function(){
			var me = this;
			var y = me.pageArr[me.lastIndex].offsetTop;
			console.log(y);
			me.canscroll = false;
			if(_prefix){
				var translate ='translateY(-'+y+'px)',
					transform=_prefix+'transform';
				me.contain.style.transform=translate;
			}
		}
	}
	return Fullpage;
})();
var Main=(function(){
	function Main(contain){
		this.contain=contain;
		this.logo=document.getElementById('logo');
	}
	Main.prototype={
		bindUp:function(){
			var me=this;
			me.contain.setAttribute('class','contain current');
		},
		bindDown:function(){
			var me=this;
			me.contain.setAttribute('class','contain');
		}
	}
	return Main;
})()
var Text=(function(){
	function Text(dom){
		this.dom=dom;
		console.log(dom);
		this.domNum=this.dom.length;
		this.num=0;
	}
	Text.prototype={
		init:function(){
			var me=this;
			me.timer=null;
			if(me.domNum){
				me.timer=setInterval(function(){
					me.show(me);
				},400);
			}
		},
		show:function(me){
			var me=me;
			if(me.num>=me.domNum){
				clearInterval(me.timer);
			}
			else{
				me.dom[me.num].style.opacity=1;
				var translate ='translateY(0)',
					transform=_prefix+'transform';
				me.dom[me.num].style.transform=translate;
			}
			me.num++;
		}
	}
	return Text;
})()
