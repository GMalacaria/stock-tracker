import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { forkJoin, Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import {
  DataInsiderSentiment,
  SymbolLookupResult,
} from 'src/app/models/search-stock.model';
import { SearchStockService } from './search-stock.service';

@Injectable()
export class StockResolver
  implements
    Resolve<{ insider: DataInsiderSentiment[]; stock: SymbolLookupResult }>
{
  constructor(private service: SearchStockService, private router: Router) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<{
    insider: DataInsiderSentiment[];
    stock: SymbolLookupResult;
  }> {
    const symbol = route.paramMap.get('symbol');
    return forkJoin([
      this.service.getInsiderSentiment(symbol),
      this.service.getSymbolLookup(symbol),
    ]).pipe(
      catchError((err) => {
        this.router.navigate(['']);
        console.error(err);

        return throwError(err);
      }),
      map(([insider, stock]) => {
        return {
          insider: insider.data,
          stock,
        };
      })
    );
  }
}
