/*!
 * miniChart.js
 * Version: 1.0
 *
 * Copyright 2015 Hao Hu
 * Released under the MIT license
 * https://github.com/Hardys-/miniChart
 */

/*
miniChart Object = {
	"animattion": true / false,
  "canvas": canvas Object,
  "chartType": pie/line/bar,
  "feedback":true,    //interactive when mouse on
	"title": ["title of the chart","title font"],
  "lines":[15,15,"rgba(163,212,214,0.6)","rgba(70,70,70,0.2)"],
  "frameStyle":["line  / frame", width],
  "frameFillStyle":  "rgba(0,0,0,0.8)",
	"max":true/false,   //mark the maximum value
	"min":true/false,   //mark the minimum value

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

(function(window) {
    var methods = {},
				object,
        canvas,
        topic,
        init,
        chart;

		//set method
		methods.setObject = function(_object) {
        // Set the property & value
				object = _object;
        canvas = _object.canvas;
        chart = _object.canvas.getContext("2d");
        return this;
    };

    // draw the chart
    methods.go = function(){
				drawFrame(object.lines,object.title,object.frameStyle,object.frameFillStyle);
		}

    // Init method setting the topic and returning the methods.
    init = function(_topic) {
        topic = _topic;
        return methods;
    };

    // Exposure when being used in an AMD environment, e.g. RequireJS
    if (typeof define === 'function' && define.amd) {
        define(function() {
            return init;
        });
        return;
    }

    // Exposure when being used with NodeJS
    if ('undefined' !== typeof module && module.exports) {
        module.exports = init;
        return;
    }

    // Last-in-the-line exposure to the window, if it exists
    window.miniChart = init;


    /*begin of a set of functions*/
    function drawFrame(lineStyle,title,frame,fillStyle){ //hor: # of hor lines; ver: # of ver lines.
      /*Relative value for diff resolution*/
    	len = Math.ceil(canvas.width * 0.92);
    	hei = Math.ceil(canvas.height * 0.92);
      space = Math.ceil(canvas.width * 0.02);
      hor = (typeof lineStyle === "undefined")? 0 : lineStyle[0];
      ver = (typeof lineStyle === "undefined")? 0 : lineStyle[1];
    	/*Draw frame*/
      chart.fillStyle = (typeof fillStyle !== "undefined")? fillStyle:"rgba(19,127,150,0.8)";
      chart.fillRect(space, space, len, hei);
      chart.fill();
      if (frame[0] == "frame"){
      	chart.clearRect(space+frame[1],space+frame[1],len-frame[1]*2,hei-frame[1]*2);
      }else{
        chart.clearRect(space+frame[1],space,len,hei-frame[1]);
      }

    	/*Draw Ver line*/
    	chart.strokeStyle = (typeof lineStyle === "undefined")? "rgba(163,212,214,0.6)":lineStyle[3];
    	chart.lineWidth=2;
    	chart.beginPath();
    	for(i = 1; i < ver; i++){
    		chart.moveTo(i*len/ver+space-1,space+frame[1]);
    		chart.lineTo(i*len/ver+space-1,space-frame[1]+hei);
    	}
    	chart.stroke();

    	/*Draw Hor line*/
    	chart.strokeStyle = (typeof lineStyle === "undefined")? "rgba(70,70,70,0.2)":lineStyle[2];
    	chart.lineWidth = 1;
    	chart.beginPath();
    	for(i = 1; i < hor; i++){
    		chart.moveTo(space+frame[1],i*(hei)/hor + space - 1);
    		chart.lineTo(space-frame[1]+len,i*(hei)/hor + space -1);
    	}
    	chart.stroke();

      //char title
      if(typeof object.title != "undefined"){
        var titleX = Math.ceil(len/2)-object.title[0].length*5;
        chart.fillStyle = (typeof fillStyle !== "undefined")? fillStyle:"rgba(19,127,150,0.8)";
        chart.font=object.title[1];
        chart.fillText(object.title[0],titleX,35);
        chart.fill;
      }
    }

    /*end of function set*/

// This line either passes the `window` as an argument or
// an empty Object-literal if `window` is not defined.
}(('undefined' !== typeof window) ? window : {}));


