;$(function(){
  $(document).on("mousewheel DOMMouseScroll ", function (e) {
        var delta = (e.originalEvent.wheelDelta && (e.originalEvent.wheelDelta > 0 ? 1 : -1)) ||  // chrome & ie
                (e.originalEvent.detail && (e.originalEvent.detail > 0 ? -1 : 1));              // firefox
            // 向上滚
          var scroll=$(window).scrollTop(); 
        if (delta > 0&&scroll<101) {
            slideAnimate.down();
        scroll=$(window).scrollTop();
        } 
           // 向下滚
         else if(delta<0){
            slideAnimate.up();
        scroll=$(window).scrollTop();
        }
      });
})