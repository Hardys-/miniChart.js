# miniChart (in processing)
miniChart is a simple JavaScript library with 3 different types of charts (bar, line, pie).

<ul>
<li><h6>Chart Object(full):</h6></li>
<pre>
/*
miniChart Object = {
  "animation": true / false,
  "canvas": canvas Object,
  "chartType": pie/line/bar,
  "feedback":true,    //interactive when mouse on
  "feedbackStyle":[font,fontColor,fillStyle],
  "title": ["title of the chart","title font"],
  "dataLabel": [label_ver,label_hor],
  "lines":[# of hor lines,# of ver lines,hor lines fillStyle,ver lines fillStyle,draw hor line, draw ver line],
  "frameStyle":["line/frame/none", width],
  "frameFillStyle":  "rgba(0,0,0,0.8)",
  "markNumbers":true/false,
  "max":true/false,   //mark the maximum value
  "min":true/false,   //mark the minimum value
  "tagFillStyle":"rgba(19,127,150,0.85)",
  "labels":[label1..label10], //mark label of each value, respectively
  "labelsFont":"15px Calibri",
  "labelStyle":"rgba(170,170,170,0.8)",
	"data":[
		{ "title": titleOne,
		  "font":[size,family,weight,style],
			"color": "rgba(0,0,0,0.8)",
			"values":[1,2,3,4,5,6,7,8,9,0];
		},
		{ "title": titleTwo,
		  "font":[size,family,weight,style],
			"color": "rgba(0,0,0,0.8)",
			"values":[1,2,3,4,5,6,7,8,9,0],
		},
		{ "title": titleThree,
		  "font":[size,family,weight,style],
			"color": "rgba(0,0,0,0.8)",
			"values":[1,2,3,4,5,6,7,8,9,0],
		}
	]
}
*/
</pre>

<li><h6>How to use:</h6></li>
Simple 3 steps to launch the chart via miniChart.js:<br/>
<b>Step 1. declare your canvas & chart object</b>
<pre>
	var ctx = document.getElementById("canvas");
	var dataSet = {
		"chartType": "bar",
		"data": [
		{
			"values": [500, 12, 35],
		},
		{
			"values": [120, 220, 45],
		},
		{
			"values": [60, 270, 50],
		},
		{
			"values": [120, 30, 60]
		}
		]
	};
</pre>

<b>Step 2. Use a instance of miniChart & set the canvas and dataSet</b>
<pre>
	var barChart = new miniChart(ctx, dataSet);
</pre>

<b>Step 3. Launch the chart!</b>
<pre>
	barChart.go();
</pre>
<img src="https://haohu.000webhostapp.com/miniChart/miniChart.JPG" alt = "bar chart sample" width="560px" height="320"/>

<li><h6>Examples:</h6></li>
https://haohu.000webhostapp.com/cdn/miniChart/miniChart.html
</ul>
<h6>Bar Chart:</h6>

<h6>Line Chart:</h6>

<h6>Pie Chart:</h6>
