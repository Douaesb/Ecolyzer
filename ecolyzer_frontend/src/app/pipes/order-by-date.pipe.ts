import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'orderByDate',
  standalone: true
})
export class OrderByDatePipe implements PipeTransform {
  transform<T>(array: T[], dateKey: keyof T, order: 'asc' | 'desc' = 'desc'): T[] {
    if (!array || array.length === 0) return [];

    return [...array].sort((a, b) => {
      const timeA = new Date(a[dateKey] as any).getTime();
      const timeB = new Date(b[dateKey] as any).getTime();
      return order === 'desc' ? timeB - timeA : timeA - timeB;
    });
  }
}
