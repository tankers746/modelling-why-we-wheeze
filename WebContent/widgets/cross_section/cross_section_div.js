
$.widget('mwww.cross_section_div', {
    options: {
        ra:     25,
        rb:     50,
        rc:     75,
        rd:     100,
        rmax:   100,
        
        channel:        "default/",
        topic_radii:    "radii",
        
        animation_speed: 400,
        
    },
    
    default_size:   275,
    size:           0,
    
    container:  {},
    circles:    {},
    colours:    ['#ffffff', '#00ff00', '#ffff00', '#ff0000'],
    
    
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
            var scaled_r = this.size * r / this.options.rmax;
            
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
    
    
    _create: function() {
        
        //First resize widget if too small.
        if(this.element.height() < 1) {
            this.element.height(this.default_size);
        }
        
        if(this.element.width() < 1) {
            this.element.width(this.default_size);
        }
        
        this.size = Math.min(this.element.height(), this.element.width());
        
        
        //Create container div for circles
        this.container = $("<div/>");
        this.container.height(this.size)
            .width(this.size)
            .css({'position': 'relative', 'left': '50%', 'margin-left': -this.size/2 + "px"});
        $(this.element).append(this.container);
        
        
        //Create circles
        this.circles = new Array(this.colours.length);
        
        for(var i=this.circles.length-1; i>-1; i--) {
            this.circles[i] = $("<div/>");
            this.circles[i].css(this.circles_css_rules)
                .css({'background-color' : this.colours[i]});
            this.container.append(this.circles[i]);
        }


        //Set up subscriber
        $.subscribe(this.options.channel + this.options.topic_radii, $.proxy(this.callback_radii, this));

        //Starting animation
        this.update();
        
    },
         
    _destroy: function() {
        //Unsubscribe
        $.unsubscribe(this.options.channel + this.options.topic_radii, this.callback_radii);
        
        //Remove widget, but leave original div.
        $(this.element).empty();
    }
    
});
