(function($) {
    var mysocket, stickifyId;
    $.fn.stickify = function(text, options, socket) {
        mysocket = mysocket || socket;
        stickifyId = stickifyId || options.stickifyId || 0;
        stickifyId = parseInt(stickifyId);
        
        var defaults = {
            authorId  : '',
            boardId   : 'sticky-board',
            bgcolor   : '#f8b5ab',
            color     : '#000',
            easing    : 'linear',
            fadeTime  : 300,
            fps       : 30,
            stickifyId: stickifyId++,
            size      : 12,
            speed     : 300
        };
        
        var settings = $.extend({}, defaults, options);
        
        return this.each(function(i) {
            $children = $(this).children();
            $(this)
                .attr('id', 'sticky_' + settings.stickifyId)
                .data('stickify_id', '' + settings.stickifyId)
                .data('author_id', settings.authorId)
                .addClass('sticky')
                .text(text)
                .css({
                    'background': settings.bgcolor,
                    'color'     : settings.color,
                    'font-size' : parseInt(settings.size)
                })
                .mousedown(function(e) {
                    $(this).css({'z-index': 1000});
                    var sticky = $(this),
                        offsetSticky = $(this).offset(),
                        offsetBoard  = $('#' + settings.boardId).offset(),
                        mouseOffsetX = e.pageX - offsetSticky.left,
                        mouseOffsetY = e.pageY - offsetSticky.top,
                        destX, destY,
                        intervalId   = setInterval(function() {
                            $(sticky).stop().animate({
                                left: destX + 'px',
                                top : destY + 'px'
                            }, settings.speed, settings.easing);
                        }, 1000 / settings.fps);
                    
                    $('#' + settings.boardId)
                        .mousemove(function(e) {
                            destX = (e.pageX - mouseOffsetX) - offsetBoard.left;
                            destY = (e.pageY - mouseOffsetY) - offsetBoard.top;
                            if (mysocket) {
                                mysocket.send({
                                    position: {
                                        stickify_id: settings.stickifyId,
                                        x: destX,
                                        y: destY
                                    }
                                });
                            }
                        })
                        .mouseup(function(e) {
                            clearInterval(intervalId);
                            $(this).unbind('mouseup').unbind('mousemove');
                            $(sticky).css({'z-index': 1});
                        });
                        
                })
                .appendTo('#' + settings.boardId)
                .append($children)
                .fadeIn(settings.fadeTime);
        });
    };
})(jQuery);