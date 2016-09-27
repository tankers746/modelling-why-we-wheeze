/**
 * Created by Harrison Marley & Damon Van Der Linde
 */

google.charts.load('current', {'packages':['corechart']});
google.charts.setOnLoadCallback(drawChart);

var data, whichGraph = 0;

drawChart();

//Used to Increase; Just here for the buttons
function drawChartValIncrease()
{
	if(whichGraph < 7)
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
	
	switch(whichGraph)
	{
		//Asthma Severity set to low
		case 0:
			data = google.visualization.arrayToDataTable([
					['Methacholine', 'Asthama Low notch'],
					['0.001'  ,   0.0952907298849194],
					['0.003'  ,   0.0956743473802559],
					['0.01'   ,   0.0969110156037994],
					['0.03'   ,   0.100651777991371],
					['0.1'    ,   0.113161256405465],
					['0.3'    ,   0.155744539910472],
					['1'      ,   0.306721967678933],
					['3'      ,   0.7997281473386],
					['10'     ,   1.82491598170631],
					['30'     ,   2.84497040885657],
					['100'    ,   3.37625037094151],
					['300'    ,   3.58057877197642],
					['1000'   ,   3.66403747904073],
					['3000'	  ,   3.69478501662878]
				]);
			break;
		
		//Asthma Severity set to low + 1 position		
		case 1:
			data = google.visualization.arrayToDataTable([
					['Methacholine', 'Asthma 1st notch'],
					['0.001'  ,   0.100304421050209],
					['0.003'  ,   0.100718741692004],
					['0.01'   ,   0.1020548286],
					['0.03'   ,   0.1061003836],
					['0.1'    ,   0.1196723667],
					['0.3'    ,   0.1663358994],
					['1'      ,   0.3366002474],
					['3'      ,   0.9313066552],
					['10'     ,   2.307905035],
					['30'     ,   3.831557736],
					['100'    ,   4.68040325],
					['300'    ,   5.016585589],
					['1000'   ,   5.155435269],
					['3000'	  ,   5.206813236]
				]);
			break;
		
		//Asthma Severity set to low + 2 position		
		case 2:
			data = google.visualization.arrayToDataTable([
					['Methacholine', 'Asthma 2nd notch'],
					['0.001'  ,   0.105724469],
					['0.003'  ,   0.1061728586],
					['0.01'   ,   0.107619313],
					['0.03'   ,   0.1120036939],
					['0.1'    ,   0.1267620384],
					['0.3'    ,   0.1780455657],
					['1'      ,   0.3710667884],
					['3'      ,   1.098245239],
					['10'     ,   3.011464489],
					['30'     ,   5.436809392],
					['100'    ,   6.916823119],
					['300'    ,   7.527791736],
					['1000'   ,   7.784214521],
					['3000'	  ,   7.879701249]
				]);
			break;		
		
		//Asthma Severity set to middle position		
		case 3:
			data = google.visualization.arrayToDataTable([
					['Methacholine', 'Asthma middle notch'],
					['0.001'  ,   0.1179705975],
					['0.003'  ,   0.1184992019],
					['0.01'   ,   0.1202057072],
					['0.03'   ,   0.125390251],
					['0.1'    ,   0.1429707145],
					['0.3'    ,   0.2055033512],
					['1'      ,   0.4580063922],
					['3'      ,   1.601399059],
					['10'     ,   5.884074254],
					['30'     ,   14.25368243],
					['100'    ,   21.3878485],
					['300'    ,   24.88199301],
					['1000'   ,   26.45554855],
					['3000'	  ,   27.05848235]
				]);
			break;
		
		//Asthma Severity set to middle position + 1			
		case 4:
			data = google.visualization.arrayToDataTable([
					['Methacholine', 'Asthma 4th notch'],
					['0.001'  ,   0.390881326],
					['0.003'  ,   0.39407827],
					['0.01'   ,   0.4045200775],
					['0.03'   ,   0.437404892],
					['0.1'    ,   0.5630345447],
					['0.3'    ,   1.251407649],
					['1'      ,   36.45425418],
					['3'      ,   36.45425418],
					['10'     ,   36.45425418],
					['30'     ,   36.45425418],
					['100'    ,   36.45425418],
					['300'    ,   36.45425418],
					['1000'   ,   36.45425418],
					['3000'	  ,   36.45425418]
				]);
			break;
		
		//Asthma Severity set to middle position + 2		
		case 5:
			data = google.visualization.arrayToDataTable([
					['Methacholine', 'Asthma 5th notch'],
					['0.001'  ,   1.645869061],
					['0.003'  ,   1.673670437],
					['0.01'   ,   1.767016804],
					['0.03'   ,   2.088141303],
					['0.1'    ,   3.804284095],
					['0.3'    ,   182.9907273],
					['1'      ,   182.9907273],
					['3'      ,   182.9907273],
					['10'     ,   182.9907273],
					['30'     ,   182.9907273],
					['100'    ,   182.9907273],
					['300'    ,   182.9907273],
					['1000'   ,   182.9907273],
					['3000'	  ,   182.9907273]
				]);
			break;
		
		//Asthma Severity set to severe
		case 6:
			data = google.visualization.arrayToDataTable([
					['Methacholine', 'Asthma severe notch'],
					['0.001'  ,   7.32536338323271],
					['0.003'  ,   7.59011512419069],
					['0.01'   ,   8.53564450070074],
					['0.03'   ,   12.57283609],
					['0.1'    ,   94.81062258],
					['0.3'    ,   94.81062258],
					['1'      ,   94.81062258],
					['3'      ,   94.81062258],
					['10'     ,   94.81062258],
					['30'     ,   94.81062258],
					['100'    ,   94.81062258],
					['300'    ,   94.81062258],
					['1000'   ,   94.81062258],
					['3000'	  ,   94.81062258]
				]);
			break;
	}
	

	var options = {
		title: 'Airway Resistance',
		//curveType: 'function',
		legend: { position: 'none' },
		
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

	var chart = new google.visualization.LineChart(document.getElementById('lineGraph2'));

	chart.draw(data, options);
}