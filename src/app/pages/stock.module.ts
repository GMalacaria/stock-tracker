import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { SearchStockService } from '../services/search-stock.service';
import { CommonModule } from '@angular/common';
import { DetailStockComponent } from './detail-stock/detail-stock.component';
import { StockResolver } from '../services/detail-stock.resolver';
import { MonthPipe } from '../pipe/month.pipe';
import { SearchStockComponent } from './search-stock/search-stock.component';
import { ListStockComponent } from './list-stocks/list-stocks.component';

const routes: Routes = [
  {
    path: '',
    data: { title: 'Stocks' },
    component: SearchStockComponent,
  },
  {
    path: 'sentiment/:symbol',
    data: { title: 'Detail' },
    resolve: { stock: StockResolver },
    component: DetailStockComponent,
  },
  {
    path: '**',
    redirectTo: '',
  },
];

@NgModule({
  declarations: [
    DetailStockComponent,
    ListStockComponent,
    SearchStockComponent,
    MonthPipe,
  ],
  imports: [
    FormsModule,
    RouterModule.forChild(routes),
    HttpClientModule,
    CommonModule,
    RouterModule,
  ],
  providers: [SearchStockService, StockResolver],
  exports: [ListStockComponent],
})
export class StockModule {}
