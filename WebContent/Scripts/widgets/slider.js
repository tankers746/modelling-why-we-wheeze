
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