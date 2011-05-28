(function($) {
    $.fn.crossFade = function(current, options) {
        current = $(current);
        var defaults = {
            callbackIn : '',
            callbackOut: '',
            easingIn   : 'linear',
            easingOut  : 'linear',
            speedIn    : 200,
            speedOut   : 200
        };
        
        var settings = $.extend({}, defaults, options);
        
        return this.each(function() {
            current
                .stop()
                .animate({ opacity: 0 }, settings.speedOut, settings.easingOut, function() {
                    if (settings.callbackOut && typeof settings.callbackOut === 'function') {
                        settings.callbackOut();
                    }
                });
            
            $(this)
                .stop()
                .animate({ opacity: 1 }, settings.speedIn, settings.easingIn, function() {
                    if (settings.callbackIn && typeof settings.callbackOut === 'function')
                        settings.callbackIn();
                });
        });
    }
})(jQuery);