/**
 * Cross Section d3
 *
 * This widget displays a cross section diagram of an airway using the d3 library.
 *
 * Authors:
 *     Michael Baxter <20503664@student.uwa.edu.au>
 *
 * Since:
 *     19/10/2016
 * 
 * Use:
 *     Insert the widget into a div using jquery, eg:
 *         $.(#my_div).cross_section_d3({rmax: 100});
 *
 *     The only essential option is rmax, which is default set to 0 for starting animation.
 *
 *     The widget listens to channel/topic_radii and expects the array: [ra, rb, rc, rd].
 *     It then animates the circles to match.
 *
 *     The size of the widget can be set using the width option.  Height = width.
 *
 *     Delete the widget using:
 *         $.(#my_div).cross_section_d3("destroy");
 *
 *
 * Options:
 *     ra:  Inital lumen radius
 *     rb:  Initial mucosal layer outer radius
 *     rc:  Initial submucosal layer outer radius
 *     rd:  Initial ASM layer outer radius
 *     rmax:        Maximum ASM layer outer radius;
 *     channel:     Prefix of subscribed topics
 *     topic_radii: Topic suffix radii data
 *     animation_speed:     Duration of animations in ms
 *     width:   Width (and height) of widget
 *
 */

$.widget('mwww.cross_section_d3', {
    options: {
        ra:     0,
        rb:     0,
        rc:     0,
        rd:     0,
        rmax:   1,
        
        channel:        "default/",
        topic_radii:    "radii",
        
        animation_speed: 400,
        
        width:   -1,
        
    },
    
    default_width:   275,
    
    svg:    {},
    g:      {},
    scale:  {},
    
    circles:    {},
    colours:    ['#ffffff', '#00ff00', '#ffff00', '#ff0000'],
    dot:        {},
    
    
    /*
     * callback_radii
     * Function called whent there is an event on the radii topic
     * Takes [ra, rb, rc, rd], updates local copies and animates
     * circles to match
     */
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
    
    /*
     * animate
     * Helper function for animating the circles to new radii
     *   i:  circle number
     *   r:  new radius
     */
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
    
    /*
     * update
     * Helper function that calls animate on all circles
     */
    update: function() {
        this.animate(0, this.options.ra);
        this.animate(1, this.options.rb);
        this.animate(2, this.options.rc);
        this.animate(3, this.options.rd);
    },
    
    /*
     * _create
     * Function that is called on creation of the widget
     * Attatches an sgv element to the container div and draws
     * cross section diagram instide using sgv circle objects.
     * Also sets up subscriber and begins a starting animation.
     */
    _create: function() {
        
        //Check size of widget.
        if(this.options.width < 1) {
            this.options.width = this.default_width;
        }
        
        //Create svg element
        this.svg = d3.select(this.element.get(0)).append("svg")
            .attr("height",  this.options.width)
            .attr("width",   this.options.width);
            
        this.element.css({"text-align": 'center'});
        
        //Add an svg group element.  We will use a transform to center the circles.
        this.g = this.svg.append("g")
            .attr("transform", "translate(" + this.svg.attr("width")/2 + "," + this.svg.attr("height")/2 + ")");
        
        //Create a scale for the circles.
        this.scale = d3.scaleLinear()
            .domain([0, this.options.rmax])
            .range([0, this.svg.attr("width")/2-1]);
        
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
    
    /*
     * _destroy
     * Function that is called on removal of the widget
     * Unsubscribes the widget and empties the containing div.
     */
    _destroy: function() {
        //Unsubscribe
        $.unsubscribe(this.options.channel + this.options.topic_radii, this.callback_radii);
        
        //Remove widget, but leave original div.
        $(this.element).empty();
    }
    
});
