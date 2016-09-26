
$.widget( "mwww.spinner2", {
    
    options: {
        channel:    "mwww/",
        topic:      "default_topic",
        
        initval: 2.75,
        min:    1.75,
        max:    4.4,
        step:   0.05,
        pi:     false
    },
    
    $label: {},
    $input: {},
    
    
    
    _create: function() {
        
        var self = this;
        var options = this.options;
        
        
        this.$input = $("<input type = 'text'/>", {
            id: this.element.attr('id') + "_input",
            maxlength: '5'
        });
        
        this.$label = $("<label/>", {
            id: this.element.attr('id') + "_label",
            text: this.options.topic + " "
        });
        
        $(this.element).append(this.$label).append(this.$input);
        
        //this.$input.spinner();
        
        
        $.widget( "ui.spinner", $.ui.spinner, {
            _format: function(value) { return value; },
            //remove the pi when parsing values
            _parse: function(value) { return parseFloat(value.toString().split('\u03C0')[0]); }
        });
        
        //create spinner with the required values
        function newSpinner(spinnerid, initval, minval, maxval, stepval, pi) {
            var options = {
                min: minval,
                max: maxval,
                step: stepval,
                change: function(event, ui) {
                    //ensures that the min and max are being adhered to
                    //also ensures that pi is added as a suffix
                    checkInput(this, initval, pi);
                    //alert("event");
                    $.publish((self.options.channel+self.options.topic), [$(this).spinner("value")]);
                }
            };
            //$("#" + spinnerid).spinner(options).spinner("value", initval);
            $(spinnerid).spinner(options).spinner("value", initval);
        }
        
        function checkInput(sp, initval, pi) {
            var value = $(sp).spinner("value");
            var min = $(sp).spinner("option", "min");
            var max = $(sp).spinner("option", "max");
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
        
        
        //newSpinner(this.$input, 2.75, 1.75, 4.4, 0.05, false);
        newSpinner(this.$input, options.initval, options.min, options.max, options.step, options.pi);
        
        //alert("HERE");
    
    },
    
    _destroy: function() {
        $(this.element).empty();
        $(this.element).remove();
    }
    
    
});

/*

 $(function() {
 	//override spinner
	$.widget( "ui.spinner", $.ui.spinner, {
	    _format: function(value) { return value; },
	    //remove the pi when parsing values
	    _parse: function(value) { return parseFloat(value.toString().split('\u03C0')[0]); }
	});
	
	//create spinner with the required values
	function newSpinner(spinnerid, initval, minval, maxval, stepval, pi) {
		var options = { 
			min: minval, 
			max: maxval,
			step: stepval,	
		    change: function(event, ui) {
		    	//ensures that the min and max are being adhered to
		    	//also ensures that pi is added as a suffix
		    	checkInput(this, initval, pi);
		    }
		};				 
		$("#" + spinnerid).spinner(options).spinner("value", initval);
	}

	function checkInput(sp, initval, pi) {
        var value = $(sp).spinner("value");
        var min = $(sp).spinner("option", "min");
        var max = $(sp).spinner("option", "max");
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

    newSpinner("A_input", 2.75, 1.75, 4.4, 0.05, false);
    newSpinner("B_input", 1.5,  0.5,  4,   0.05, true);
    newSpinner("C_input", 2.5,  1,    6,   0.1,  true);
    newSpinner("D_input", 0.32, 0.05, 2,   0.01, true);
    newSpinner("X_input", 20,   15,   30,  0.5,  false);
    newSpinner("Y_input", 0,    0,    1,   0.01, false);
    newSpinner("Z_input", 0,    0,    5,   0.05, false);

	

});

*/

