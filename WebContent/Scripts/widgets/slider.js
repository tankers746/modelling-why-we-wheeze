
  $(function() {
	var slider1Range = {
		'min': [0],	
		'max': [6]
	};

	$("#slider1").noUiSlider({
		range: slider1Range,
		start: 0,
		step : 1
	})

	$("#slider1").noUiSlider_pips({
		mode: 'count',
		values: 2,
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

	var slider2Range = {
		'min': [0.001, 0.009],
		'17%': [0.01, 0.09],
		'33%': [0.1, 0.9],	
		'50%': [1, 9],
		'67%': [10, 90],	
		'83%': [100, 900],	
		'max': [1000]
	};

	$("#slider2").noUiSlider({
		range: slider2Range,
		start: 0.001,
	})

	$("#slider2").noUiSlider_pips({
		mode: 'count',
		values: 7,
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
});