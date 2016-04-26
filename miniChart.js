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
  "feedbackStyle":[font,fontColor,fillStyle],
  "title": ["title of the chart","title font"],
  "data_label": [label_ver,label_hor],
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

(function(window) {
    var methods = {},
				object,chartObjects,
        canvas,topic,chart,                                                     //canvas properties
        init,imageData,
        MAX,MIN,AVE = [],                                                       //data properties, Ave: array of aves of each set of data
        len,hei,space,
        maxTag, minTag, infoFlag;                                               //chart properties

    //For missing color or default color
    var colorSet=["rgba(254,97,97,0.8)","rgba(56,86,156,0.8)","rgba(29,175,153,0.8)","rgba(76,145,203,0.8)","rgba(76,203,199,0.8)","rgba(88,174,254,0.8)","rgba(252,183,19,0.8)","rgba(183,78,162,0.8)",];
		// Set method
		methods.setObject = function(_object) {
        // Set the property & value
				object = format(_object);
        canvas = _object.canvas;
        chart = _object.canvas.getContext("2d");
        MIN = findMin(object.data);
        MAX = findMax(object.data);
        len = Math.ceil(canvas.width * 0.8);
        hei = Math.ceil(canvas.height * 0.8);
        space = Math.ceil(canvas.width * 0.08);
        imageData = chart.getImageData(0, 0,canvas.width,canvas.height);
        return this;
    };

    // Draw the chart
    methods.go = function(){
				drawFrame(object.lines,object.title,object.frameStyle,object.frameFillStyle);
        if (object.chartType == "bar") {
          barChart(object.data);
          drawLegend(object.data);
        }
        else if (object.chartType == "line") { lineChart(object.data);}
        else if (object.chartType == "pie") { pieChart(object.data);};

        //Draw tags after the chart is fully complete
        if(object.max && maxTag.length != 0) {drawTag(maxTag[0],maxTag[1],maxTag[2]);}
        if(object.min && minTag.length != 0) {drawTag(minTag[0],minTag[1],minTag[2]);}
        //save the current image
        imageData = chart.getImageData(0, 0,canvas.width,canvas.height);
        //If feedback needed, start mouse event listener and initialize infoFlag
        if(object.feedback){drawMouseInfo(); infoFlag = false;}
		};

    methods.clearCanvas = function() {
        // Set the canvas
				chart.clearRect(0,0,canvas.width,canvas.height);
        imageData = chart.getImageData(0, 0,canvas.width,canvas.height);
    };

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

    /*Begin of a set of functions*/
    //Draw the frame of the chart, 3 types: line, frame, none
    function drawFrame(lineStyle,title,frame,fillStyle){ //hor: # of hor lines; ver: # of ver lines.
      /*Relative value for diff resolution*/
      ver = lineStyle[1];
    	/*Draw frame*/
      chart.fillStyle = fillStyle;
      chart.fillRect(space, space, len, hei);
      chart.fill();
      if (frame[0] == "frame"){
      	chart.clearRect(space+frame[1],space+frame[1],len-frame[1]*2,hei-frame[1]*2);
      }else if(frame[0] == "none"){
        chart.clearRect(0,0,canvas.width,canvas.height);
      }else{
        chart.clearRect(space+frame[1],space,len,hei-frame[1]);
      }

    	/*Draw Ver line*/
    	chart.strokeStyle = lineStyle[3];
    	chart.lineWidth=1;
    	chart.beginPath();
    	for(i = 1; i < ver; i++){
    		chart.moveTo(i*len/ver+space-1,space+frame[1]+26);
    		chart.lineTo(i*len/ver+space-1,space-frame[1]+hei);
    	}
    	chart.stroke();

    	/*Draw Hor line & label*/
      var chartTop = findTop(MAX);
      var chartBom = (MIN > 0)? 0: MIN;
      var grids = lineStyle[0];//default value

      chart.font = "10px Calibri";
      chart.fillStyle ="#373838";
      chart.strokeStyle = lineStyle[2];
      chart.lineWidth = 1;
      chart.beginPath();
      for(i = 0; i <= grids  ; i++){
        var txt = (  ((chartTop-chartBom)/ grids + chartBom) % 1 === 0)? i*((chartTop-chartBom)/ grids)+chartBom : (i*((chartTop-chartBom)/ grids)+chartBom).toFixed(2);
        chart.fillText(txt, 5, hei+space - i*(hei-30)/grids - frame[1] + 2);
        if(lineStyle[4] && i>0){
          chart.moveTo(space+frame[1],Math.round(hei+space - i*(hei-30)/grids - frame[1]));
          chart.lineTo(space-frame[1]+len,Math.round(hei+space - i*(hei-30)/grids - frame[1]));
        }
      }
    	chart.stroke();

      //char title
      var fp = (isNaN(parseInt(object.title[1])))?6:Math.round(parseInt(object.title[1]) *0.3);//default font size is 20px
      var titleX = Math.round(canvas.width/2)-object.title[0].length*fp;
      chart.fillStyle = fillStyle;
      chart.font=object.title[1];
      chart.fillText(object.title[0],titleX,space+22);
      chart.fill;
    }

    function drawLegend(data){
      //Default font size is "15px Calibri",
      var txtLen = space + data[0].title.length * 9 + object.frameStyle[1]; //0.6 of the font size typically is pixel number
      var posX = canvas.width - txtLen, //10 offset from right edge
      posY = space + 15;

      //Clear rect
      chart.clearRect(posX-18,posY-12,txtLen+15,(data.length)*15+5);
      for(i = 0 ; i < data.length; i++){
          //Draw color square
          chart.font = "15px Calibri";
          chart.fillStyle = data[i].color;
          chart.fillRect(posX-15,posY+i*15+3,12,-12);
          chart.fill();
          //Darw txt
          var legendTxt = (data[i].title.length*9 > txtLen+18)? data[i].title.substring(0,Math.round(txtLen/9))+"..":data[i].title;
          chart.fillStyle = object.frameFillStyle;
          chart.fillText(legendTxt,posX,posY+i*15+3);
          chart.fill();
      }

    }

    //Draw the interactive feedback when mouse on an object
    function drawMouseInfo(){//draw feedback info on Canvas

      function getMousePos(canvas, evt) { //return the mouse pos on canvas
          var rect = canvas.getBoundingClientRect();
          return {
            x: evt.clientX - rect.left,
            y: evt.clientY - rect.top
          };
      };

      canvas.addEventListener('mousemove', function(evt) {
          var mousePos = getMousePos(canvas, evt);
          searchPrint(mousePos.x,mousePos.y);
      }, false);

      function searchPrint(posX,posY){// given the position of mouse and search the data
        if(object.chartType == "bar"){
          var edge = Math.round(chartObjects[0].pos[2]*0.2);  //for calculate the overlapped bar
          for( i = 0; i < chartObjects.length; i++){
            var x1 = chartObjects[i].pos[0];
            var x2 = chartObjects[i].pos[2]; //len
            var y1 = chartObjects[i].pos[1];
            var y2 = chartObjects[i].pos[3]; //hei

            //found the target object
            if( ((posX < x2+x1-edge && posX > x1+edge) && (posY < y2+y1 && posY > y1)) ||
            ((posX < x2+x1-edge && posX > x1+edge) && (posY > y2+y1 && posY < y1) && y2<0) ){
              chart.fillStyle= colorChange(chartObjects[i].fillStyle);
              chart.beginPath();
              chart.fillRect(x1-2,y1-2,x2+4,y2+4);
              chart.clearRect(x1,y1,x2,y2);
              chart.fill();
              chart.fillStyle= chartObjects[i].fillStyle;
              chart.fillRect(x1,y1,x2,y2);
              chart.fill();

              //Draw info tag if it is not exist
              if (!infoFlag){
                drawInfoTag(posX,posY,chartObjects[i]);
                infoFlag = true;
              }
              break;
            }else if(i == chartObjects.length-1){
              //Restore chart
              chart.putImageData(imageData, 0, 0);
              //Remove info tag
              infoFlag = false;
            }
          }
        }else if(object.chartType == "line"){

        }else if(object.chartType == "pie"){

        }

      }

    }

    //Draw the tags for max && min value
    function drawTag(posX,posY,tagValue){
      posX +=15;
      posY -=18;

      /*Draw the point*/
      chart.strokeStyle = object.frameFillStyle;
      chart.beginPath();
      chart.moveTo(posX-15,posY+18);
      chart.lineTo(posX,posY);
      chart.stroke();
      chart.fillStyle = colorChange(object.tagFillStyle);
      chart.beginPath();
      chart.arc(posX, posY, 2, 0, 2 * Math.PI);
      chart.fill();

      /*Draw the tag*/
      chart.beginPath();
      chart.moveTo(posX+4,posY-4);
      chart.lineTo(posX+10,posY-8);
      chart.lineTo(posX+10,posY+8);
      chart.lineTo(posX+4, posY+4);
      chart.closePath();
      chart.fill();
      chart.fillStyle = object.tagFillStyle;
      chart.beginPath();
      chart.fillRect(posX+10, posY-8, Math.round(tagValue.toString().length*8+5), 16);
      chart.fill();
      /*Draw the text*/
      chart.beginPath();
      chart.font = "8px Calibri";
      chart.fillStyle ="#ffffff";
      chart.fillText(tagValue,posX+12,posY+3);
    }

    //Draw info tag
    function drawInfoTag(posX,posY,Obj){
      var fontSize = parseInt(object.feedbackStyle[0]);
      //Max value for tag width, margin left 10px, margin right 10px;
      var tagWidth = 20 + Math.max(Math.round(fontSize*0.6*Obj.name.toString().length),Math.round(fontSize*0.6*Obj.value.toString().length),Math.round(fontSize*0.6*(AVE[parseInt(Obj.setNumber)].toString().length+5)));
      //3 lines of info(name, value, ave),Margin top 15px, margin bottom 15 px
      var tagHeight = 40 + Math.round(fontSize*0.8*4);
      //Default offset 20px to the left
      var tagX = (posX+20+tagWidth > canvas.width)?posX-20-tagWidth:posX+20;
      var tagY = (posY+10+tagHeight > canvas.height)?posY-10-tagHeight:posY+10;;
      //Draw background
      chart.fillStyle = object.feedbackStyle[2];
      chart.fillRect(tagX,tagY,tagWidth,tagHeight);
      chart.fill();
      //Draw name
      chart.font = object.feedbackStyle[0];
      chart.fillStyle = object.feedbackStyle[1];  //font color
      chart.fillText(Obj.name,tagX+10,tagY+20);   //margin-left 10px
      chart.fill();
      //Draw Ave info*/
      chart.fillText("Ave.: "+AVE[parseInt(Obj.setNumber)],tagX+10,tagY + 23 + Math.round(fontSize*0.8));     //margin-left 10px
      chart.fill();
      chart.save();
      //Draw color square
      chart.fillStyle = Obj.fillStyle;
      chart.fillRect(tagX+10,tagY + 26 + Math.round(fontSize*0.8*2),Math.round(fontSize*0.6),-1*Math.round(fontSize*0.6));
      chart.fill();
      chart.restore();
      //Fill value text
      chart.fillText(Obj.value,tagX+10+Math.round(fontSize*0.6)+3,tagY + 26 + Math.round(fontSize*0.8*2));   //margin-left 10px
      chart.fill();
      //Compare to the ave value, set the color
      var diff = (AVE[parseInt(Obj.setNumber)] - Obj.value).toFixed(2);
      chart.fillStyle = (diff < 0)?"rgba(254,97,97,0.8)":"rgba(88,174,254,0.8)";
      var extString = (diff < 0)?"++":"--";
      if(diff == 0) extString ="==";
      chart.fillText(Math.abs(diff)+extString,tagX+10,tagY + 32 + Math.round(fontSize*0.8*3));
      chart.fill();

    }

    //Draw bar chart
    function barChart(data){
      var barLen = (data[0].values !== "undifined")? Math.ceil(len / (data[0].values.length* data.length*1.5)):0; // 0.5 for
      var barMove = Math.ceil(barLen * data.length *0.8 *1.5 + barLen*0.2);

      var chartBase = Math.ceil(canvas.width * 0.08)+Math.ceil(canvas.height * 0.8)-object.frameStyle[1];
      var chartBom = (MIN > 0)? 0: MIN;
      var scale = (hei - 30)/(findTop(MAX) - chartBom );
      var barY = (MIN > 0)? chartBase : chartBase + Math.round(MIN*scale); //start Y pos
      var chartX = Math.ceil(canvas.width * 0.08)+object.frameStyle[1]; //start X pos

      /*draw bars*/
      chartObjects = []; //initialization
      for(i = 0; i < data.length ; i ++){
          for(j = 0; j < data[i].values.length; j++){
            var barHei = Math.round(scale*data[i].values[j]);                   //set the height for the bar
            var barX = Math.round(chartX+barLen*0.9+j*barMove+i*barLen*0.8);
            if(data[i].values[j] == MAX ){maxTag=[Math.round(barX+barLen/2),barY-barHei,MAX];}
            if(data[i].values[j] == MIN ){minTag=[Math.round(barX+barLen/2),barY-barHei,MIN];}
            chart.fillStyle = data[i].color;                                     //set the color for current bar
            chart.fillRect(barX,barY-barHei,barLen,barHei);
            chart.fillStyle = object.labelStyle;
            if( object.markNumbers == true){
                chart.fillText(data[i].values[j],barX,barY-barHei-5);//5 pixels offset
            }
            chart.fill;
            var obj = {"pos":[barX,barY-barHei,barLen,barHei],"name":data[i].title,"value":data[i].values[j],"fillStyle": data[i].color,"setNumber":i};
            chartObjects.push(obj);
          };
      };

      /*offset*/
      if(MIN < 0){
        chart.font = "10px Calibri";
      	chart.fillStyle ="#373838";
        chart.clearRect(0,barY-12,Math.ceil(canvas.width * 0.08),12);
        chart.fillText("0.00", 5, barY+2);
        chart.fill();
        chart.strokeStyle = (typeof object.frameFillStyle !== "undefined")? object.frameFillStyle:"rgba(19,127,150,0.8)";
        chart.lineWidth = 1;
        chart.beginPath();
        chart.moveTo(chartX, barY);
        chart.lineTo(chartX+len - 20 , barY);
        chart.stroke();
      }

      /*draw labels*/
      var labelX = 0;
      var fp = (isNaN(parseInt(object.labelsFont)))?12:Math.round(parseInt(object.labelsFont) *0.6); //font pixel, 0.6 is the scale of convert px to pixel
      var num = Math.round(barMove/fp); //how many chars can be put in the place,
      chart.font = object.labelsFont;
      chart.fillStyle = object.labelStyle;
      for(index in object.labels){
          var txtLen = object.labels[index].length;
          var txtMove = (barMove - barLen*0.8 > txtLen * fp)?Math.ceil((barMove - txtLen * fp - barLen*0.9) / 2): 0;
          var txt = (txtLen > num)? object.labels[index].substring(0,num-1)+"..":object.labels[index];
          chart.fillText(txt, txtMove + labelX + chartX + Math.ceil(barLen*0.9) ,space+hei+18);
          labelX += barMove;
      }
      chart.fill;
    }

    //Format input object, complete missing values.
    function format(obj){
      var rslt = { //default values
        "animattion": true,
        "chartType": "bar",
        "feedback":true,    //interactive when mouseOn an object
        "feedbackStyle":["15px Calibri","rgba(255,255,255,1)","rgba(110,110,110,0.8)"],
        "title":["","20 Calibri"],
        "lines":[4,0,"rgba(71,71,71,0.2)","rgba(70,70,70,0.2)",false,false],
        "frameStyle":["line", 2],
        "frameFillStyle":  "rgba(171,171,171,0.8)",
        "markNumbers":false,
        "max":true,   //mark the maximum value
        "min":true,   //mark the minimum value
        "tagFillStyle":"rgba(101,101,101,0.85)",
        "labels":[],  //mark label of each bar, respectively
        "labelsFont":"15px Calibri",
        "labelStyle":"rgba(64,64,64,0.8)",
        "data":[]
      };

      if(typeof obj.animation !== "undefined") rslt.animation = obj.animation;
      if(typeof obj.chartType !== "undefined") rslt.chartType = obj.chartType;
      if(typeof obj.feedback !== "undefined") rslt.feedback = obj.feedback;
      if(typeof obj.feedbackStyle !== "undefined") rslt.feedbackStyle = obj.feedbackStyle;
      if(typeof obj.title !== "undefined") rslt.title = obj.title;
      if(typeof obj.lines !== "undefined") rslt.lines = obj.lines;
      if(typeof obj.frameStyle !== "undefined") rslt.frameStyle = obj.frameStyle;
      if(typeof obj.frameFillStyle !== "undefined") rslt.frameFillStyle = obj.frameFillStyle;
      if(typeof obj.markNumbers !== "undefined") rslt.markNumbers = obj.markNumbers;
      if(typeof obj.max !== "undefined") rslt.max = obj.max;
      if(typeof obj.min !== "undefined") rslt.min = obj.min;
      if(typeof obj.tagFillStyle !== "undefined") rslt.tagFillStyle = obj.tagFillStyle;

      if(typeof obj.labels !== "undefined") {
        rslt.labels = obj.labels;
      }else{
        var labelsArray = [];
        if(typeof obj.data[0].values !=='undefined'){                                  //check if the values exists
          for(i = 0 ; i < obj.data[0].values.length; i++){
            labelsArray.push("data "+(i+1));
          }
        }
        rslt.labels = labelsArray;
      }

      if(typeof obj.labelsFont !== "undefined") rslt.labelsFont = obj.labelsFont;
      if(typeof obj.labelStyle !== "undefined") rslt.labelStyle = obj.labelStyle;

      //Format the data property
      //Pass exist value to rslt
      if(typeof obj.data !== "undefined") rslt.data = obj.data;
      //DataSetTemp used to foramt missing values in current rslt.data
      var dataSetTemp = [];
      for(i = 0 ; i < rslt.data.length; i++){
        //Data template
        var dataItem = {
          "title": "category ",
          "font":[20,"Calibri","bold","italic"],
          "color": pickColor(),//pick up a color in default color set
          "values":[]
        };
        if(typeof rslt.data[i].title !== "undefined") {
          dataItem.title = rslt.data[i].title;
        }else{
          dataItem.title += (i+1);
        };
        if(typeof rslt.data[i].font !== "undefined") dataItem.font = rslt.data[i].font;
        if(typeof rslt.data[i].color !== "undefined") dataItem.color = rslt.data[i].color;
        if(typeof rslt.data[i].values !== "undefined") dataItem.values = rslt.data[i].values;
        dataSetTemp.push(dataItem);
      }
      rslt.data = dataSetTemp;

      return rslt;
    }

    //Draw line chart
    function lineChart(data){}

    //Draw pie chart
    function pieChart(data){}

    //find max values
    function findMax(list){
        var ori = list[0].values[0];
        for(i = 0 ; i < list.length; i++){
            var sum = 0, count = 0;
            for( j = 0; j < list[i].values.length; j++){
              count++;
              sum += list[i].values[j];
              if(list[i].values[j] > ori) ori = list[i].values[j];
            }
            // ave for set of values
            AVE.push((sum/count).toFixed(2));
        }

        return ori;
    }

    //find min value
    function findMin(list){
      var ori = list[0].values[0];
      for(i = 0 ; i < list.length; i++){
          for( j = 0; j < list[i].values.length; j++){
            if(list[i].values[j] < ori) ori = list[i].values[j];
          }
      }
      return ori;
    }

    //Find the upper bound of a value: 184 -> 200, 34 -> 40
    function findTop(input){
    	var result = 1;
      var hi = input;
      while(hi > 1){
      	hi /= 10;
        result *= 10;
      }
      var scale = result/10;
      return Math.floor(input / scale + 1 ) * scale;
    }

    //Change to a related dark color
    function colorChange(rgba){
      var r, g, b;
      var rgbaValue = rgba.substring(5, rgba.length - 1).split(",");
      r = rgbaValue[0];
      g = (rgbaValue[1]> 15)? rgbaValue[1] - 15 : 0;
      b = (rgbaValue[2]> 15)? rgbaValue[2] - 15 : 0;
      return "rgba("+r+","+g+","+b+",0.9)";
    }

    function pickColor(){
      var temp = colorSet[0];
      colorSet.splice(0,1);
      colorSet.push(temp);
      return temp;
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
