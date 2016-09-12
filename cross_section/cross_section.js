
//TODO: use an arrays for everything.

$.widget('mwww.cross_section', {
    options: {
        A : 100,
        ra : 25,
        rb : 50,
        rc : 75,
        rd : 100,
        
        channel : "mwww/",
        default_size : 275,
        
        animation_speed : 400
        
    },
    
    cont_size : 0,
    
    $circ1 : {},
    $circ2 : {},
    $circ3 : {},
    $circ4 : {},
    
    handle_ra : {},
    handle_rb : {},
    handle_rc : {},
    handle_rd : {},
    
    
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
        this.animate_circle(this.$circ4, this.scale(this.options.rd));
        this.animate_circle(this.$circ3, this.scale(this.options.rc));
        this.animate_circle(this.$circ2, this.scale(this.options.rb));
        this.animate_circle(this.$circ1, this.scale(this.options.ra));
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
         
        this.$circ1 = $("<div/>", {id: $container.attr('id') + "_circ1"}).css(this.circles_css_rules);
        this.$circ2 = $("<div/>", {id: $container.attr('id') + "_circ2"}).css(this.circles_css_rules);
        this.$circ3 = $("<div/>", {id: $container.attr('id') + "_circ3"}).css(this.circles_css_rules);
        this.$circ4 = $("<div/>", {id: $container.attr('id') + "_circ4"}).css(this.circles_css_rules);
        
        this.$circ1.css({'background-color' : '#FFF'});
        this.$circ2.css({'background-color' : '#0F0'});
        this.$circ3.css({'background-color' : '#FF0'});
        this.$circ4.css({'background-color' : '#F00'});
        
        
        this.handel_ra = $.subscribe((options.channel + "ra"), function(e, data) {
            if(0 <= data && data <= options.rb) {
                options.ra = data;
                self.update();
            }
        });
        
        this.handel_rb = $.subscribe((options.channel + "rb"), function(e, data) {
            if(options.ra <= data && data <= options.rc) {
                options.rb = data;
                self.update();
            }
        });
        
        this.handel_rc = $.subscribe((options.channel + "rc"), function(e, data) {
            if(options.rb <= data && data <= options.rd) {
                options.rc = data;
                self.update();
            }
        });
        
        this.handel_rd = $.subscribe((options.channel + "rd"), function(e, data) {
            if(options.rc <= data && data <= options.A) {
                options.rd = data;
                self.update();
            }
        });

        
        $($container).append(this.$circ4).append(this.$circ3).append(this.$circ2).append(this.$circ1);
        this.update();
        
    },
         
    _destroy: function() {
        $.unsubscribe((options.channel+"ra"), this.handle_ra);
        $.unsubscribe((options.channel+"rb"), this.handle_rb);
        $.unsubscribe((options.channel+"rc"), this.handle_rc);
        $.unsubscribe((options.channel+"rd"), this.handle_rd);
        
        $(this.element).empty();
        $(this.element).remove();
    }
    
});
