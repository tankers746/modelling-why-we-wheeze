$.widget('mwww.multi_plot_d3', {
    options: {
        channel:    "default/",
        logd_topic: "logd",
        S_topic:    "S",
        model:      function(x, y) {return -(x+6)*(y);},
        height:     300,
        width:      400,
        min:        -9,
        max:        -3,
        num_points: 50,
        num_plots: 7,
    },
    
    
    S:      0,
    logd:   -9,
    
    $container:     {},
    callback_logd:  {},
    callback_S:     {},
    
    
    _create: function() {
        
        var self = this;
        //var options = this.options;
        
        this.$container = $("<div/>", {
            id:     this.element.attr('id') + "_container",
            height: this.options.height + "px",
            width:  this.options.width + "px"
            
        }).css({'border' : '1px solid #000', 'position': 'relative', 'left': '50%', 'margin-left': -this.options.width/2 + "px"});
        
        $(this.element).append(this.$container);
        
        
        
        //Set a few constants
        var margin = {top: 30, right: 30, bottom: 30, left: 30};
        var inner_height = this.options.height - margin.top - margin.bottom;
        var inner_width = this.options.width - margin.left - margin.right;
        var x_scale = d3.scaleLinear().range([0, inner_width]);
        var y_scale = d3.scaleLinear().range([inner_height, 0]);
        
        x_scale.domain([this.options.min, this.options.max]);
        
        
        //Generate a set of points:
        var step = (x_scale.domain()[1]-x_scale.domain()[0])/(this.options.num_points-1);
        var data = [];
        
        for(var j=0; j<this.options.num_plots; j++) {
            data[j] = [];
            for(var i=0; i<this.options.num_points; i++) {
                data[j].push({
                    x: x_scale.domain()[0]+i*step,
                    y: this.options.model(x_scale.domain()[0]+i*step, j)
                });
                //console.log(j + " " + data[j][i].x + " " + data[j][i].y);
            }
        }
        
        //var y_max = d3.max(data, function(d) {return d[d.length-1].y});
        //var y_min = d3.max(data, function(d) {return d[0].y});
        //y_scale.domain([y_min, y_max]).nice();
        y_scale.domain([0, 10]);
        
        //console.log(y_scale.domain());
        
        
        
        //Add an sgv canvas
        var svg = d3.select(this.$container.get(0)).append("svg")
            .attr("height",  this.options.height)
            .attr("width", this.options.width);


        //Plot line
        var line = d3.line()
            .x(function(d) {return x_scale(d.x);})
            .y(function(d) {return y_scale(d.y);});

        var g = svg.append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        
        var paths = [];
        for(var j=0; j<data.length; j++) {
            paths.push(g.append("path")
                .attr("d", line(data[j]))
                .attr("fill", "none")
                .attr("stroke", "gray")
                .attr("stroke-width", "3px")
            );
        }
        paths[0].attr("stroke", "blue");
        
        //Add axis
        x_axis = d3.axisBottom().scale(x_scale)
            .ticks(x_scale.domain()[1] - x_scale.domain()[0])
            .tickFormat(function (d) {return Math.pow(10,d+6);});
        
        y_axis = d3.axisLeft().scale(y_scale);
        
        g.append("g").attr("transform", "translate(0," + y_scale.range()[0] + ")").call(x_axis);
        g.append("g").call(y_axis);
        
        
        //Add position marker
        var marker = g.append("circle")
            .attr("fill", "white")
            .attr("stroke", "black")
            .attr("stroke-width", 2)
            .attr("r", 6)
            .attr("cx", 0)
            .attr("cy", y_scale.range()[0]);
            
        
        //Animate position maker
        var model = this.options.model;
        this.callback_logd = function(e, logd_) {
            self.logd = logd_;
            //console.log("event");
            marker.transition()
                .attr("cx", x_scale(self.logd))
                .attr("cy", y_scale(model(self.logd, self.S)));
                //console.log(self.logd + " " + self.S + " " + model(self.logd, self.S));
        };
        
        this.callback_S = function(e, S_) {
            if(0 <= S_ && S_ < self.options.num_plots) {
                
                paths[self.S].attr("stroke", "gray");
                self.S = S_;
                paths[self.S].attr("stroke", "blue");
                
                //console.log("event");
                marker.transition()
                .attr("cy", y_scale(model(self.logd, self.S)));
                //console.log(self.logd + " " + self.S + " " + model(self.logd, self.S));
            }
        };
        
        $.subscribe(this.options.channel + this.options.logd_topic, this.callback_logd);
        $.subscribe(this.options.channel + this.options.S_topic, this.callback_S);
        
        
    },
    
    _destroy: function() {
        $.unsubscribe(this.options.channel + this.options.logd_topic, this.callback_logd);
        $.unsubscribe(this.options.channel + this.options.S_topic, this.callback_S);
        $(this.element).empty();
        $(this.element).remove();
    }

});
