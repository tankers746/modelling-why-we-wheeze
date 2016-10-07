
$.widget('mwww.cross_section_d3', {
    options: {
        ra:     25,
        rb:     50,
        rc:     75,
        rd:     100,
        rmax:  100,
        
        channel:        "default/",
        topic_radii:    "radii",
        
        animation_speed: 400,
    },
    
    default_size:   275,
    size:           0,
    
    svg:    {},
    g:      {},
    scale:  {},
    
    circles:    {},
    colours:    ['#ffffff', '#00ff00', '#ffff00', '#ff0000'],
    dot:        {},
    
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
        
        if(ra_ == 0 && this.dot.attr("fill") == "none") {
            //this.dot.attr("fill", "black");
            this.dot.transition()
                .attr("fill", "black")
                .delay(this.options.animation_speed);
        }
        
        if(ra_ > 0 && this.dot.attr("fill") != "none"){
            this.dot.attr("fill", "none");
        }
    },
    
    animate: function(i, r) {
        if(i<0 || i >= this.circles.length) {
            console.log("Error: Cannot select circle (animate)");
            return;
        } else if (r < 0) {
            console.log("Error: Radius r must be +ve (animate)");
            return;
        } else {
            //console.log("animate");
            //this.circles[i].attr("r", this.scale(r));
            this.circles[i].transition()
                .attr("r", this.scale(r))
                .duration(this.options.animation_speed)
                .ease(d3.easeLinear);
        }
    },
    
    update: function() {
        this.animate(0, this.options.ra);
        this.animate(1, this.options.rb);
        this.animate(2, this.options.rc);
        this.animate(3, this.options.rd);
    },
    
    
    _create: function() {
        
        //First resize widget if too small.
        if(this.element.height() < 1) {
            this.element.height(this.default_size);
        }
        
        if(this.element.width() < 1) {
            this.element.width(this.default_size);
        }
        
        //Find size for svg and set it to center.
        this.size = Math.min(this.element.height(), this.element.width());
        this.element.css({"text-align": 'center'});
        
        //Create svg element
        this.svg = d3.select(this.element.get(0)).append("svg")
            .attr("height",  this.size)
            .attr("width",   this.size);
        
        //Add an svg group element.  We will use a transform to center the circles.
        this.g = this.svg.append("g")
            .attr("transform", "translate(" + this.size/2 + "," + this.size/2 + ")");
        
        //Create a scale for the circles.
        this.scale = d3.scaleLinear()
            .domain([0, this.options.rmax])
            .range([0, this.size/2-1]);
        
        //Create circles
        this.circles = new Array(this.colours.length);
        
        for(var i=this.circles.length-1; i>-1; i--) {
            this.circles[i] = this.g.append("circle")
                .attr("cx", 0)
                .attr("cy", 0)
                .attr("r", 0)
                .attr("fill", this.colours[i])
                .attr("stroke", "black")
                .attr("stroke-width", "1px");
        }
        
        //Create center dot for when ra = 0
        this.dot = this.g.append("circle")
            .attr("cx", 0)
            .attr("cy", 0)
            .attr("r", 1)
            .attr("fill", "none");
        
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
