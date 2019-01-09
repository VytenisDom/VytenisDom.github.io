$('document').ready(function () {
    // The slider being synced must be initialized first
    for(var i = 0; i<4; i++){
        $('#carousel' + i).flexslider({
            animation: "slide",
            controlNav: false,
            animationLoop: false,
            slideshow: false,
            itemWidth: 210,
            itemMargin: 5,
            asNavFor: '#slider' + i
        });
        
        $('#slider'+ i).flexslider({
            animation: "slide",
            controlNav: false,
            animationLoop: false,
            slideshow: false,
            sync: "#carousel" + i 
        });
    }
  
  
});