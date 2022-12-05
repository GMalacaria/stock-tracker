import { formatDate } from '@angular/common';
import { Pipe } from '@angular/core';

@Pipe({
  name: 'dateByMonth',
})
export class MonthPipe {
  transform(month): string {
    return formatDate(
      `${new Date().getFullYear()}-${month.toString()}-01 `,
      'yyyy-MM-dd',
      'it-IT'
    );
  }
}
