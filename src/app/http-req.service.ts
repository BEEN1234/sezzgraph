import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HttpReqService {
  symbolsUrl = 'https://api.iextrading.com/1.0/ref-data/symbols';
  // GET https://api.worldtradingdata.com/api/v1/history?symbol=AAPL&sort=newest&api_token=oiq0Lect0zMaDeyqAe4fX3CnWALuBojly1QzUxnJCPS8r93GX3HHNEWgKosu
  constructor(private http: HttpClient) { }
  
  getSymbols(){ //Documentation ref - https://iextrading.com/developer/docs/#symbols
    return this.http.get(this.symbolsUrl);
  }

  getGraphData(symbol: string){ //Documentation -> https://www.worldtradingdata.com/documentation#full-history
    let url = 'https://api.worldtradingdata.com/api/v1/history?symbol=' + symbol + '&sort=newest&api_token=oiq0Lect0zMaDeyqAe4fX3CnWALuBojly1QzUxnJCPS8r93GX3HHNEWgKosu';
    return this.http.get(url);
  }
}
