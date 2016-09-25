
$.widget('mwww.cross_section', {
    options: {
        A : 100,
        ra : 25,
        rb : 50,
        rc : 75,
        rd : 100,
        
        channel : "default/",
        default_size : 275,
        
        animation_speed : 400
        
    },
    
    cont_size : 0,
    
    $circles : [],
    
    callbacks : [],
    
    topics : ["rd", "rc", "rb", "ra"],
    
    colours : ['#F00', '#FF0', '#0F0', '#FFF'],
    
    
    scale: function(r) {
        if(this.options.A > 0) {
            return this.cont_size * r / this.options.A;
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
         
        var self = this // is a popular phrase.
        var options = this.options;
        var $container = this.element;
        this.cont_size = options.default_size;
         
        // Change size of container div
        $container.height(this.cont_size);
        $container.width(this.cont_size);
        $container.css({'position' : 'relative'});
        //$container.css({'background-color' : 'blue'});
        
        var i;
        for(i = 0; i<this.topics.length; i++) {
            this.$circles[i] = $("<div/>", {id: $container.attr('id') + "_circ" + (i+1)})
                                .css(this.circles_css_rules)
                                .css({'background-color' : this.colours[i]});
        }
        
        this.callbacks[0] = function(e, data) {
            if(0 <= data && data <= options.A) {
                options.rd = data;
                self.update();
            }
        };
        
        this.callbacks[1] = function(e, data) {
            if(0 <= data && data <= options.A) {
                options.rc = data;
                self.update();
            }
        };
        
        this.callbacks[2] = function(e, data) {
            if(0 <= data && data <= options.A) {
                options.rb = data;
                self.update();
            }
        };
        
        this.callbacks[3] = function(e, data) {
            if(0 <= data && data <= options.A) {
                options.ra = data;
                self.update();
            }
        };
        
        for(i=0; i<this.topics.length; i++) {
            $.subscribe((options.channel + this.topics[i]), this.callbacks[i]);
        }
        
        $($container).append(this.$circles[0])
                     .append(this.$circles[1])
                     .append(this.$circles[2])
                     .append(this.$circles[3]);
        this.update();
        
    },
         
    _destroy: function() {
        var i;
        for(i=0; i<this.topics.length; i++) {
            $.unsubscribe((options.channel + this.topics[i]), this.callbacks[i]);
        }
        
        $(this.element).empty();
        $(this.element).remove();
    }
    
});
