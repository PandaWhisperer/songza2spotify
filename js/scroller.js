var Scroller = function(elem) {
    $(elem).addClass('hiding');

    var slide_timer,
        slide = function() {
            elem.scrollLeft += 1;
            if (elem.scrollLeft < elem.scrollWidth) {
                slide_timer = setTimeout(slide, 40);
            }
        };

    elem.onmouseover = elem.onmouseout = function(e) {
        e = e || window.event;
        e = e.type === 'mouseover';
        clearTimeout(slide_timer);
        $(this).toggleClass('hiding', !e);
        if (e) {
            slide();
        } else {
            this.scrollLeft = 0;
        }
    };
}
