import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { TablePage, TableQuery } from './table.model';

@Injectable({ providedIn: 'root' })
export class ServerTableService {
  private readonly httpClient = inject(HttpClient);

  search<T>(endpoint: string, query: TableQuery): Observable<TablePage<T>> {
    return this.httpClient.get<TablePage<T>>(endpoint, { params: this.toHttpParams(query) });
  }

  private toHttpParams(query: TableQuery): HttpParams {
    let params = new HttpParams()
      .set('page', query.page)
      .set('size', query.size)
      .set('search', query.search)
      .set('sort', query.sort)
      .set('direction', query.direction);

    for (const [filterName, selectedValues] of Object.entries(query.filters)) {
      // Mehrfachauswahlen werden als wiederholte Query-Parameter desselben Namens übertragen.
      for (const selectedValue of selectedValues) {
        params = params.append(filterName, selectedValue);
      }
    }

    return params;
  }
}
