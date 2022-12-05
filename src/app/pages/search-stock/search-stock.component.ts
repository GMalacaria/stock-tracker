import { ElementRef, ViewChild } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { BehaviorSubject, forkJoin } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { Stock } from 'src/app/models/search-stock.model';
import { SearchStockService } from 'src/app/services/search-stock.service';

@Component({
  selector: 'app-search-stock',
  templateUrl: './search-stock.component.html',
  styleUrls: ['./search-stock.component.css'],
})
export class SearchStockComponent implements OnInit {
  index = 0;
  message: string = '';
  points: string = '';
  @ViewChild('msg') msg: ElementRef;
  disabledSub: BehaviorSubject<boolean> = new BehaviorSubject(true);
  stocks: Stock[] = [];
  constructor(
    private searchStockService: SearchStockService,
    private titleService: Title
  ) {}

  ngOnInit(): void {
    this.titleService.setTitle('List stocks');
    this._getStorageStokes();
  }

  searchStock(form: NgForm): void {
    this.resetMessage();
    let symbol = form.value.stockInput;
    this.disabledSub.next(true);
    this.message = 'Loading';
    this.points = '';
    let intervalPoint = setInterval(() => this.textLoading(), 300);
    if (!this.stocks.find((stock) => stock.symbol === symbol)) {
      this._getSymbolQuote(symbol, intervalPoint, form);
    } else {
      this.disabledSub.next(false);
      this.stopLoading(intervalPoint);
      this.message = 'Stock present in list';
      this.msg.nativeElement.className = 'warning';
      setTimeout(() => {
        this.resetMessage();
      }, 4000);
    }
  }

  private _getSymbolQuote(symbol: string, intervalPoint, form: NgForm): void {
    this.searchStockService
      .getSymbolQuote(symbol)
      .pipe(
        finalize(() => {
          this.disabledSub.next(false);
          this.stopLoading(intervalPoint);
        })
      )
      .subscribe({
        error: (e) => {
          this.message = 'Error';
          this.msg.nativeElement.className = 'error';
          setTimeout(() => {
            this.resetMessage();
          }, 4000);
        },
        next: (stock) => {
          if (stock?.symbol) {
            this._setStorageStoke(stock);
            this.resetMessage();
            form.reset();
          } else {
            this.message = 'No stock found';
            this.msg.nativeElement.className = 'error';
            setTimeout(() => {
              this.resetMessage();
            }, 4000);
          }
        },
      });
  }

  resetMessage(): void {
    this.message = '';
    this.msg.nativeElement.className = null;
  }

  textLoading() {
    this.points = this.points === null ? '.' : this.points;
    if (this.index === 3) {
      this.message = 'Loading';
      this.points = '';
      this.index = 0;
    }
    this.points += '.';
    this.index += 1;
  }

  stopLoading(intervalPoint): void {
    clearInterval(intervalPoint);
  }

  valuechange(value: string): void {
    this.disabledSub.next(value.length < 1);
  }

  removeStock(symbol: string): void {
    this.msg.nativeElement.className = null;
    this.stocks = this.stocks.filter((s) => s.symbol !== symbol);
    localStorage.setItem(
      'stockSymbol',
      this.stocks.map((s) => s.symbol).toString()
    );
    this.msg.nativeElement.className = 'success';
    this.message = 'Stock successfully removed';
    setTimeout(() => {
      this.resetMessage();
    }, 3000);
  }

  startLoading(): void {
    this.resetMessage();
    this.message = 'Loading';
    setInterval(() => this.textLoading(), 300);
  }

  private _setStorageStoke(stock: Stock): void {
    this.stocks.push(stock);
    localStorage.setItem(
      'stockSymbol',
      this.stocks.map((s) => s.symbol).toString()
    );
  }

  private _getStorageStokes(): void {
    if (localStorage.getItem('stockSymbol')) {
      this.disabledSub.next(true);
      this.message = 'Loading';
      let intervalPoint = setInterval(() => this.textLoading(), 300);
      let arrayObs$ = localStorage
        .getItem('stockSymbol')
        .split(',')
        .map((s) => this.searchStockService.getSymbolQuote(s));
      forkJoin(arrayObs$).subscribe((stocks) => {
        clearInterval(intervalPoint);
        this.resetMessage();
        this.stocks = stocks;
      });
    }
  }
}