/*
function drawFrame(temp,time,tempHigh){

}
/*Draw the text   *//*
function drawText(temp,tempHigh,tempLow){
	var canvas = document.getElementById("myCanvas");
	var chart = canvas.getContext("2d");
	hei = Math.ceil($("#myCanvas").height() * 0.8);
  /*Refresh*//*
  chart.fillStyle="#ffffff";
  chart.fillRect(0, 0, 42, 50 + hei);
  chart.fill();
	chart.beginPath();
	chart.font = "10px Calibri";
	chart.fillStyle ="#373838";
	chart.fillText("Celsius: C",15,20);
	for(i = 0; i <= temp  ; i++){
		var txt = (tempHigh-i*((tempHigh-tempLow)/ temp)).toFixed(2);
		chart.fillText(txt,15,i*hei/temp+48);
	}
}
/*drawTag draw a tag, at Xth grid, temp with a label of text*//*
function drawTag(X,curTemp,text){
	var canvas = document.getElementById("myCanvas");
	var chart = canvas.getContext("2d");
  var len = Math.ceil($("#myCanvas").width() * 0.9);
  var hei = Math.ceil($("#myCanvas").height() * 0.8);
  var x = Math.ceil((X-0.5)*len/time+46 + 15) ; //x is the time line position
  var y = (tempHigh - curTemp)*(hei/(tempHigh-tempLow))+44 - 18; //y1 is the temp1 line position
	/*Draw the point*//*
  chart.strokeStyle = "rgba(70,70,70,0.15)";
  chart.beginPath();
  chart.moveTo(x-15,y+18);
  chart.lineTo(x,y);
  chart.stroke();
	chart.fillStyle = "#137f96";
	chart.beginPath();
	chart.arc(x, y, 2, 0, 2 * Math.PI);
	chart.fill();
	/*Draw the tag*//*
	chart.beginPath();
	chart.moveTo(x+4,y-4);
	chart.lineTo(x+10,y-8);
	chart.lineTo(x+10,y+8);
	chart.lineTo(x+4, y+4);
	chart.closePath();
	chart.fill();
  chart.fillStyle = "rgba(19,127,150,0.85)";
	chart.beginPath();
  chart.fillRect(x+10, y-8, 35, 16);
  chart.fill();
	//Draw the text
	chart.beginPath();
	chart.font = "8px Calibri";
	chart.fillStyle ="#ffffff";
	chart.fillText(text,x+12,y+2);
}
/*drawTag draw a label, at position(x,y) with a label of id*//*
function drawLabel(X,temp2,text,rgba){
	var canvas = document.getElementById("myCanvas");
	var chart = canvas.getContext("2d");
  var len = Math.ceil($("#myCanvas").width() * 0.9);
  var y = (tempHigh - temp2)*(hei/(tempHigh-tempLow))+52; //y is the temp position
  var x = Math.ceil((X-0.5)*len/time+46) ; //x is the time line position
  /*Draw the arrow*//*
	chart.fillStyle = rgba;
	chart.beginPath();
	chart.moveTo(x-3,y+3);
	chart.lineTo(x,y-3);
	chart.lineTo(x+3,y+3);
  chart.closePath();
  chart.fill();
  //Draw the text
  chart.fillStyle ="rgba(0,0,0,0.6)";
	chart.beginPath();
	chart.font = "nomal 12px Arial";
	chart.fillText(text,x+6,y+3);
  chart.closePath();
  chart.fill();
}
/*drawLine(temp1,temp2,rgb) temp1,temp2: points; rgb: rgb color, X:point2 time line *//*
function drawLine(temp1,temp2,X,rgb,w,type){
	var canvas = document.getElementById("myCanvas");
	var chart = canvas.getContext("2d");
	len = Math.ceil($("#myCanvas").width() * 0.9);
	hei = Math.ceil($("#myCanvas").height() * 0.8);
	if (temp1 == -274 && temp2 != -274){
		var x1 = Math.ceil((X-1.5)*len/time+46) ; //x1 is the time line position
		var y1 = (tempHigh - temp1)*(hei/(tempHigh-tempLow))+44; //y1 is the temp1 line position
		chart.fillStyle = rgb;
		/*Draw point1*//*
		chart.beginPath();
    chart.lineWidth = w;
		chart.arc(x1, y1, 3, 0, 2 * Math.PI);
		chart.fill();
	}
	else{
		var x1 = Math.ceil((X-1.5)*len/time+46) ; //x1 is the time line position
		var x2 = Math.ceil((X-0.5)*len/time+46) ; //x2 is the time line position
		var y1 = (tempHigh - temp1)*(hei/(tempHigh-tempLow))+44; //y1 is the temp1 line position
		var y2 = (tempHigh - temp2)*(hei/(tempHigh-tempLow))+44; //y2 is the temp1 line position
    /*Draw Line*//*
    chart.strokeStyle = rgb;
    chart.lineWidth = w;
    chart.beginPath();
    chart.moveTo(x1+1,y1);
    chart.lineTo(x2-1,y2);
    chart.closePath();
    chart.stroke();
    if(type == 1){ //regular line
  		/*Draw point1*//*
      chart.fillStyle = rgb;
      chart.lineWidth = w;
  		chart.beginPath();
  		chart.arc(x1, y1, 3, 0, 2 * Math.PI);
      chart.closePath();
  		chart.fill();
  		/*Draw point2*//*
      chart.lineWidth = w;
  		chart.beginPath();
  		chart.arc(x2, y2, 3, 0, 2 * Math.PI);
      chart.closePath();
  		chart.fill();
    };
	}
}
function drawAveLine(msg,ave){
  for (i = 0; i< msg.length; i++){
    for( j =0; j< msg[i].temp.length; j++){
      if(ave[j][0] > -274){
        ave[j][0] += msg[i].temp[j];
        ave[j][1] +=1;
      }else{
        ave[j]=[msg[i].temp[j],1];
      }
    }
  };
  for(i = ave.length - time; i < ave.length-1; i++){ //draw ave line
    drawLine((ave[i][0]/ave[i][1]).toFixed(2),(ave[i+1][0]/ave[i+1][1]).toFixed(2),i+2-(20-time),"rgba(204,0,0,0.5)",2,2);
    //insertAverage((ave[i][0]/ave[i][1]).toFixed(2));//insert to database
  }
  drawLabel(1,(ave[ave.length-time][0]/ave[ave.length-time][1]).toFixed(2),"Average","rgba(204,0,0,0.5)");
}
function drawMouseInfo(){//draw temp & time info on Canvas
  var canvas = document.getElementById('myCanvas');
  var chart = canvas.getContext('2d');
  var len = Math.ceil($("#myCanvas").width() * 0.9);
  var hei = Math.ceil($("#myCanvas").height() * 0.8);
  function getMousePos(canvas, evt) {
        var rect = canvas.getBoundingClientRect();
        return {
          x: evt.clientX - rect.left,
          y: evt.clientY - rect.top
        };
      };
  function writeMessage(canvas, message) {
    var chart = canvas.getContext('2d');
        chart.clearRect(len-45, 5, 180, 32);
        chart.font = '12px Calibri';
        chart.fillStyle = "rgba(19,127,150,0.6)";
        chart.fillText(message, len-45, 32);
      };
  function searchPrint(X,tempValue,mousePos){// given the position of mouse and searchthedata
    $("#mouseInfoTag").css({"display":"none"});
    for( i = 0; i < Gmsg.length; i++){
      if(Math.abs(Gmsg[i].temp[X-1+(20-time)] - tempValue) * Math.ceil(hei/(tempHigh-tempLow)) < 2 ) {
        var tempComp = " + 0.00";
        var tempClass = "tempClass1";
        var diff = Gmsg[i].temp[X-1+(20-time)] - ave[X-1+(20-time)][0]/ave[X-1+(20-time)][1];
        var d = new Date(Gmsg[i].startTime);
        var curTime = d.getHours()+":"+d.getMinutes()+":"+d.getSeconds();
        if(diff > 0){tempComp = " +"+ diff.toFixed(2)+"&#8593";}
        else{tempComp = " "+ diff.toFixed(2)+"&#8595"; tempClass = "tempClass2"}
        var mouseInfo = "<p class = \"infoId\">ID: "+Gmsg[i].id +"</p><p>Temp.: "+Gmsg[i].temp[X-1+(20-time)]+
                        "*C </p><p>Start at: "+ curTime +"</p><p class = \""+tempClass+"\">Ave. "+ tempComp +"</p>"
        $("#mouseInfoTag").html(mouseInfo);
        var rect = canvas.getBoundingClientRect();
        var x = mousePos.x + rect.left - 35;
        var y = mousePos.y + rect.top + 10; //10 pixer offset
        $("#mouseInfoTag").css({"left":x,"top":y,"display":"block"});
        chart.fillStyle= "#ffffff"//.replace("0.8", "0.3"); lighter color
        chart.beginPath();
        chart.arc(Math.ceil((X-1+0.5)*len/time+46),(tempHigh - Gmsg[i].temp[X-1+(20-time)])*(hei/(tempHigh-tempLow))+44,7,0,2*Math.PI);
        chart.fill();
        chart.fillStyle= Gmsg[i].rgba//.replace("0.8", "0.3"); lighter color
        chart.beginPath();
        chart.arc(Math.ceil((X-1+0.5)*len/time+46),(tempHigh - Gmsg[i].temp[X-1+(20-time)])*(hei/(tempHigh-tempLow))+44,5,0,2*Math.PI);
        chart.fill();
        chart.fillStyle= "#ffffff"//.replace("0.8", "0.3"); lighter color
        chart.beginPath();
        chart.arc(Math.ceil((X-1+0.5)*len/time+46),(tempHigh - Gmsg[i].temp[X-1+(20-time)])*(hei/(tempHigh-tempLow))+44,3,0,2*Math.PI);
        chart.fill();
      }
    }
  };
  canvas.addEventListener('mousemove', function(evt) {
        var mousePos = getMousePos(canvas, evt);
        var m1 = "";//message 1: Time
        var m2 = (tempHigh-(mousePos.y- 44)/(hei/(tempHigh-tempLow))).toFixed(2);//message 1: Temp
        //y1 = (tempHigh - temp1)*(hei/(tempHigh-tempLow))+44
        var message =  'Temperature: ' + m2;
        writeMessage(canvas, message);
        searchPrint(Math.ceil((mousePos.x - 46)/(len/time)),m2,mousePos);
      }, false);
};
/*end of canvas library*/
