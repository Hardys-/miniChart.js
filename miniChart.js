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
'use strict';
//
// var defaults = require('../core/core.defaults');
// var elements = require('../elements/index');
// var minichart = require('minichart');
class miniChart {

  constructor(ctx, dataSet) {
      this.ctx = ctx;
      this.ave = [];
      this.colorSet = [
        "rgba(254,97,97,0.8)",
        "rgba(88,174,254,0.8)",
        "rgba(131,211,91,0.8)",
        "rgba(56,86,156,0.8)",
        "rgba(252,183,19,0.8)",
        "rgba(248,118,48,0.8)",
        "rgba(29,175,193,0.8)",
        "rgba(183,78,162,0.8)",
        "rgba(235,61,61,0.8)",
        "rgba(76,145,253,0.8)",
        "rgba(76,203,199,0.8)",
        "rgba(29,175,153,0.8)",
        "rgba(252,92,175,0.8)",
        "rgba(76,145,203,0.8)"
      ];
      this.chart = ctx.getContext("2d");
      this.dataSet = this.format(dataSet);
      this.min = this.findMin(this.dataSet.data);
      this.max = this.findMax(this.dataSet.data);
      this.len = Math.ceil(ctx.width * 0.8); // *
      this.hei = Math.ceil(ctx.height * 0.8); // *
      this.space = Math.ceil(ctx.width * 0.08);
      this.maxTag = [0, 0];
      this.minTag = [0, 0];
      this.chartObjects = []; //initialization
      this.infoFlag = false;

  }

  go() {
    this.clearCanvas();
    this.drawFrame(this.dataSet.lines, this.dataSet.title, this.dataSet.frameStyle, this.dataSet.frameFillStyle);
    if (this.dataSet.chartType == "bar") {
      this.barChart(this.dataSet.data);
      this.drawLegend(this.dataSet.data);
    }

    //Draw tags after the chart is fully complete
    if(this.dataSet.max && this.maxTag.length != 0) {this.drawTag(this.maxTag[0], this.maxTag[1], this.maxTag[2]);}
    if(this.dataSet.min && this.minTag.length != 0) {this.drawTag(this.minTag[0], this.minTag[1], this.minTag[2]);}
    //save the current image
    this.imageData = this.chart.getImageData(0, 0, this.ctx.width, this.ctx.height);
    //If feedback needed, start mouse event listener and initialize infoFlag
    if(this.dataSet.feedback) {
      this.drawMouseInfo(this.ctx, this.dataSet.chartType, this.chartObjects);
      this.infoFlag = false;
    }
    console.log(this.chartObjects);
  };

