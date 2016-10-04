$.widget('mwww.dynamic_plot_d3', {
    options: {
        channel:    "default/",
        topics:     ["A", "B", "C", "D", "xmax", "y", "z"],
        model:      function(x) {return -(x+6)*(x+6);},
        height:     300,
        width:      400,
        min:        -9,
        max:        -3,
        num_points: 50
    },
    
    $container:   {},
    callback:      {},
    
    
    _create: function() {
        
        var self = this;
        //var options = this.options;
        
        this.$container = $("<div/>", {
            id:     this.element.attr('id') + "_container",
            height: this.options.height + "px",
            width:  this.options.width + "px"
            
        }).css({'border' : '1px solid #000'});
        
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
        
        function generate_points() {
            data = [];
        
            for(var i=0; i<self.options.num_points; i++) {
                data.push({
                    x: x_scale.domain()[0]+i*step,
                    y: self.options.model(x_scale.domain()[0]+i*step)
                });
                //console.log(data[i].x + " " + data[i].y);
            }

            //y_scale.domain(d3.extent(data, function(d) {return d.y})).nice();
            //console.log(y_scale.domain()[0] + " " + y_scale.domain()[1]);
        }
        
        generate_points();
         
        //y_scale.domain(d3.extent(data, function(d) {return d.y})).nice();
        y_scale.domain([0, 10]);
    
        
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
        
        var path = g.append("path")
            .attr("d", line(data))
            .attr("fill", "none")
            .attr("stroke", "green")
            .attr("stroke-width", "3px");
        
        //Add axis
        x_axis = d3.axisBottom().scale(x_scale)
            .ticks(x_scale.domain()[1] - x_scale.domain()[0])
            .tickFormat(function (d) {return Math.pow(10,d+6);});
        
        y_axis = d3.axisLeft().scale(y_scale);
        
        g.append("g").attr("transform", "translate(0," + y_scale.range()[0] + ")").call(x_axis);
        g.append("g").call(y_axis);
        
        
        this.callback = function(e) {
            //This part should be done using .enter(), .exit() etc. methods.
            //console.log("event");
            generate_points();
            path.remove();
            path = g.append("path")
                .attr("d", line(data))
                .attr("fill", "none")
                .attr("stroke", "green")
                .attr("stroke-width", "3px");
        }
        
        for(var i=0; i<this.options.topics.length; i++) {
            $.subscribe(this.options.channel + this.options.topics[i], this.callback);
        }
    
        
        
    },
    
    _destroy: function() {
        for(var i=0; i<this.options.topics.length; i++) {
            $.unsubscribe(this.options.channel + this.options.topics[i], this.callback);
        }
        $(this.element).empty();
        $(this.element).remove();
    }

});
