var $=function(id,context,arr){
	if(context){
		if(arr){	
			return context.querySelectorAll(id);
		}
		else{
			return context.querySelector(id);
		}
	}
	else{
		return document.getElementById(id);
	}
}
var doming={
	body:$('allDom'),
	logo:$('logo'),
	nav:{
		navBtn:$('navBtn'),
		navLi:$('.nav',navBtn)
	},
	dots:{
		dots:$('dots')
	},
	contain:{
		contain:$('contain'),
		pages:$('pages'),
		pageArr:$('.page',pages,1),
		page0:{
			page0:$('page0'),
		},
		page1:{
			page1:$('page1'),
			pageArr:function(){
				var iconPhoto=$('.icon-photo',this.page1),
					txtLis=$('li',this.page1,1);
				var arr=Array.prototype.slice.call(txtLis);
				arr.unshift(iconPhoto);
				return arr;
			}
		},
		page2:{
			page2:$('page2'),
			pageArr:function(){
				var box1=$('.box1',this.page2),
					box2=$('.box2',this.page2),
					p=$('.box3 p',this.page2,1);
				var arr=Array.prototype.slice.call(p);
				arr.unshift(box2);
				arr.unshift(box1);
				return arr;
			}
		},
		page3:{
			page3:$('page3'),
			pageArr:function(){
				var box=$('.box',this.page3,1);
				var arr=Array.prototype.slice.call(box);
				return arr;
			}
		},
		page4:{
			page4:$('page4'),
			pageArr:function(){
				var h1=$('.txt-h',this.page4),
					p=$('p',this.page4,1),
					iconBox=$('.icon-box',this.page4);
				var arr=Array.prototype.slice.call(p);
				arr.unshift(h1);
				arr.push(iconBox);
				return arr;
			}
		},

	}
}
//添加前缀方法
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
//滑动对象,主对象
var Fullpage=(function(){
	function Fullpage(){
		this.pages=doming.contain.pages;
		this.pageArr=doming.contain.pageArr;
		this.dots=doming.dots.dots;
		this.navBtn=doming.nav.navBtn;
		this.navLi=doming.nav.navLi;
		this.lastIndex=0;
	}
	Fullpage.prototype={
		init:function(dom){
			var me=this;
			me.canscroll = true;
			//页面的个数
			me.pageNum=me.pageArr.length;
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
				me.dotArr=$('.dot',me.dots,1);
				doming.dots.dotArr=me.dotArr;
				me.dotArr[0].setAttribute('class','dot active');
				me.navLiArr=me.navLi.querySelectorAll('a');
				me.navLiArr[0].setAttribute('class','active');
			}
		},
		activeDot:function(){
			$('.active',this.dots).setAttribute('class','dot');
			this.dotArr[this.lastIndex].setAttribute('class','dot active');
			if(this.lastIndex>0){
				$('.active',this.navLi).removeAttribute('class');
				this.navLiArr[this.lastIndex-1].setAttribute('class','active');
			}
		},	
		prve : function(){
			var me = this;
			me.lastIndex --;
			CallPage(me.lastIndex,me.lastIndex+1);
			me.move();
			me.activeDot(me.lastIndex);
		},
		next : function(){
			var me = this;
			CallPage(me.lastIndex+1,me.lastIndex);
			me.lastIndex ++;
			me.activeDot(me.lastIndex);
			me.move();
		},
		//绑定事件
		initEvent:function(){
			var me=this;
			// 节点点击事件
			for(var i=0;i<me.dotArr.length;i++){	
				me.dotArr[i].addEventListener('click',function(){
					var index=me.lastIndex;
					me.lastIndex=this.getAttribute('data-index');
					CallPage(me.lastIndex,index);
					me.move();
					me.activeDot(me.lastIndex);
				});
			}
			var scrollFn=function(e){
				e.preventDefault();
				var e=e||window.event;
				var delta;
				if(e.wheelDelta){//IE/Opera/Chrome
					delta=e.wheelDelta;
    			}else if(e.detail){//Firefox
        			delta=-e.detail;
    			}
				if(me.canscroll){
					if(delta > 0 && (me.lastIndex>0)){
						me.prve();
					}else if(delta < 0 && (me.lastIndex < (me.pageNum-1))){
						me.next();
					}
				}
			}
			if(document.addEventListener){
    			document.addEventListener('DOMMouseScroll',scrollFn,false);
			}
			window.onmousewheel=document.onmousewheel=scrollFn;
			document.onkeydown=function(event){
           		var e = event || window.event || arguments.callee.caller.arguments[0];
           	    var key=e.keyCode;
           	   	if(key == 37 || key == 38){
					me.prve();
				}else if(key == 39 || key == 40){
					me.next();
				}
          	}; 
          	touchEvent.swipeUp(document,function(){
          		if(me.lastIndex<(me.pageNum-1)){
          			me.next();
          		}
          	});
          	touchEvent.swipeDown(document,function(){
          		if(me.lastIndex>0){
          			me.prve();
          		}  		
          	});
          	touchEvent.tap(me.navBtn,function(){
          		if(me.navLi.style.display=='block'){
          			me.navBtn.setAttribute('class','nav-btn');
          			me.navLi.style.display='none';
          		}
          		else{
          			me.navBtn.setAttribute('class','nav-btn nav-active');
          			me.navLi.style.display='block';
          			touchEvent.tap(me.navLi,function(){
          				me.navLi.style.display='block';
          			})
          		}
          	});
          	/*绑定窗口改变事件*/
				/*为了不频繁调用resize的回调方法，做了延迟*/
			var resizeId;
			window.onresize=function(){
				clearTimeout(resizeId);
					resizeId = setTimeout(function(){
					me.move();
				},500);
			};
			/*支持CSS3动画的浏览器，绑定transitionend事件(即在动画结束后调用起回调函数)*/
			me.pages.addEventListener("transitionend", function(){
				me.canscroll = true;
			});
          	me.navBtn.addEventListener('mouseenter',function(){
          		me.navLi.style.display='block';
          		this.setAttribute('class','nav-btn nav-active');
          		me.navLi.addEventListener('mouseenter',function(){
          			this.style.display='block';

          		});
          	});
          	me.navBtn.addEventListener('mouseout',function(){
          		this.setAttribute('class','nav-btn');
          		me.navLi.style.display='none';
          	});
          	for(var navli=0;navli<me.navLiArr.length;navli++){
          		var li=me.navLiArr[navli];
          		li.addEventListener('click',function(){
          			var index=this.getAttribute('data-index');
          			me.lastIndex=index;
          			CallPage(me.lastIndex,index);
					me.move();
					me.activeDot(me.lastIndex);
          		});
     //      		touchEvent.tap(li,function(){
     //      			var index=this.getAttribute('data-index');
     //      			me.lastIndex=index;
     //      			CallPage(me.lastIndex,index);
					// me.move();
					// me.activeDot(me.lastIndex);
     //      		});
          	}
		},
		move:function(){
			var me = this;
			var y = me.pageArr[me.lastIndex].offsetTop;
			me.canscroll = false;
			if(_prefix){
				var translate ='translateY(-'+y+'px)',
					transform=_prefix+'transform';
				me.pages.style.transform=translate;
			}
		}
	}
	return Fullpage;
})();
var CallPage=function(index,context){//1是下，0是上
	if((index==1&&context==0)||(index==0&&context==1)){
		var containActive=doming.contain.contain.getAttribute('class')=='contain'?'contain current':'contain';
		doming.contain.contain.setAttribute('class',containActive);
		doming.logo.style.opacity=doming.logo.style.opacity==1?0:1;
		doming.dots.dots.style.opacity=doming.dots.dots.style.opacity==1?0:1;
		doming.nav.navBtn.style.opacity=doming.nav.navBtn.style.opacity==1?0:1;
	}
	var arr=index?doming.contain['page'+index].pageArr():0,
		context=context?doming.contain['page'+context].pageArr():0;
	var text=new Text(arr,context);
	if(arr){
		text.init();
	}
	if(context){
		text.hide();
	}
	
		
}
var Text=(function(){
	function Text(dom,context){
		this.dom=dom;
		this.context=context;
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
				},200);
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
		},
		hide:function(){
			if(this.context){
			for(var i=0;i<this.context.length;i++){
				this.context[i].style.opacity=0;
			}
			}
		}
	}
	return Text;
})()
var touchEvent={
/*单次触摸事件*/
	tap:function(element,fn){
		var startTx, startTy;
		element.addEventListener('touchstart',function(e){
		  var touches = e.touches[0];
		  startTx = touches.clientX;
		  startTy = touches.clientY;
		}, false );
		
		element.addEventListener('touchend',function(e){
		  var touches = e.changedTouches[0],
		  endTx = touches.clientX,
		  endTy = touches.clientY;
		  // 在部分设备上 touch 事件比较灵敏，导致按下和松开手指时的事件坐标会出现一点点变化
		  if( Math.abs(startTx - endTx) < 6 && Math.abs(startTy - endTy) < 6 ){
			fn();
		  }
		}, false );
	},
	/*向上滑动事件*/
	swipeUp:function(element,fn){
		var isTouchMove, startTx, startTy;
		element.addEventListener( 'touchstart', function( e ){
		  var touches = e.touches[0];
		  startTx = touches.clientX;
		  startTy = touches.clientY;
		  isTouchMove = false;
		}, false );
		element.addEventListener( 'touchmove', function( e ){
		  isTouchMove = true;
		  e.preventDefault();
		}, false );
		element.addEventListener( 'touchend', function( e ){
		  if( !isTouchMove ){
			return;
		  }
		  var touches = e.changedTouches[0],
			endTx = touches.clientX,
			endTy = touches.clientY,
			distanceX = startTx - endTx
			distanceY = startTy - endTy,
			isSwipe = false;
		  if( Math.abs(distanceX) < Math.abs(distanceY) ){
			  if( distanceY > 20 ){
				  fn();       
				  isSwipe = true;
			  }
		  }
		}, false );	
	},
		/*向下滑动事件*/
		swipeDown:function(element,fn){
			var isTouchMove, startTx, startTy;
			element.addEventListener( 'touchstart', function( e ){
			  var touches = e.touches[0];
			  startTx = touches.clientX;
			  startTy = touches.clientY;
			  isTouchMove = false;
			}, false );
			element.addEventListener( 'touchmove', function( e ){
			  isTouchMove = true;
			  e.preventDefault();
			}, false );
			element.addEventListener( 'touchend', function( e ){
			  if( !isTouchMove ){
				return;
			  }
			  var touches = e.changedTouches[0],
				endTx = touches.clientX,
				endTy = touches.clientY,
				distanceX = startTx - endTx
				distanceY = startTy - endTy,
				isSwipe = false;
			  if( Math.abs(distanceX) < Math.abs(distanceY) ){
				  if( distanceY < -20  ){
					  fn();       
					  isSwipe = true;
				  }
			  }
			}, false );	
		}	
}