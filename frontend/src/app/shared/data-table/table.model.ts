export interface TablePage<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

export interface TableQuery {
  page: number;
  size: number;
  search: string;
  sort: string;
  direction: 'asc' | 'desc';
  filters: Record<string, string[]>;
}

export const INITIAL_TABLE_QUERY: TableQuery = {
  page: 0,
  size: 8,
  search: '',
  sort: '',
  direction: 'asc',
  filters: {},
};
