/**
 * Created by Harrison Marley & Damon Van Der Linde
 */

google.charts.load('current', {'packages':['corechart']});
google.charts.setOnLoadCallback(drawChart);

drawChart();

function drawChart() {
	//for now the hardcoded x,y values for ASM% shortening graph
	//currently the line is permanent, now need to add dynamic indicator
	var data = google.visualization.arrayToDataTable([
		['Methacholine', 'ASM shortening %'],
		['0.001'  ,   0.02],
		['0.003'  ,   0.07],
		['0.01'   ,   0.2],
		['0.03'   ,   0.6 ],
		['0.1'    ,   1.8],
		['0.3'    ,   4.8],
		['1'      ,   10],
		['3'      ,   15.2 ],
		['10'     ,   18.2 ],
		['30'     ,   19.4],
		['100'    ,   19.8],
		['300'    ,   19.93],
		['1000'   ,   19.98],

	]);

	//Graph styling and legend
	var options = {
		title: 'ASM Shortening(%)',
		curveType: 'function',
		legend: { position: 'bottom' },
		vAxis: { title: 'ASM shortening'},
		hAxis: { title: '[ Methacholine dose ] microM'}
	};


	var chart = new google.visualization.LineChart(document.getElementById('lineGraph'));

	chart.draw(data, options);
}