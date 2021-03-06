/**
 * Cross Section div
 *
 * This widget displays a cross section diagram of an airway using the DOM divs.
 * This work is derived from the original project by Daniel (quackingfrogs)
 *
 * Authors:
 *     Michael Baxter <20503664@student.uwa.edu.au>
 *
 * Since:
 *     19/10/2016
 *
 * Use:
 *     Insert the widget into a div using jquery, eg:
 *         $.(#my_div).cross_section_div();
 *
 *     The widget listens to channel/topic_radii and expects the array: [ra, rb, rc, rd].
 *     It then animates the circles to match.
 *
 *     The size of the widget can be set using the width option.  Height = width.
 *
 *     Delete the widget using:
 *         $.(#my_div).cross_section_d3("destroy");
 *
 *
 * Options:
 *     ra:  Inital lumen radius
 *     rb:  Initial mucosal layer outer radius
 *     rc:  Initial submucosal layer outer radius
 *     rd:  Initial ASM layer outer radius
 *     rmax:        Maximum ASM layer outer radius;
 *     channel:     Prefix of subscribed topics
 *     topic_radii: Topic suffix radii data
 *     animation_speed:     Duration of animations in ms
 *     width:   Width (and height) of widget
 *
 */

$.widget('mwww.cross_section_div', {
    options: {
        ra:     25,
        rb:     50,
        rc:     75,
        rd:     100,
        rmax:   100,
        
        channel:        "default/",
        topic_radii:    "radii",
        
        animation_speed:    400,
        
        width:   -1,
        
    },
    
    default_width:   275,
    
    container:  {},
    circles:    {},
    colours:    ['#ffffff', '#00ff00', '#ffff00', '#ff0000'],
    
    /*
     * callback_radii
     * Function called whent there is an event on the radii topic
     * Takes [ra, rb, rc, rd], updates local copies and animates
     * circles to match
     */
    callback_radii: function(e, ra_, rb_, rc_, rd_) {
        //USE $.PROXY WHEN INVOVIKING THIS METHOD IN $.SUBSCRIBE
        if(0 <= ra_ && ra_ <= this.options.rmax) {
            this.options.ra = ra_;
            this.animate(0, this.options.ra);
        }
        
        if(0 <= rb_ && rb_ <= this.options.rmax) {
            this.options.rb = rb_;
            this.animate(1, this.options.rb);
        }
        
        if(0 <= rc_ && rc_ <= this.options.rmax) {
            this.options.rc = rc_;
            this.animate(2, this.options.rc);
        }
        
        if(0 <= rd_ && rd_ <= this.options.rmax) {
            this.options.rd = rd_;
            this.animate(3, this.options.rd);
        }
        
    },
    
    /*
     * animate
     * Helper function for animating the circles to new radii
     *   i:  circle number
     *   r:  new radius
     */
    animate: function(i, r) {
        if(i<0 || i >= this.circles.length) {
            console.log("Error: Cannot select circle (animate)");
            return;
        } else if(r < 0) {
            console.log("Error: Radius r must be +ve (animate)");
            return;
        } else if(this.options.rmax < 1e-12) {
            console.log("Error: rmax must be +ve and non-zero (animate)");
            return;
        } else {
            //console.log("animate");
            //this.circles[i].attr("r", this.scale(r));
            var scaled_r = this.options.width * r / this.options.rmax;
            
            this.circles[i].stop();
            this.circles[i].animate({
                height:     scaled_r + "px",
                width:      scaled_r + "px",
                'margin-top':   -scaled_r/2 + "px",
                'margin-left':  -scaled_r/2 + "px",
            }, {
                queue: !1,
                duration: this.options.animation_speed,
                easing: "linear"
            });
            
        }
    },
    
    /*
     * update
     * Helper function that calls animate on all circles
     */
    update: function() {
        this.animate(0, this.options.ra);
        this.animate(1, this.options.rb);
        this.animate(2, this.options.rc);
        this.animate(3, this.options.rd);
    },
    
    circles_css_rules : {
        'position'  : 'absolute',
        'top'       : '50%',
        'left'      : '50%',
        'border'    : '1px solid #000',
        'box-sizing': 'border-box',
        'border-radius': '100%'
    },
    
    /*
     * _create
     * Function that is called on creation of the widget
     * Attatches a square div to the continer div and attaches
     * circle divs to that.
     * Also sets up subscriber and begins a starting animation.
     */
    _create: function() {
        
        //Check size of widget.
        if(this.options.width < 1) {
            this.options.width = this.default_width;
        }
        
        
        //Create container div for circles
        this.container = $("<div/>")
            .height(this.options.width)
            .width(this.options.width)
            .css({'position': 'relative', 'left': '50%', 'margin-left': -this.options.width/2 + "px"});
        $(this.element).append(this.container);
        
        
        //Create circles
        this.circles = new Array(this.colours.length);
        
        for(var i=this.circles.length-1; i>-1; i--) {
            this.circles[i] = $("<div/>")
                .css(this.circles_css_rules)
                .css({'background-color' : this.colours[i]});
            this.container.append(this.circles[i]);
        }


        //Set up subscriber
        $.subscribe(this.options.channel + this.options.topic_radii, $.proxy(this.callback_radii, this));

        //Starting animation
        this.update();
        
    },
    
    /*
     * _destroy
     * Function that is called on removal of the widget
     * Unsubscribes the widget and empties the containing div.
     */
    _destroy: function() {
        //Unsubscribe
        $.unsubscribe(this.options.channel + this.options.topic_radii, this.callback_radii);
        
        //Remove widget, but leave original div.
        $(this.element).empty();
    }
    
});
