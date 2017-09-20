$( document ).ready(function() {

	var barChartCanvas = document.getElementById("bar_chart_canvas");
	var barChartCanvas2 = document.getElementById("bar_chart_canvas2");
  var barChartCanvas3 = document.getElementById("bar_chart_canvas3");

	const barChartData = JSON.parse($("#bar_chart").val());
	const barChartData2 = JSON.parse($("#bar_chart2").val());
	const barChartData3 = JSON.parse($("#bar_chart3").val());

	let chartOne = new miniChart(barChartCanvas, barChartData);
	let chartTwo = new miniChart(barChartCanvas2, barChartData2);
	let chartThree = new miniChart(barChartCanvas3, barChartData3);

	chartOne.go();
	//chartTwo.go();
	//chartThree.go();

  var slowParse;
	$("#bar_chart").keyup(function() {
		clearTimeout(slowParse);
		slowParse = setTimeout(function() {
			const barChartData = JSON.parse($("#bar_chart").val());
			const barChart = new miniChart(barChartCanvas, barChartData);
			barChart.go();
		}, 500);
	});

	$("#bar_chart2").keyup(function() {
		clearTimeout(slowParse);
		slowParse = setTimeout(function() {
			const barChartData2 = JSON.parse($("#bar_chart2").val());
			const barChart2 = new miniChart(barChartCanvas2, barChartData2);
			barChart2.go();
		}, 500);
	});

	$("#bar_chart3").keyup(function() {
		clearTimeout(slowParse);
		slowParse = setTimeout(function() {
			const barChartData3 = JSON.parse($("#bar_chart3").val());
			const barChart3 = new miniChart(barChartCanvas3, barChartData3);
			barChart3.go();
		}, 500);
	});
});


/*Copyright Hao Hu, MIT LICENSE*/
