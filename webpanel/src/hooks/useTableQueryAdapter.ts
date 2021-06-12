import { DataTableEntity } from 'components/DataTable/DataTable'
import { useState, useCallback } from 'react'
import { useQuery } from 'react-query'
import { FetchDataParams, Paginable } from 'types/data-table'

export interface TableQueryAdapterParam<T> {
  queryKey: string
  queryFn: (params: Record<string, string>) => Promise<Paginable<T>>
  mapRows?: (item: T) => DataTableEntity
}

export interface TableQueryAdapterValues {
  data: Paginable<DataTableEntity> | undefined
  isLoading: boolean
  search?: string
  setSearch: (value: string) => void
  fetchData: (arg: FetchDataParams) => void
  refetch: () => Promise<any>
}

/**
 * Makes it easier for query data to be mapped to useful table data
 * Transforms table search and pagination parameters into query params.
 * Holds state for searching.
 * Listens to changes in table state.
 */
export function useTableQueryAdapter<T>({
  queryKey,
  queryFn,
  mapRows,
}: TableQueryAdapterParam<T>): TableQueryAdapterValues {
  const [params, setParams] = useState<FetchDataParams>()
  const [search, setSearch] = useState<string>()
  const { data, isLoading, refetch } = useQuery([queryKey, params], () => {
    if (params) {
      const { skip, limit, search, sortBy } = params
      const parsedParams = {
        skip: skip.toString(),
        limit: limit.toString(),
        ...(search ? { search } : {}),
        ...(!sortBy.length
          ? {}
          : {
              order_by: sortBy[0].id,
              desc: `${sortBy[0].desc}`,
            }),
      }
      return queryFn(parsedParams)
    }
  })

  const fetchData = useCallback((params: FetchDataParams) => {
    setParams(params)
  }, [])

  let mappedData: DataTableEntity[] = []
  if (mapRows && data?.data) {
    mappedData = data?.data.map(mapRows)
  }

  return {
    data: {
      data: mappedData,
      pagination: data?.pagination || {
        total_count: 0,
      },
    },
    isLoading,
    search,
    setSearch,
    fetchData,
    refetch,
  }
}
