
$.widget('mwww.discrete_slider', {
    options: {
        channel:    "default/",
        topic:      "S",
    },
    
    $slider:    {},
    
    _create:    function() {
        
        var self = this;
        var options = this.options;
        var container = this.element;
        
        this.$slider = $("<div/>", {
            id:     this.element.attr('id') + "_slider",
            class:  "slider"
        });
        
        this.$slider.noUiSlider({
            start: 0,
            step : 1,
            range: {
                'min': [0],
                'max': [6]
            }
        });
        
        this.$slider.noUiSlider_pips({
            mode: 'range',
            density: 16,
            stepped: true,
            format : wNumb({
                edit: function(a){
                    if(a==0) {
                        return "No asthma"
                    } else {
                        return "Severe asthma"
                    }
                },
            })
        });
        
        
        this._on(this.$slider, {
            slide: function(e, severity) {
                $.publish(options.channel + options.topic, [parseInt(severity)]);
            }
            //change: function(e, severity) {
                //alert(parseInt(severity));
            //}
        });
        
        $(this.element).append(this.$slider);
    
    },
    
    _destroy:   function() {
        $(this.element).empty();
        $(this.element).remove();
    }
});



$.widget('mwww.continuous_slider', {
    options: {
        channel:    "default/",
        topic:      "logd",
    },
    
    $slider:    {},
    
    doseRange: {
        'min': [0.001],
        '16.67%': [0.01],
        '33.33%': [0.1],
        '50;00%': [1],
        '66.67%': [10],
        '83.33%': [100],
        'max': [1000]
    },
    
    _create:    function() {
        
        var self = this;
        var options = this.options;
        var container = this.element;
        
        this.$slider = $("<div/>", {
            id:     this.element.attr('id') + "_slider",
            class:  "slider"
        });
        
        this.$slider.noUiSlider({
            start: -9,
            range: {
                'min': [-9],
                'max': [-3]
            }
        });
        
        this.$slider.noUiSlider_pips({
            mode: 'count',
            density: 16,
            values: 7,
            format : wNumb({
                edit: function(a){
                    return Math.pow(10, parseInt(a)+6);
                },
                decimals : 5
            })
        });
        
        this._on(this.$slider, {
            slide: function(e, logd) {
                $.publish(options.channel + options.topic, [logd]);
            }
        });
        
        $(this.element).append(this.$slider);
        
    },
    
    _destroy:   function() {
        $(this.element).empty();
        $(this.element).remove();
    }
});

/*
  $(function() {
	$("#severity_slider").noUiSlider({
		start: 0,
		step : 1,
		range: {
			'min': [0],	
			'max': [6]
		}		
	});

	$("#severity_slider").noUiSlider_pips({
		mode: 'range',
		density: 16,
		stepped: true,	
	    format : wNumb({
			edit: function(a){
				if(a==0) {
					return "No asthma"
				} else {
					return "Severe asthma"
				}
			},    	
	    })			
	});	

	var doseRange = {
		'min': [0.001],
		'16.67%': [0.01],
		'33.33%': [0.1],	
		'50;00%': [1],
		'66.67%': [10],	
		'83.33%': [100],	
		'max': [1000]
	};

	$("#dose_slider").noUiSlider({
		start: 0.001,
		range: doseRange		
	});

	$("#dose_slider").noUiSlider_pips({
		mode: 'range',
		density: 16,
	    format : wNumb({
			edit: function(a){
				//gets rid of the unwanted decimal places 
				return parseFloat(a);
			},    	
	        decimals : 5
	    })	
	});

	$('#severity_slider').Link('lower').to($('#severity_value'), null, wNumb({    	
        decimals : 0
	}));
	$('#dose_slider').Link('lower').to($('#dose_value'), null, wNumb({
		edit: function(a){
			//gets rid of the unwanted decimal places 
			return parseFloat(a);
		},    	
        decimals : 3
	}));

});

*/
