$( document ).ready(function() {

  // Detect if current device is Mobile
 	function detectMobile() {
    if ( navigator.userAgent.match(/Android/i)
         || navigator.userAgent.match(/webOS/i)
         || navigator.userAgent.match(/iPhone/i)
         || navigator.userAgent.match(/iPod/i)
         || navigator.userAgent.match(/BlackBerry/i)
         || navigator.userAgent.match(/Windows Phone/i)
    ) {
      return true;
    } else {
      return false;
    }
	}

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
	chartTwo.go();
	chartThree.go();

	if (detectMobile()) {
		$('.section').css({
			'padding': '15%'
		});
		$('.textarea_container').css({
			'width': '100%'
		});
		$('.textarea').css({
			'fint-size': '20px'
		});
	}

  var slowParse;
	$("#bar_chart").keyup(function() {
		clearTimeout(slowParse);
		slowParse = setTimeout(function() {
			const barChartData = JSON.parse($("#bar_chart").val());
			chartOne.updateDataSet(barChartData);
		}, 500);
	});

	$("#bar_chart2").keyup(function() {
		clearTimeout(slowParse);
		slowParse = setTimeout(function() {
			const barChartData2 = JSON.parse($("#bar_chart2").val());
			chartTwo.updateDataSet(barChartData2);
		}, 500);
	});

	$("#bar_chart3").keyup(function() {
		clearTimeout(slowParse);
		slowParse = setTimeout(function() {
			const barChartData3 = JSON.parse($("#bar_chart3").val());
			chartThree.updateDataSet(barChartData3);
		}, 500);
	});
});


/*Copyright Hao Hu, MIT LICENSE*/
