import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  DataInsiderSentiment,
  SymbolLookupResult,
} from 'src/app/models/search-stock.model';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-detail-stock',
  templateUrl: './detail-stock.component.html',
  styleUrls: ['./detail-stock.component.css'],
})
export class DetailStockComponent implements OnInit {
  sentiment: { insider: DataInsiderSentiment[]; stock: SymbolLookupResult } = {
    insider: [],
    stock: null,
  };

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private titleService: Title
  ) {}

  ngOnInit(): void {
    this.sentiment = {
      stock: this.route.snapshot?.data.stock.stock,
      insider: this.route.snapshot?.data.stock.insider,
    };
    this.titleService.setTitle('Detail: ' + this.sentiment.stock.symbol);
  }

  goToList(): void {
    this.router.navigate(['']);
  }

  sentimentInsider(): DataInsiderSentiment[] {
    return this.sentiment?.insider;
  }
}
