/**
 * Single Plot d3
 *
 * This widget creates a plot of ASM shortening (%) vs [methacholine].
 * It is called "single plot" since there is only one static curve.
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
 *         $.(#my_div).single_plot_d3({model: myfunction});
 *
 *     It is important to provide a refernce to the function plotted.
 *
 *     The widget listens to channel/topic_logd and expects a double: [logd].
 *     The marker dot moves along the curve to the corresponding point.
 *
 *     The size of the widget can be set using the width option.
 *     Height = width/aspect
 *
 *     Delete the widget using:
 *         $.(#my_div).single_plot_d3("destroy");
 *
 *
 * Options:
 *     channel:     Prefix of subscribed topics
 *     topic_logd:  Topic suffix for logd data
 *     model:       Reference to function that will be plotted
 *     x_min:       Minimum value of logd on x axis
 *     x_max:       Maximum value of logd on x axis
 *     num_points   Number of points plotted on graph (curve is smoothly interploated)
 *     width:       Width of widget
 *     aspect:      Aspect ration of graph as a fraction
 *
 */

$.widget('mwww.single_plot_d3', {
    options: {
        channel:    "default/",
        topic_logd: "logd",
        model:      function(logd_) {return logd_+9;},
        
        x_min:      -9,
        x_max:      -3,
        num_points: 20,
        
        width:      -1,
        aspect:     4/3,
    },
    
    default_width:  400,
    
    svg:        {},
    g:          {},
    x_scale:    {},
    y_scale:    {},
    
    path:       {},
    x_axis:     {},
    y_axis:     {},
    marker:     {},
    
    /*
     * callback_logd
     * Function called whent there is an event on the logd topic
     * Animates marker dot along curve.
     */
    callback_logd:  function(e, logd_) {
        //console.log("event");
        
        this.marker.transition()
            .attr("cx", this.x_scale(logd_))
            .attr("cy", this.y_scale(this.options.model(logd_)))
            .duration(20)
            .ease(d3.easeLinear);
        
        //this.marker
        //    .attr("cx", this.x_scale(logd_))
        //    .attr("cy", this.y_scale(this.options.model(logd_)));
    },
    
    
    /*
     * _create
     * Function that is called on creation of the widget
     * Attatches an svg canvas to the continer div and draws graph inside.
     * Also sets up subscriber.
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
        
        
        //Set up margins and x scale
        var margin = {top: 30, right: 30, bottom: 60, left: 60};
        var inner_height = this.svg.attr("height") - margin.top - margin.bottom;
        var inner_width = this.svg.attr("width") - margin.left - margin.right;
        this.x_scale = d3.scaleLinear()
            .range([0, inner_width])
            .domain([this.options.x_min, this.options.x_max]);
            
        
        
        //Generate the points and set y scale.
        var step = (this.x_scale.domain()[1]-this.x_scale.domain()[0])/(this.options.num_points-1);
        var data = [];
        
        for(var i=0; i<this.options.num_points; i++) {
            data.push({x: (this.x_scale.domain()[0]+i*step), y: 0});
            data[i].y = this.options.model(data[i].x);
            //console.log(data[i].x + " " + data[i].y);
        }
        
        this.y_scale = d3.scaleLinear()
            .range([inner_height, 0])
            .domain(d3.extent(data, function(d) {return d.y})).nice();
        
        
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
		var xPosMargin = 70,
			yPosMargin = 17;
		this.svg.append("text")
			.attr("transform", "translate(" + xPosMargin + "," + yPosMargin + ")")
			.style("text-anchor", "middle")
			.text("ASM shortening (%)");
        
        //Plot line
        var line = d3.line()
            .x($.proxy(function(d) {return this.x_scale(d.x);}, this))
            .y($.proxy(function(d) {return this.y_scale(d.y);}, this))
            //.curve(d3.curveLinear);
            .curve(d3.curveMonotoneX);
            
        this.path = this.g.append("path")
            .attr("d", line(data))
            .attr("fill", "none")
            .attr("stroke", "red")
            .attr("stroke-width", "3px");
            
        //Add marker
        this.marker = this.g.append("circle")
            .attr("fill", "white")
            .attr("stroke", "black")
            .attr("stroke-width", 2)
            .attr("r", 6)
            .attr("cx", 0)
            .attr("cy", this.y_scale.range()[0]);
        
        //Set up subscriber
        $.subscribe(this.options.channel + this.options.topic_logd, $.proxy(this.callback_logd, this));
        
    },
    
    /*
     * _destroy
     * Function that is called on removal of the widget
     * Unsubscribes the widget and empties the containing div.
     */
    _destroy: function() {
        //Unsubscribe
        $.unsubscribe(this.options.channel + this.options.topic_logd, this.callback_logd);
        
        //Remove widget, but leave original div.
        $(this.element).empty();
    }

});
