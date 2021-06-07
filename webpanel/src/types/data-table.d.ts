import { SortingRule, Column } from 'react-table'

export interface FetchDataParams {
  skip: number
  limit: number
  sortBy: SortingRule<Record<string, unknown>>[]
  search: string
}

export interface RefetchFn {
  (): void
}

export interface RowActionFn {
  (data: T): void
}

export interface Paginable<T> {
  data: T[]
  pagination: {
    total_count: number
  }
}

export interface RowAction {
  icon: IconProp
  label: string
  action: RowActionFn
}
