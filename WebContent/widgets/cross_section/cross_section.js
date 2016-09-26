
$.widget('mwww.cross_section', {
    options: {
        A : 100,
        ra : 25,
        rb : 50,
        rc : 75,
        rd : 100,
        
        channel : "default/",
        topic_A : "A",
        topic_radii : "radii",
         
         
        size : 275,
        
        animation_speed : 400
        
    },
    
    $container: {},
    $circles:   [{},{},{},{}],
    colours:    ['#F00', '#FF0', '#0F0', '#FFF'],
    
    callback_radii: {},
    callback_A:     {},
    
    
    scale: function(r) {
        if(this.options.A > 0) {
            return this.$container.width() * r / this.options.A;
        }
        alert("Error: scale(r), A cannot be 0");
        return 0;
    },
    
    animate_circle: function($circ, size) {
        $circ.animate({
            height: size + "px",
            width: size + "px",
            'margin-top' : -size/2 + "px",
            'margin-left' : -size/2 + "px",
        }, {
            queue: !1,
            duration: this.options.animation_speed,
            easing: "linear"
        });
    },
    
    update: function() {
        this.animate_circle(this.$circles[0], this.scale(this.options.rd));
        this.animate_circle(this.$circles[1], this.scale(this.options.rc));
        this.animate_circle(this.$circles[2], this.scale(this.options.rb));
        this.animate_circle(this.$circles[3], this.scale(this.options.ra));
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
         
        var self = this;
        var options = this.options;
         
        // Change size of container div
        this.$container = $("<div/>", {id: this.element.attr('id') + "_container"})
        this.$container.height(options.size);
        this.$container.width(options.size);
        this.$container.css({'position': 'relative', 'left': '50%', 'margin-left': -this.$container.width()/2 + "px"});
        //this.$container.css({'background-color' : 'blue'});
        
        var i;
        for(i = 0; i<this.$circles.length; i++) {
            this.$circles[i] = $("<div/>", {
                id: this.element.attr('id') + "_circ" + (i+1)
            }).css(this.circles_css_rules).css({'background-color' : this.colours[i]});
        }
        
        
        this.callback_radii = function(e, ra_, rb_, rc_, rd_) {
            if(0 <= ra_ && ra_ <= options.A)    options.ra = ra_;
            if(0 <= rb_ && rb_ <= options.A)    options.rb = rb_;
            if(0 <= rc_ && rc_ <= options.A)    options.rc = rc_;
            if(0 <= rd_ && rd_ <= options.A)    options.rd = rd_;
            self.update();
        };
        
        this.callback_A = function(e, A_) {
            if(A_ > 0) {
                options.A = A_;
                self.update();
            }
        };
        
        
        
        $.subscribe(options.channel + options.topic_A, this.callback_A);
        $.subscribe(options.channel + options.topic_radii, this.callback_radii);
        
        this.$container.append(this.$circles[0])
                       .append(this.$circles[1])
                       .append(this.$circles[2])
                       .append(this.$circles[3]);
                       
        $(this.element).append(this.$container);
                       
                       
                       
        this.update();
        
    },
         
    _destroy: function() {
        $.unsubscribe(options.channel + options.topic_A, this.callback_A);
        $.unsubscribe(options.channel + options.topic_radii, this.callback_radii);
        
        $(this.element).empty();
        $(this.element).remove();
    }
    
});
