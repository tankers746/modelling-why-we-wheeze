
$.widget( "mwww.spinner2", $.ui.spinner, {
    
    options: {
        channel:    "mwww/",
        topic:      "default_topic",
        
        initval: 2.75,
        min:    1.75,
        max:    4.4,
        step:   0.05,
        pi:     false
    },
    
	 _format: function(value) { 
		return value; 
	 },
	 
	_parse: function(value) { 
		//remove the pi when parsing values
		return parseFloat(value.toString().split('\u03C0')[0]); 
		},  
	
    _create: function() {
        
        var self = this;
        var options = this.options;
		
        this.$label = $("<label/>", {
            id: this.element.attr('id') + "_label",
            text: this.options.topic + " "
        });
		
        $(this.element).wrap("<p></p>").before(this.$label);       
       
        function checkInput(sp, initval, pi) {
            var value = $(sp).spinner2("value");
            var min = $(sp).spinner2("option", "min");
            var max = $(sp).spinner2("option", "max");
            //check if value is numerical
            if (isNaN(parseFloat(value)) || !isFinite(value)){
                value = initval;
            } else {
                if(value > max) {
                    value = max;
                } else if(value < min) {
                    value = min;
                }
            }
            //set value
            if(pi) {
                value = value + '\u03C0';
            }
            sp.value = value;		
        }     	
        //create the spinner by calling super (this calls the create method of the class that we are extending - spinner)
		this._super();
		this._setOption("min", options.min);
		this._setOption("max", options.max);
		this._setOption("step", options.step);
		this._setOption("change", function(event, ui) {
							//ensures that the min and max are being adhered to
							//also ensures that pi is added as a suffix
							checkInput(this, options.initval, options.pi);
							$.publish((self.options.channel+self.options.topic), [$(this).spinner2("value")]);
						});
		//set to default value
		$(this.element).spinner2("value", options.initval); 
    },
    
    _destroy: function() {
        this.$label.remove();
		this._super();
		$(this.element).unwrap();
    }   
    
});


