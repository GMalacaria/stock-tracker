import { HttpClient } from '@angular/common/http';
import { Quote } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { forkJoin, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  InsiderSentiment,
  Stock,
  SymbolLookup,
  SymbolLookupResult,
} from '../models/search-stock.model';
import { subMonths } from 'date-fns';
import { formatDate } from '@angular/common';

@Injectable()
export class SearchStockService {
  constructor(private httpClient: HttpClient) {}

  baseApi = 'https://finnhub.io/api/v1/';
  urlToken = '&token=bu4f8kn48v6uehqi3cqg';

  getSymbolLookup(q: string): Observable<SymbolLookupResult> {
    return this.httpClient
      .get<SymbolLookup>(`${this.baseApi}search?q=${q + this.urlToken}`)
      .pipe(
        map((data) => {
          return data.result.find((res) => res.symbol === q);
        })
      );
  }

  getQuote(symbol: string): Observable<any> {
    return this.httpClient.get<Quote>(
      `${this.baseApi}quote?symbol=${symbol + this.urlToken}`
    );
  }

  getSymbolQuote(symbol: string): Observable<Stock> {
    return forkJoin([this.getSymbolLookup(symbol), this.getQuote(symbol)]).pipe(
      map(([symbolLookup, quote]) => {
        return { ...symbolLookup, quote };
      })
    );
  }

  getInsiderSentiment(symbol): Observable<InsiderSentiment> {
    const today = formatDate(new Date(), 'yyyy-MM-dd', 'it-IT');
    const old3Month = formatDate(
      subMonths(new Date(), 3),
      'yyyy-MM-dd',
      'it-IT'
    );
    return this.httpClient
      .get<InsiderSentiment>(
        `${
          this.baseApi
        }/stock/insider-sentiment?symbol=${symbol}&from=${old3Month}&to=${
          today + this.urlToken
        }`
      )
      .pipe(
        map((ins) => {
          if (!ins.data.length) {
            ins.data.push({
              change: null,
              mspr: null,
              symbol: null,
              year: null,
              month: subMonths(new Date(), 2).getMonth(),
            });
          }
          let index = 3 - ins.data.length;

          if (index > 0) {
            do {
              ins.data.push({
                change: null,
                mspr: null,
                symbol: null,
                year: null,
                month:
                  ins.data[ins.data.length - 1].month === 12
                    ? 1
                    : ins.data[ins.data.length - 1].month + 1,
              });
            } while (ins.data.length < 3);
          } else if (index < 0) {
            ins.data = ins.data.splice(ins.data.length - 3, ins.data.length);
          }
          return ins;
        })
      );
  }
}
