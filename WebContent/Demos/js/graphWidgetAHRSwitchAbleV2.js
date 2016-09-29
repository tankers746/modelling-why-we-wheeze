/**
 * Created by Harrison Marley & Damon Van Der Linde
 */

google.charts.load('current', {'packages':['corechart']});
google.charts.setOnLoadCallback(drawChart);

var options, whichGraph = 0;

drawChart();

//Used to Increase; Just here for the buttons
function drawChartValIncrease()
{
	if(whichGraph < 6)
	{
		whichGraph++;
		google.charts.load('current', {'packages':['corechart']});
		google.charts.setOnLoadCallback(drawChart);
		drawChart();
	}
}

//Used to decrease; Just here for the buttons
function drawChartValDecrease()
{
	if(whichGraph > 0)	
	{
		whichGraph--;
		google.charts.load('current', {'packages':['corechart']});
		google.charts.setOnLoadCallback(drawChart);
		drawChart();
	}
}

//will prob using a function similar to this when subscribing 
//to the output values of the severity slider
function drawChartValSet(val)
{
	whichGraph = val;
	google.charts.load('current', {'packages':['corechart']});
	google.charts.setOnLoadCallback(drawChart);
	drawChart();
}


function drawChart() {
	
	var data = google.visualization.arrayToDataTable([
			['Methacholine', 'Asthama Low notch','Asthma first notch' , 'Asthama second notch' , 'Asthama middle notch' , 'Asthama forth notch ' , 'Asthama 5th notch', 'Asthama severe notch'],
			['0.001'  ,   0.0952907298849194,0.100304421050209,0.105724469,0.1179705975,0.390881326,1.645869061,7.32536338323271],
			['0.003'  ,   0.0956743473802559,0.100718741692004,0.1061728586,0.1184992019,0.39407827,1.673670437,7.59011512419069],
			['0.01'   ,   0.0969110156037994,0.1020548286,0.107619313,0.1202057072,0.4045200775,1.767016804,8.53564450070074],
			['0.03'   ,   0.100651777991371,0.1061003836,0.1120036939,0.125390251,0.437404892,2.088141303,12],
			['0.1'    ,   0.113161256405465,0.1196723667,0.1267620384,0.1429707145,0.5630345447,3.804284095,12],
			['0.3'    ,   0.155744539910472,0.1663358994,0.1780455657,0.2055033512,1.251407649,182.9907273,12],
			['1'      ,   0.306721967678933,0.3366002474,0.3710667884,0.4580063922,10,,12],
			['3'      ,   0.7997281473386,0.9313066552,1.098245239,1.601399059,,,12],
			['10'     ,   1.82491598170631,2.307905035,3.011464489,5.884074254,,,12],
			['30'     ,   2.84497040885657,3.831557736,5.436809392,14.25368243,,,12],
			['100'    ,   3.37625037094151,4.68040325,6.916823119,21.3878485,,,12],
			['300'    ,   3.58057877197642,5.016585589,7.527791736,24.88199301,,,12],
			['1000'   ,   3.66403747904073,5.155435269,7.784214521,26.45554855,,,12],
			['3000'	  ,   3.69478501662878,5.206813236,7.879701249,27.05848235,,,12],
		]);
	

	loadOptions();

	var chart = new google.visualization.LineChart(document.getElementById('lineGraph3'));

	chart.draw(data, options);
}

function loadOptions()
{
	switch(whichGraph)
	{
		case 0: 
			options = {
					title: 'Airway Resistance',
					//curveType: 'function',
					legend: { position: 'none' },
					colors: ['blue','gray','gray','gray','gray','gray','gray'],
					vAxis: { 
						title: 'Airway Resistance',
						viewWindow: {
							min:0,
							max:10
						},
						ticks: [0, 2, 4, 6, 8, 10]	
					},
					
					hAxis: { 
						title: '[ Methacholine dose ] microM'	
					}
				};
				
			break;
		
		case 1: 
			options = {
					title: 'Airway Resistance',
					//curveType: 'function',
					legend: { position: 'none' },
					colors: ['gray','blue','gray','gray','gray','gray','gray'],
					vAxis: { 
						title: 'Airway Resistance',
						viewWindow: {
							min:0,
							max:10
						},
						ticks: [0, 2, 4, 6, 8, 10]	
					},
					
					hAxis: { 
						title: '[ Methacholine dose ] microM'	
					}
				};
				
			break;

	
		case 2: 
			options = {
					title: 'Airway Resistance',
					//curveType: 'function',
					legend: { position: 'none' },
					colors: ['gray','gray','blue','gray','gray','gray','gray'],
					vAxis: { 
						title: 'Airway Resistance',
						viewWindow: {
							min:0,
							max:10
						},
						ticks: [0, 2, 4, 6, 8, 10]	
					},
					
					hAxis: { 
						title: '[ Methacholine dose ] microM'	
					}
				};
				
			break;
			
		case 3: 
			options = {
					title: 'Airway Resistance',
					//curveType: 'function',
					legend: { position: 'none' },
					colors: ['gray','gray','gray','blue','gray','gray','gray'],
					vAxis: { 
						title: 'Airway Resistance',
						viewWindow: {
							min:0,
							max:10
						},
						ticks: [0, 2, 4, 6, 8, 10]	
					},
					
					hAxis: { 
						title: '[ Methacholine dose ] microM'	
					}
				};
				
			break;	
			
		case 4: 
			options = {
					title: 'Airway Resistance',
					//curveType: 'function',
					legend: { position: 'none' },
					colors: ['gray','gray','gray','gray','blue','gray','gray'],
					vAxis: { 
						title: 'Airway Resistance',
						viewWindow: {
							min:0,
							max:10
						},
						ticks: [0, 2, 4, 6, 8, 10]	
					},
					
					hAxis: { 
						title: '[ Methacholine dose ] microM'	
					}
				};
				
			break;

		case 5: 
			options = {
					title: 'Airway Resistance',
					//curveType: 'function',
					legend: { position: 'none' },
					colors: ['gray','gray','gray','gray','gray','blue','gray'],
					vAxis: { 
						title: 'Airway Resistance',
						viewWindow: {
							min:0,
							max:10
						},
						ticks: [0, 2, 4, 6, 8, 10]	
					},
					
					hAxis: { 
						title: '[ Methacholine dose ] microM'	
					}
				};
				
			break;

		case 6: 
			options = {
					title: 'Airway Resistance',
					//curveType: 'function',
					legend: { position: 'none' },
					colors: ['gray','gray','gray','gray','gray','gray','blue'],
					vAxis: { 
						title: 'Airway Resistance',
						viewWindow: {
							min:0,
							max:10
						},
						ticks: [0, 2, 4, 6, 8, 10]	
					},
					
					hAxis: { 
						title: '[ Methacholine dose ] microM'	
					}
				};
				
			break;
	}
}