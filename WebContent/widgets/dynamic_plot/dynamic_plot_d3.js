/**
 * Dynamic Plot d3
 *
 * This widget creates a plot of Airway Resistance vs [methacholine].
 * It is called "dynamic plot" since thers is a single curve, but it responds dynamically to input.
 *
 * Authors:
 *     Damon van der Linde
 *     Michael Baxter <20503664@student.uwa.edu.au>
 *
 * Since:
 *     19/10/2016
 *
 * Use:
 *     Insert the widget into a div using jquery, eg:
 *         $.(#my_div).dynamic_plot_d3({model: myfunction});
 *
 *     It is important to provide a refernce to the function plotted.
 *
 *     The widget listens to the topics specified in the topic array, and updates on event.
 *
 *
 *     The size of the widget can be set using the width option.
 *     Height = width/aspect
 *
 *     Delete the widget using:
 *         $.(#my_div).dynamic_plot_d3("destroy");
 *
 *
 * Options:
 *     channel:     Prefix of subscribed topics
 *     topics:      Array of topic suffixes to listen on
 *     model:       Reference to function that will be plotted
 *     x_min:       Minimum value of logd on x axis
 *     x_max:       Maximum value of logd on x axis
 *     y_min:       Minimum value on y axis
 *     y_max:       Maximum value on y axis
 *     num_points:  Number of points plotted on graph (curve is smoothly interploated)
 *     animation_speed: Duration of animation when graph is updated
 *     width:       Width of widget
 *     aspect:      Aspect ration of graph as a fraction
 *
 */

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
        
        animation_speed:    200,
        
        width:      -1,
        aspect:     4/3,
    },
    
    default_width:   400,
    
    data:       {},
    
    svg:        {},
    g:          {},
    x_scale:    {},
    y_scale:    {},
    
    line:       {},
    path:       {},
    x_axis:     {},
    y_axis:     {},
    
    
    /*
     * generate_data
     * Helper functon that generates an array of data points from the model funciton.
     */
    generate_data:  function(data, model, y_max) {
        for(var i=0; i<data.length; i++) {
            data[i].y = model(data[i].x);
            
            if(isNaN(data[i].y)) {
                data[i].y = 10*y_max;
            } else {
                data[i].y = Math.min(data[i].y, 10*y_max);
                data[i].y = Math.max(data[i].y, 0);
            }
            
            //console.log(data[i].x + " " + data[i].y);
        }
    },
    
    /*
     * callback
     * Function that is called whenever an event on one of the topics is triggered.
     * Re-geneates the set of points and animates curve.
     */
    callback:   function(e) {
        //console.log("event");
        this.generate_data(this.data, this.options.model, this.options.y_max);

        //this.path.attr("d", this.line(this.data));
        
        this.path.transition()
            .attr("d", this.line(this.data))
            .duration(this.options.animation_speed)
            .ease(d3.easeCubic);
            
    },
    
    /*
     * _create
     * Function that is called on creation of the widget
     * Attatches an svg canvas to the continer div and draws graph inside.
     * Also sets up subscribers.
     */
    _create: function() {
        
        //Check size of widget.
        if(this.options.aspect < 1e-12) {
            console.log("Error: graph aspect ration must be > 0");
            this.options.aspect = 4/3;
        }
        
        if(this.options.width < 90 || this.options.width/this.options.aspect < 90) {
            this.options.width = this.default_width;
        }
        
        
        //Create svg element
        this.svg = d3.select(this.element.get(0)).append("svg")
            .attr("height",  Math.floor(this.options.width/this.options.aspect))
            .attr("width",   this.options.width);
            //.attr("style", "outline: 1px solid black;");
        
        this.element.css({"text-align": 'center'});
        
        
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
    
    /*
     * _destroy
     * Function that is called on removal of the widget
     * Unsubscribes the widget and empties the containing div.
     */
    _destroy: function() {
        //Unsubscribe
        for(var i=0; i<this.options.topics.length; i++) {
            $.unsubscribe(this.options.channel + this.options.topics[i], this.callback);
        }
        //Remove widget, but leave original div.
        $(this.element).empty();
    }

});
