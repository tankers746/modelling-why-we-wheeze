$.widget('mwww.multi_plot_d3', {
    options: {
        channel:    "default/",
        topic_logd: "logd",
        topic_S:    "S",
        model:      function(logd_, S_) {return (logd_+9) + S_;},
        
        num_plots:  7,
        
        x_min:      -9,
        x_max:      -3,
        y_min:      0,
        y_max:      20,
        num_points: 50,
        
        aspect:     4/3,
        
        animation_speed:    200,
        
    },
    
    S:      0,
    logd:   -9, 
    
    default_height:   300,
    height:           0,
    
    svg:        {},
    g:          {},
    x_scale:    {},
    y_scale:    {},
    
    paths:      {},
    x_axis:     {},
    y_axis:     {},
    marker:     {},
    
    
    clip_input:     function(y, max) {
        if(isNaN(y))    return 2*max;
        y = Math.min(y, 2*max);
        y = Math.max(0, y);
        return y;
    },
    
    callback_S:     function(e, S_) {
        //console.log("event");
        
        if(0 <= S_ && S_ < this.paths.length) {
            this.paths[this.S].attr("stroke", "gray");
            this.paths[S_].attr("stroke", "blue");
            
            this.S = S_;
            
            var y = this.clip_input(this.options.model(this.logd, S_), this.y_scale.domain()[1]);
            
            this.marker.transition()
                .attr("cx", this.x_scale(this.logd))
                .attr("cy", this.y_scale(y))
                .duration(this.options.animation_speed)
                .ease(d3.easeCubic);
            
        }
    },
    
    callback_logd:  function(e, logd_) {
        //console.log("event");
        
        this.logd = logd_;
        
        var y = this.clip_input(this.options.model(logd_, this.S), this.y_scale.domain()[1]);
        
        //this.marker
        //    .attr("cx", this.x_scale(logd_))
        //    .attr("cy", this.y_scale(y));
        
        this.marker.transition()
            .attr("cx", this.x_scale(logd_))
            .attr("cy", this.y_scale(y))
            .duration(20)
            .ease(d3.easeLinear);
    },
    
    
    _create: function() {
        
        //Resize widget if too small
        if(this.element.height() < 1) {
            this.element.height(this.default_height);
        }
        
        if(this.element.width() < 1) {
            this.element.width(Math.floor(this.default_height * this.options.aspect));
        }
        
        
        //Find size for svg and set it to center.
        if(this.options.aspect < 1e-12) throw ("ERROR: aspect cannot be <= 0 (in multi_plot_d3._create())");
        this.height = Math.min(this.element.height(), Math.floor(this.element.width() / this.options.aspect));
        this.element.css({"text-align": 'center'});
        
        
        //Create svg element
        this.svg = d3.select(this.element.get(0)).append("svg")
            .attr("height",  this.height)
         .attr("width",   Math.floor(this.height * this.options.aspect));
            //.attr("style", "outline: 1px solid black;");
            
        //Set up margins and scales
        var margin = {top: 30, right: 30, bottom: 60, left: 60};
        var inner_height = this.svg.attr("height") - margin.top - margin.bottom;
        var inner_width = this.svg.attr("width") - margin.left - margin.right;
        
        this.x_scale = d3.scaleLinear()
            .range([0, inner_width])
            .domain([this.options.x_min, this.options.x_max]);
            
        this.y_scale = d3.scaleLinear()
            .range([inner_height, 0])
            .domain([this.options.y_min, this.options.y_max]);
        
        
        //Generate the points
        var step = (this.x_scale.domain()[1]-this.x_scale.domain()[0])/(this.options.num_points-1);
        var data = [];
        
        for(var j=0; j<this.options.num_plots; j++) {
            data[j] = [];
            for(var i=0; i<this.options.num_points; i++) {
                data[j].push({x: (this.x_scale.domain()[0]+i*step), y: 0});
                data[j][i].y = this.options.model(data[j][i].x, j);
                data[j][i].y = this.clip_input(data[j][i].y, this.y_scale.domain()[1]);
                //console.log(j + " " + data[j][i].x + " " + data[j][i].y);
            }
        }
        
        
        //Create svg group element
        this.g = this.svg.append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
			
        //Add axis
        var x_axis = d3.axisBottom()
            .scale(this.x_scale)
            .ticks(this.x_scale.domain()[1] - this.x_scale.domain()[0])
            .tickFormat(function (d) {return Math.pow(10,d+6);});
        
        this.g.append("g")
            .attr("transform", "translate(0," + this.y_scale.range()[0] + ")").call(x_axis);
		
		//Add x Axis Text lable
		var xAxisTextFromBottom = 15;
		this.svg.append("text")
			.attr("transform", "translate(" + this.svg.attr("width")/2 + "," + (this.svg.attr("height") - xAxisTextFromBottom) + ")")
			.style("text-anchor", "middle")
			.text("Methocholine dose (\u03BCM)");
        
        var y_axis = d3.axisLeft()
            .scale(this.y_scale);
        
        this.g.append("g")
            .call(y_axis); 

		//Add y Axis Text lable
		var xPosMargin = 65,
			yPosMargin = 17;
		this.svg.append("text")
			.attr("transform", "translate(" + xPosMargin + "," + yPosMargin + ")")
			.style("text-anchor", "middle")
			.text("Airway Resistance");
            
        //Plot lines
        var line = d3.line()
            .x($.proxy(function(d) {return this.x_scale(d.x);}, this))
            .y($.proxy(function(d) {return this.y_scale(d.y);}, this))
            //.curve(d3.curveLinear);
            .curve(d3.curveMonotoneX);
        
        this.paths = [];
        for(var j=0; j<data.length; j++) {
            this.paths.push(this.g.append("path")
                .attr("d", line(data[j]))
                .attr("fill", "none")
                .attr("stroke", "gray")
                .attr("stroke-width", "3px")
            );
        }
        this.paths[this.S].attr("stroke", "blue");
        
        
        //Add marker
        this.marker = this.g.append("circle")
            .attr("fill", "white")
            .attr("stroke", "black")
            .attr("stroke-width", 2)
            .attr("r", 6)
            .attr("cx", 0)
            .attr("cy", this.y_scale.range()[0]);
        
        //Set up subscribers
        $.subscribe(this.options.channel + this.options.topic_S, $.proxy(this.callback_S, this));
        
        $.subscribe(this.options.channel + this.options.topic_logd, $.proxy(this.callback_logd, this));
    
    },
    
    _destroy: function() {
        //Unsubscribe
        $.unsubscribe(this.options.channel + this.options.topic_S, this.callback_S);
        $.unsubscribe(this.options.channel + this.options.topic_logd, this.callback_logd);
        
        //Remove widget, but leave original div.
        $(this.element).empty();
    }

});
