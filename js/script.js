(function($) {
    
    function Timeline(options, $tl, $hl, $cnt) {

        function init() {
            populate();
            scaleTimeline();
            scaleTicks();
        }

        function populate() {
            var spacing = $cnt.width()*0.7;
            var left = 0;
            options.unshift("Beginning of Time");
            options.push("End of Time");
            $.each(options, function(index, value) {
                var posCl;
                if (index === 0) {
                    posCl = 'first';
                } else if (index === options.length-1) {
                    posCl = 'last';
                } else {
                    posCl = '';
                }
                var $tlelem = $("<div class='tl-elem'><div class='label "+posCl+"'>"+value+"</div></div>");
                $tlelem.css("left", left+"px");
                $tl.append($tlelem);
                left += spacing;
            });
        }
        
        function scaleTimeline() {
            var $first = $tl.children().first();
            var $last = $tl.children().last();
            var distance = $last.offset().left - $first.offset().left;
            $tl.css("width", distance+"px");
        }
        
        function scaleTicks() {
            var $ticks = $tl.children();
            var hlLPos = $hl.offset().left;
            var hlRPos = hlLPos + $hl.outerWidth(true);
            $.each($ticks, function(index, value) {
                var tickPos = $(this).offset().left;
                if ( (tickPos > hlLPos) && (tickPos < hlRPos) ) {
                    $(this).addClass("selected");
                } else {
                    $(this).removeClass("selected");
                }
            });
        }
        
        function scrollTimeline(distance) {
            var minLeft = $cnt.offset().left + $cnt.outerWidth(true)/10;
            var maxLeft = $tl.width() - $cnt.outerWidth(true)*8/10;
            console.log(maxLeft);
            var left = parseInt($tl.css("left").replace("px", ""));
            var newLeft = left + distance;
            if (newLeft > minLeft) {
                newLeft = minLeft;
            } else if (newLeft < -maxLeft) {
                newLeft = -maxLeft;
            }
            $tl.css("left", newLeft+"px");
            scaleTicks();
        }

        init();

        this.scroll = function(distance) {
            scrollTimeline(distance);
        };

        return this;
    }

    var timeline = new Timeline(["Month 1", "Month 2", "Month 3", "Special", "Month 4"],
        $("#timeline"), $("#activeArea"), $("#container"));

    var distance = 0;
    var container = document.getElementById('container');
    var hammertime = new Hammer(container);
    hammertime.get('pan').set({
        direction: Hammer.DIRECTION_ALL
    });
    hammertime.on('panstart', function(ev) {
        distance = 0;
    });
    hammertime.on('pan', function(ev) {
        var deltaX = ev.deltaX - distance;
        distance = ev.deltaX;
        timeline.scroll(deltaX);
    });
    
})(jQuery);