  format(obj){
    var rslt = { //default values
      "animattion": true,
      "chartType": "bar",
      "feedback":true,    //interactive when mouseOn an object
      "feedbackStyle":["15px Calibri","rgba(255,255,255,1)","rgba(110,110,110,0.8)"],
      "title":["","20 Calibri"],
      "dataLabel": ["",""],
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
    if(typeof obj.dataLabel !== "undefined") rslt.dataLabel = obj.dataLabel;
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
        for(let i = 0 ; i < obj.data[0].values.length; i++){
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
    for(let i = 0 ; i < rslt.data.length; i++){
      //Data template
      var dataItem = {
        "title": "category ",
        "font":[20,"Calibri","bold","italic"],
        "color": this.pickColor(),//pick up a color in default color set
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

  clearCanvas() {
      // Set the canvas
      this.chart.clearRect(0,0,this.ctx.width, this.ctx.height);
      this.imageData = this.chart.getImageData(0, 0, this.ctx.width, this.ctx.height);
  };

  pickColor() {
    const temp = this.colorSet[0];
    this.colorSet.splice(0,1);
    this.colorSet.push(temp);
    return temp;
  }

  findMax(list) {
      var ori = list[0].values[0];
      for(let i = 0 ; i < list.length; i++){
          var sum = 0, count = 0;
          for(let j = 0; j < list[i].values.length; j++){
            count++;
            sum += list[i].values[j];
            if(list[i].values[j] > ori) ori = list[i].values[j];
          }
          // ave for set of values
          this.ave.push((sum/count).toFixed(2));
      }
      return ori;
  }

  //find min value
  findMin(list) {
    var ori = list[0].values[0];
    for(let i = 0 ; i < list.length; i++){
        for(let j = 0; j < list[i].values.length; j++){
          if(list[i].values[j] < ori) ori = list[i].values[j];
        }
    }
    return ori;
  }

  /*Begin of a set of functions*/
  //Draw the frame of the chart, 3 types: line, frame, none
  drawFrame(lineStyle, title, frame, fillStyle) { //hor: # of hor lines; ver: # of ver lines.
    /*Relative value for diff resolution*/
    let ver = lineStyle[1];
    /*Draw frame*/
    this.chart.fillStyle = fillStyle;
    this.chart.fillRect(this.space, this.space, this.len, this.hei);
    this.chart.fill();
    if (frame[0] == "frame"){
      this.chart.clearRect(this.space+frame[1],this.space+frame[1],this.len-frame[1]*2,this.hei-frame[1]*2);
    }else if(frame[0] == "none"){
      this.chart.clearRect(0, 0, this.ctx.width, this.ctx.height);
    }else{
      this.chart.clearRect(this.space + frame[1], this.space, this.len, this.hei - frame[1]);
    }

    /*Draw Ver line*/
    this.chart.strokeStyle = lineStyle[3];
    this.chart.lineWidth = 1;
    this.chart.beginPath();
    for(let i = 1; i < ver; i++){
      this.chart.moveTo(i * this.len/ver + this.space - 1, this.space + frame[1] + 26);
      this.chart.lineTo(i * this.len/ver + this.space - 1, this.space - frame[1] + this.hei);
    }
    this.chart.stroke();

    /*Draw Hor line & label*/
    var chartTop = this.findTop(this.max);
    var chartBom = (this.min > 0)? 0: this.min;
    var grids = lineStyle[0];//default value

    this.chart.font = "10px Calibri";
    this.chart.fillStyle ="#373838";
    this.chart.strokeStyle = lineStyle[2];
    this.chart.lineWidth = 1;
    this.chart.beginPath();

    for(let i = 0; i <= grids; i++){
      var txt = (  ((chartTop-chartBom)/ grids + chartBom) % 1 === 0)? i*((chartTop-chartBom)/ grids)+chartBom : (i*((chartTop-chartBom)/ grids)+chartBom).toFixed(2);
      this.chart.fillText(txt, this.space-25, this.hei+this.space - i*(this.hei-30)/grids - frame[1] + 2);
      if(lineStyle[4] && i>0){
        this.chart.moveTo(this.space+frame[1],Math.round(this.hei+this.space - i*(this.hei-30)/grids - frame[1]));
        this.chart.lineTo(this.space-frame[1]+this.len,Math.round(this.hei+this.space - i*(this.hei-30)/grids - frame[1]));
      }
    }
    this.chart.stroke();

    // draw chart title
    var fp = (isNaN(parseInt(this.dataSet.title[1])))?6:Math.round(parseInt(this.dataSet.title[1]) *0.3);//default font size is 20px
    var titleX = Math.round(this.ctx.width/2) - this.dataSet.title[0].length * fp;
    this.chart.fillStyle = fillStyle;
    this.chart.font = this.dataSet.title[1];
    this.chart.fillText(this.dataSet.title[0], titleX, this.space+22);
    this.chart.fill;

    // draw vertical label, rotate needed
    this.chart.rotate(270 * Math.PI / 180);
    this.chart.font = "18px Calibri";

    // default font size is "18px Calibri", make sure label is print in the middle
    this.chart.fillText(this.dataSet.dataLabel[0],-1 * Math.floor((this.hei + this.dataSet.dataLabel[0].length * 9 * 1.5) / 2), 15);
    this.chart.fill;
    this.chart.rotate( - 270 * Math.PI / 180);

    // draw horizontal label, rotate needed
    this.chart.font = "18px Calibri";

    // default font size is "18px Calibri" (lenth * 9 pixels), make sure label is print in the middle
    this.chart.fillText(this.dataSet.dataLabel[1], Math.floor((this.len - this.dataSet.dataLabel[1].length * 9) / 2) + this.space, this.hei + this.space + 30);// 30 pixels under the base line
    this.chart.fill;
  }

  drawLegend(data) {
    //Default font size is "15px Calibri",
    var txtLen = this.space + data[0].title.length * 9 + this.dataSet.frameStyle[1]; //0.6 of the font size typically is pixel number
    var posX = this.ctx.width - txtLen, //10 offset from right edge
    posY = this.space + 15;

    //Clear rect
    this.chart.clearRect(posX-18,posY-12,txtLen+15,(data.length)*15+5);
    for(let i = 0 ; i < data.length; i++){
        //Draw color square
        this.chart.font = "15px Calibri";
        this.chart.fillStyle = data[i].color;
        this.chart.fillRect(posX-15,posY+i*15+3,12,-12);
        this.chart.fill();
        //Darw txt
        var legendTxt = (data[i].title.length*9 > txtLen+18)? data[i].title.substring(0,Math.round(txtLen/9))+"..":data[i].title;
        this.chart.fillStyle = this.dataSet.frameFillStyle;
        this.chart.fillText(legendTxt,posX,posY+i*15+3);
        this.chart.fill();
    }
  }

      //Draw bar chart
  barChart(data) {
    var barLen = (data[0].values !== "undifined")? Math.ceil(this.len / (data[0].values.length* data.length*1.5)) : 0; // 0.5
    var barMove = Math.ceil(barLen * data.length *0.8 *1.5 + barLen*0.2);

    var chartBase = Math.ceil(this.ctx.width * 0.08)+Math.ceil(this.ctx.height * 0.8) - this.dataSet.frameStyle[1];
    var chartBom = (this.min > 0)? 0: this.min;
    var scale = (this.hei - 30)/(this.findTop(this.max) - chartBom );
    var barY = (this.min > 0)? chartBase : chartBase + Math.round(this.min*scale); //start Y pos
    var chartX = Math.ceil(this.ctx.width * 0.08) + this.dataSet.frameStyle[1]; //start X pos

    /*draw bars*/
    for(let i = 0; i < data.length ; i ++){
        for(let j = 0; j < data[i].values.length; j++){
          var barHei = Math.round(scale*data[i].values[j]);                   //set the height for the bar
          var barX = Math.round(chartX+barLen*0.9+j*barMove+i*barLen*0.8);

          if(data[i].values[j] == this.max ){this.maxTag=[Math.round(barX+barLen/2),barY-barHei,this.max];}
          if(data[i].values[j] == this.min ){this.minTag=[Math.round(barX+barLen/2),barY-barHei,this.min];}
          this.chart.fillStyle = data[i].color;                                     //set the color for current bar
          this.chart.fillRect(barX,barY-barHei,barLen,barHei);
          this.chart.fillStyle = this.dataSet.labelStyle;
          if( this.dataSet.markNumbers == true){
              this.chart.fillText(data[i].values[j],barX,barY-barHei-5);//5 pixels offset
          }
          this.chart.fill;
          var obj = {
            "pos": [barX,barY-barHei,barLen,barHei],
            "name": data[i].title,
            "value":data[i].values[j],
            "fillStyle": data[i].color,
            "setNumber": i
          };
          this.chartObjects.push(obj);
        };
    };

    /*offset*/
    if(this.min < 0){
      this.chart.font = "10px Calibri";
    	this.chart.fillStyle ="#373838";
      this.chart.clearRect(0,barY-12,Math.ceil(this.ctx.width * 0.08),12);
      this.chart.fillText("0.00", 5, barY+2);
      this.chart.fill();
      this.chart.strokeStyle = (typeof this.dataSet.frameFillStyle !== "undefined") ? this.dataSet.frameFillStyle: "rgba(19,127,150,0.8)";
      this.chart.lineWidth = 1;
      this.chart.beginPath();
      this.chart.moveTo(chartX, barY);
      this.chart.lineTo(chartX+this.len - 20 , barY);
      this.chart.stroke();
    }

    /*draw labels*/
    var labelX = 0;
    var fp = (isNaN(parseInt(this.dataSet.labelsFont)))?12:Math.round(parseInt(this.dataSet.labelsFont) *0.6); //font pixel, 0.6 is the scale of convert px to pixel
    var num = Math.round(barMove/fp); //how many chars can be put in the place,
    this.chart.font = this.dataSet.labelsFont;
    this.chart.fillStyle = this.dataSet.labelStyle;
    for(let index in this.dataSet.labels){
        var txtLen = this.dataSet.labels[index].length;
        var txtMove = (barMove - barLen*0.8 > txtLen * fp)?Math.ceil((barMove - txtLen * fp - barLen*0.9) / 2): 0;
        var txt = (txtLen > num)? this.dataSet.labels[index].substring(0,num-1)+"..": this.dataSet.labels[index];
        this.chart.fillText(txt, txtMove + labelX + chartX + Math.ceil(barLen*0.9) , this.space + this.hei + 13); // 13 pixels under the base line
        labelX += barMove;
    }
    this.chart.fill;
  }

  findTop(input) {
  	var result = 1;
    var hi = input;
    while(hi > 1){
    	hi /= 10;
      result *= 10;
    }
    var scale = result/10;
    return Math.floor(input / scale + 1 ) * scale;
  }

  //Draw the tags  max && min value
  drawTag(posX, posY, tagValue){
    posX += 15;
    posY -= 18;

    /*Draw the point*/
    this.chart.strokeStyle = this.dataSet.frameFillStyle;
    this.chart.beginPath();
    this.chart.moveTo(posX-15,posY+18);
    this.chart.lineTo(posX,posY);
    this.chart.stroke();
    this.chart.fillStyle = this.colorChange(this.dataSet.tagFillStyle);
    this.chart.beginPath();
    this.chart.arc(posX, posY, 2, 0, 2 * Math.PI);
    this.chart.fill();

    /*Draw the tag*/
    this.chart.beginPath();
    this.chart.moveTo(posX+4,posY-4);
    this.chart.lineTo(posX+10,posY-8);
    this.chart.lineTo(posX+10,posY+8);
    this.chart.lineTo(posX+4, posY+4);
    this.chart.closePath();
    this.chart.fill();
    this.chart.fillStyle = this.dataSet.tagFillStyle;
    this.chart.beginPath();
    this.chart.fillRect(posX+10, posY-8, Math.round(tagValue.toString().length*8+5), 16);
    this.chart.fill();

    /*Draw the text*/
    this.chart.beginPath();
    this.chart.font = "8px Calibri";
    this.chart.fillStyle ="#ffffff";
    this.chart.fillText(tagValue,posX+12,posY+3);
  }

  //Change to a related dark color
  colorChange(rgba) {
    var r, g, b;
    var rgbaValue = rgba.substring(5, rgba.length - 1).split(",");
    r = rgbaValue[0];
    g = (rgbaValue[1]> 15)? rgbaValue[1] - 15 : 0;
    b = (rgbaValue[2]> 15)? rgbaValue[2] - 15 : 0;
    return "rgba("+r+","+g+","+b+",0.9)";
  }

  drawMouseInfo(ctx, chartType, chartObjects) {//draw feedback info on Canvas

    function getMousePos(evt) { //return the mouse pos on canvas
        var rect = ctx.getBoundingClientRect();
        return {
          x: evt.clientX - rect.left,
          y: evt.clientY - rect.top
        };
    };

    let self = this;

    this.ctx.addEventListener('mousemove', function(evt) {
        var mousePos = getMousePos(evt);
        searchPrint(mousePos.x, mousePos.y);
    }, false);

    function searchPrint(posX, posY) {// given the position of mouse and search the data
      if(chartType == "bar"){
        var edge = Math.round(self.chartObjects[0].pos[2]*0.2);  //for calculate the overlapped bar
console.log(chartObjects);
        for(let i = 0; i < self.chartObjects.length; i++){
          var x1 = self.chartObjects[i].pos[0];
          var x2 = self.chartObjects[i].pos[2]; //len
          var y1 = self.chartObjects[i].pos[1];
          var y2 = self.chartObjects[i].pos[3]; //hei

          //found the target object
          if( ((posX < x2+x1-edge && posX > x1+edge) && (posY < y2+y1 && posY > y1)) ||
          ((posX < x2+x1-edge && posX > x1+edge) && (posY > y2+y1 && posY < y1) && y2<0) ){
            self.chart.fillStyle = self.colorChange(self.chartObjects[i].fillStyle);
            self.chart.beginPath();
            self.chart.fillRect(x1-2,y1-2,x2+4,y2+4);
            self.chart.clearRect(x1,y1,x2,y2);
            self.chart.fill();
            self.chart.fillStyle= self.chartObjects[i].fillStyle;
            self.chart.fillRect(x1,y1,x2,y2);
            self.chart.fill();
            //Draw info tag if it is not exist
            if (!self.infoFlag){
              self.drawInfoTag(posX, posY, self.chartObjects[i]);
              self.infoFlag = true;
            }
            break;
          }else if(i == self.chartObjects.length-1){
            //Restore chart
            self.chart.putImageData(self.imageData, 0, 0);
            //Remove info tag
            self.infoFlag = false;
          }
        }
      }else if(chartType == "line"){

      }else if(chartType == "pie"){

      }

    }

  }


  //Draw info tag
  drawInfoTag(posX, posY, Obj) {
    var fontSize = parseInt(this.dataSet.feedbackStyle[0]);
    //Max value  tag width, margin left 10px, margin right 10px;
    var tagWidth = 20 + Math.max(Math.round(fontSize*0.6*Obj.name.toString().length),Math.round(fontSize*0.6*Obj.value.toString().length),Math.round(fontSize*0.6*(this.ave[parseInt(Obj.setNumber)].toString().length+5)));
    //3 lines of info(name, value, ave),Margin top 15px, margin bottom 15 px
    var tagHeight = 40 + Math.round(fontSize*0.8*4);
    //Default offset 20px to the left
    var tagX = (posX+20+tagWidth > this.ctx.width)?posX-20-tagWidth:posX+20;
    var tagY = (posY+10+tagHeight > this.ctx.height)?posY-10-tagHeight:posY+10;;
    //Draw background
    this.chart.fillStyle = this.dataSet.feedbackStyle[2];
    this.chart.fillRect(tagX,tagY,tagWidth,tagHeight);
    this.chart.fill();
    //Draw name
    this.chart.font = this.dataSet.feedbackStyle[0];
    this.chart.fillStyle = this.dataSet.feedbackStyle[1];  //font color
    this.chart.fillText(Obj.name,tagX+10,tagY+20);   //margin-left 10px
    this.chart.fill();
    //Draw Ave info*/
    this.chart.fillText("Ave.: " + this.ave[parseInt(Obj.setNumber)],tagX+10,tagY + 23 + Math.round(fontSize*0.8));     //margin-left 10px
    this.chart.fill();
    this.chart.save();
    //Draw color square
    this.chart.fillStyle = Obj.fillStyle;
    this.chart.fillRect(tagX+10,tagY + 26 + Math.round(fontSize*0.8*2),Math.round(fontSize*0.6),-1*Math.round(fontSize*0.6));
    this.chart.fill();
    this.chart.restore();
    //Fill value text
    this.chart.fillText(Obj.value,tagX+10+Math.round(fontSize*0.6)+3,tagY + 26 + Math.round(fontSize*0.8*2));   //margin-left 10px
    this.chart.fill();
    //Compare to the ave value, set the color
    var diff = (this.ave[parseInt(Obj.setNumber)] - Obj.value).toFixed(2);
    this.chart.fillStyle = (diff < 0)?"rgba(254,97,97,0.8)":"rgba(88,174,254,0.8)";
    var extString = (diff < 0)?"++":"--";
    if(diff == 0) extString ="==";
    this.chart.fillText(Math.abs(diff)+extString,tagX+10,tagY + 32 + Math.round(fontSize*0.8*3));
    this.chart.fill();

  }

}
