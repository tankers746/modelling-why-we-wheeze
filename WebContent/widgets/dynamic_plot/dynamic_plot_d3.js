$.widget('mwww.dynamic_plot_d3', {
    options: {
        
        channel:    "default/",
        topics:     ["A", "B", "C", "D", "xmax", "y", "z"],
        model:      function(logd_) {return logd_+9;},
        
        x_min:      -9,
        x_max:      -3,
        y_min:      0,
        y_max:      20,
        num_points: 50,
        
        aspect:     4/3,
        
        animation_speed:    200,

    },
    
    default_height:   300,
    height:           0,
    
    data:       {},
    
    svg:        {},
    g:          {},
    x_scale:    {},
    y_scale:    {},
    
    line:       {},
    path:       {},
    x_axis:     {},
    y_axis:     {},
    
    
    generate_data:  function(data, model, y_max) {
        for(var i=0; i<data.length; i++) {
            data[i].y = model(data[i].x);
            
            if(isNaN(data[i].y)) {
                data[i].y = 2*y_max;
            } else {
                data[i].y = Math.min(data[i].y, 2*y_max);
                data[i].y = Math.max(data[i].y, 0);
            }
            
            //console.log(data[i].x + " " + data[i].y);
        }
    },
    
    callback:   function(e) {
        //console.log("event");
        this.generate_data(this.data, this.options.model, this.options.y_max);

        //this.path.attr("d", this.line(this.data));
        
        this.path.transition()
            .attr("d", this.line(this.data))
            .duration(this.options.animation_speed)
            .ease(d3.easeCubic);
            
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
        if(this.options.aspect < 1e-12) throw ("ERROR: aspect cannot be <= 0 (in dynamic_plot_d3._create())");
        this.height = Math.min(this.element.height(), Math.floor(this.element.width() / this.options.aspect));
        this.element.css({"text-align": 'center'});
        
        
        //Create svg element
        this.svg = d3.select(this.element.get(0)).append("svg")
            .attr("height",  this.height)
            .attr("width",   Math.floor(this.height * this.options.aspect))
            .attr("style", "outline: 1px solid black;");
        
        
        //Set up margins and scales
        var margin = {top: 30, right: 30, bottom: 30, left: 30};
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
        this.data = [];
        
        for(var i=0; i<this.options.num_points; i++) {
            this.data.push({x: (this.x_scale.domain()[0]+i*step), y: 0});
        }
        
        this.generate_data(this.data, this.options.model, this.options.y_max);
        //console.log(this.data);
        
        
        
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
        
        var y_axis = d3.axisLeft()
            .scale(this.y_scale);
        
        this.g.append("g")
            .call(y_axis);
        
        
        //Plot line
        this.line = d3.line()
            .x($.proxy(function(d) {return this.x_scale(d.x);}, this))
            .y($.proxy(function(d) {return this.y_scale(d.y);}, this))
            //.curve(d3.curveLinear);
            .curve(d3.curveMonotoneX);
        
        this.path = this.g.append("path")
            .attr("d", this.line(this.data))
            .attr("fill", "none")
            .attr("stroke", "green")
            .attr("stroke-width", "3px");
        
        
        //Set up subscriber
        for(var i=0; i<this.options.topics.length; i++) {
            $.subscribe(this.options.channel + this.options.topics[i], $.proxy(this.callback, this));
        }
        
    },
    
    _destroy: function() {
        //Unsubscribe
        for(var i=0; i<this.options.topics.length; i++) {
            $.unsubscribe(this.options.channel + this.options.topics[i], this.callback);
        }
        //Remove widget, but leave original div.
        $(this.element).empty();
    }

});
