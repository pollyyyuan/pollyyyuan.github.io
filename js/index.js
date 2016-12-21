	var $header=$('#header');
	var $show=$header.find('.show-box');
	var $logo=$header.find('.logo');
	var $nav=$('#mainNav');
	var $btn=$('.slide-btn');
	$(window).scrollTop(0);
	var slideAnimate={
		up:function(){
			$show.css('height','0');
			$nav.css('position','fixed');
			$btn.css({'top':'18px','transition':'top .5s'}).addClass('slide-down').removeClass('slide-up');
			$logo.addClass('logo-active').find('.info').show();
		},
		down:function(){
			$show.css('height','540px');
			$btn.css({'top':'540px','transition':'top 1.2s'}).addClass('slide-up').removeClass('slide-down');
			$nav.css('position','relative');
			$logo.removeClass('logo-active').find('.info').hide();
		}
	};
	
	$btn.on('click',function(){
		if($(this).hasClass('slide-up'))
		{
			slideAnimate.up();
		}
		else if($(this).hasClass('slide-down'))
		{
			slideAnimate.down();
		}
	});
	
