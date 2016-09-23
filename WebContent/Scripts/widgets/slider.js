
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
		'min': [0.001, 0.009],
		'17%': [0.01, 0.09],
		'33%': [0.1, 0.9],	
		'50%': [1, 9],
		'67%': [10, 90],	
		'83%': [100, 900],	
		'max': [1000]
	};

	$("#dose_slider").noUiSlider({
		start: 0.001,
		range: doseRange		
	});

	$("#dose_slider").noUiSlider_pips({
		mode: 'range',
		density: 28,
		stepped: true,
	    format : wNumb({
			edit: function(a){
				//gets rid of the unwanted decimal places 
				return parseFloat(a);
			},    	
	        decimals : 4
	    })	
	});

	$('#severity_slider').Link('lower').to($('#severity_value'));
	$('#dose_slider').Link('lower').to($('#dose_value'));

});