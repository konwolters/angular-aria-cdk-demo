import { httpResource, HttpParams } from '@angular/common/http';
import { Injectable, linkedSignal, ResourceStatus, Signal } from '@angular/core';
import { TablePage, TableQuery } from './table.model';

const EMPTY_TABLE_PAGE: TablePage<never> = {
  content: [],
  totalElements: 0,
  totalPages: 0,
  number: 0,
  size: 8,
};

@Injectable({ providedIn: 'root' })
export class ServerTableService {
  search<T>(endpoint: string, query: Signal<TableQuery>) {
    const resource = httpResource<TablePage<T>>(
      () => ({
        url: endpoint,
        params: this.toHttpParams(query()),
      }),
      { defaultValue: EMPTY_TABLE_PAGE as TablePage<T> },
    );

    const value = linkedSignal<ResourceStatus, TablePage<T>>({
      source: resource.status,
      computation: (status, previous) => {
        if (status === 'resolved' || status === 'local') return resource.value();
        return previous?.value ?? (EMPTY_TABLE_PAGE as TablePage<T>);
      },
    });

    return {
      value: value.asReadonly(),
      isLoading: resource.isLoading,
      error: resource.error,
    };
  }

  private toHttpParams(query: TableQuery): HttpParams {
    let params = new HttpParams()
      .set('page', query.page)
      .set('size', query.size)
      .set('search', query.search)
      .set('sort', query.sort)
      .set('direction', query.direction);

    for (const [filterName, selectedValues] of Object.entries(query.filters)) {
      for (const selectedValue of selectedValues) {
        params = params.append(filterName, selectedValue);
      }
    }

    return params;
  }
}
