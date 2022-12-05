import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Stock } from 'src/app/models/search-stock.model';

@Component({
  selector: 'app-list-stocks',
  templateUrl: './list-stocks.component.html',
  styleUrls: ['./list-stock.component.css'],
})
export class ListStockComponent implements OnInit {
  @Input() stocks: Stock[] = [];
  @Output() removeStockStorage: EventEmitter<string> = new EventEmitter();
  @Output() startLoading: EventEmitter<null> = new EventEmitter();

  constructor(private router: Router) {}

  ngOnInit(): void {}

  removeStock(symbol: string): void {
    this.removeStockStorage.emit(symbol);
  }

  goToDetail(symbol: string): void {
    this.startLoading.emit();
    this.router.navigate(['sentiment', symbol]);
  }
}
