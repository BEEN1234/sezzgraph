import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpReqService } from '../http-req.service';
import {   
  trigger,
  state,
  style,
  animate,
  transition, 
  query,
  stagger} from '@angular/animations';
import { priceArray } from '../stockData';

@Component({
  host: {
    '(@fadeIn.done)': 'captureDoneEvent($event)'
  },
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.css'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        query("h1", [
          style({opacity: 0}),
          stagger(300, [
            animate('1s ease-in', style({opacity: 1}))
          ])
        ])
      ])
    ])
  ]
})
export class GraphComponent implements OnInit {
  h1AnimationsDone: boolean[] = [false, false, false];
  symbols;
  userSymbol = "null";
  plotlyData: PlottableData[];
  xy;
  interpolateMe;

  constructor(private httpReq: HttpReqService) { }

  ngOnInit() {
    this.httpReq.getSymbols().subscribe(data => {
      this.symbols = data;
    })
    let dateArray = this.getDateArray();
    this.plot([{x: dateArray, y: priceArray, name: "AAPL"}], {});
  }

  plot(xy: any[], layout){
    let myDiv = document.getElementById('graphOutput');
    //@ts-ignore
    layout.title = "Price on Open";
    layout.xaxis = {title: "Date"};
    layout.yaxis = {title: "Price"};
    xy[0].connectgaps = true;
    let fig = {
      data: xy, 
      layout: layout
    }
    //@ts-ignore
    window.Plotly.newPlot(myDiv, fig);//can't get dark theme working => https://medium.com/plotly/introducing-plotly-py-theming-b644109ac9c7 not sure to be honest

  }

  getDateArray(){
    let today = new Date();
    let mssPerDay = 24*60*60*1000;
    let mssPerYear = mssPerDay * 365;
    let dateArray = [];
    var dateToAdd = today.getTime() - mssPerYear;
    function getFormattedDate(date){
      let month = date.getMonth() + 1;
      if (month < 10){
        month = "0" + month;
      }
      let day = date.getDate();
      if (day < 10){
        day = "0" + day;
      }
      return date.getFullYear() + '-' + month + '-' + day;
    }
    while(dateToAdd < today.getTime()){
      let thisDate = new Date(dateToAdd);
      dateArray.push(getFormattedDate(thisDate));
      dateToAdd += mssPerDay;
    }
    return dateArray;
  }

  symbolSelected(selectEl){
    let _priceArray = [];
    let dateArray = this.getDateArray();

    this.httpReq.getGraphData(selectEl.value).subscribe((data: any)=>{
      _priceArray = dateArray.map((dateString) => {
        if(data.history[dateString] !== undefined){
          return data.history[dateString].open;
        }
      });
      this.xy = {
        x: dateArray,
        y: _priceArray,
        name: data.name
      }
  
      this.plotlyData = [this.xy];
      this.plot(this.plotlyData, {});
    });
  }
}

interface PlottableData{
  x: number[],
  y: number[],
  name?: string
}
