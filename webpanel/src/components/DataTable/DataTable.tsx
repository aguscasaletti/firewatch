/* eslint-disable jsx-a11y/anchor-is-valid, react/jsx-key */
import React, { memo, useEffect, useState, useCallback, useMemo } from 'react'
import {
  useTable,
  usePagination,
  useSortBy,
  Column,
  SortingRule,
  Row,
} from 'react-table'
import debounce from 'lodash/debounce'
import {
  Icon,
  Box,
  Flex,
  Button,
  InputGroup,
  InputLeftElement,
  Input,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Checkbox,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Heading,
  Text,
  Tooltip,
  IconButton,
} from '@chakra-ui/react'
import { IoEllipsisVertical } from 'react-icons/io5'
import { FetchDataParams, RowAction } from 'types/data-table'
import {
  AddIcon,
  ArrowDownIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  ArrowUpDownIcon,
  ArrowUpIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  SearchIcon,
} from '@chakra-ui/icons'

export type WithID = { id: number }

export type Highlightable = { highlighted: boolean }

export type DataTableEntity = { id: number; highlighted: boolean }

export interface DataTableProps<DataTableEntity> {
  data?: DataTableEntity[]
  columns: Column<any>[]
  loading: boolean
  fetchData: (arg: FetchDataParams) => void
  totalCount?: number
  initialSortBy: SortingRule<DataTableEntity>[]
  onCreateClick?: () => void
  showCreate?: boolean
  filters?: JSX.Element
  clickable?: boolean
  renderRowActions?: (row: Row<any>) => RowAction[]
  onRowClick?: (row: Row<any>) => void
  search?: string
  setSearch: (value: string) => void
  hiddenColumns?: string[]
  selectableRows?: boolean
  onSelectedRowsChange?: (rows: Row<any>[]) => void
  leftActions?: JSX.Element
}

const DEFAULT_PAGE_SIZE = 10

const DataTable = <T extends DataTableEntity>({
  data = [],
  columns,
  loading,
  fetchData,
  totalCount = 0,
  initialSortBy,
  onCreateClick,
  filters,
  clickable = false,
  renderRowActions,
  search = '',
  setSearch,
  onRowClick,
  showCreate = true,
  hiddenColumns = [],
  selectableRows = false,
  onSelectedRowsChange = () => undefined,
  leftActions,
}: DataTableProps<T>): React.ReactElement => {
  // Row.id is a string index
  // `search` is a controlled prop for the input, which is nice for parent components
  // however, since we debounce the onChange listener, we use another internal state variable `searchText`
  // to perform the actual queries
  const pageCount = Math.ceil(totalCount / DEFAULT_PAGE_SIZE)
  const [searchText, setSearchText] = useState(search)
  const initialState = useMemo(() => {
    return {
      pageIndex: 0,
      pageSize: DEFAULT_PAGE_SIZE,
      sortBy: initialSortBy,
      hiddenColumns,
    }
  }, [initialSortBy, hiddenColumns])

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    selectedFlatRows,
    state: { pageIndex, pageSize, sortBy },
    nextPage,
    previousPage,
    gotoPage,
  } = useTable<any>(
    {
      columns,
      data,
      initialState,
      pageCount,
      manualPagination: true,
      manualSortBy: true,
      disableMultiSort: true,
    },
    useSortBy,
    usePagination,
  )

  const isFirstPage = pageIndex === 0
  const isLastPage = pageIndex === pageCount - 1

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const onSearchChanged = useCallback(
    debounce((value: string) => {
      setSearchText(value)
      gotoPage(0)
    }, 500),
    [setSearchText, gotoPage],
  )

  useEffect(() => {
    onSelectedRowsChange(selectedFlatRows)
  }, [onSelectedRowsChange, selectedFlatRows])

  useEffect(() => {
    onSearchChanged(search)
  }, [search, onSearchChanged])

  // Listen for changes
  useEffect(() => {
    fetchData({
      skip: pageIndex * pageSize,
      limit: pageSize,
      sortBy,
      search: searchText,
    })
  }, [fetchData, pageIndex, pageSize, sortBy, searchText])

  return (
    <>
      <Flex marginBottom="6" justifyContent="space-between">
        <Box>
          {showCreate && onCreateClick && (
            <Button onClick={onCreateClick} leftIcon={<AddIcon />}>
              Nuevo
            </Button>
          )}
          {leftActions ? leftActions : null}
        </Box>
        <Box>
          {filters}
          <InputGroup>
            <InputLeftElement
              pointerEvents="none"
              children={<SearchIcon color="gray.300" />}
            />
            <Input
              type="text"
              placeholder="Buscar"
              onChange={(e) => setSearch(e.target.value)}
            />
          </InputGroup>
        </Box>
      </Flex>
      {rows.length || loading ? (
        <>
          <Table {...getTableProps()} size="sm" variant="simple">
            <Thead display="table" tableLayout="fixed" width="100%">
              {headerGroups.map((headerGroup) => (
                <Tr {...headerGroup.getHeaderGroupProps()}>
                  {selectableRows && <Th></Th>}
                  {headerGroup.headers.map((column) => (
                    <Th
                      width={column.width || 200}
                      {...column.getHeaderProps(column.getSortByToggleProps())}
                    >
                      {column.render('Header')}
                      {column.isSorted ? (
                        column.isSortedDesc ? (
                          <ArrowDownIcon />
                        ) : (
                          <ArrowUpIcon />
                        )
                      ) : (
                        column.canSort && <ArrowUpDownIcon />
                      )}
                    </Th>
                  ))}
                  {renderRowActions && <Th></Th>}
                </Tr>
              ))}
            </Thead>
            <Tbody
              overflow="auto"
              display="block"
              maxHeight="calc(100vh - 280px)"
              {...getTableBodyProps()}
            >
              {rows.map((row) => {
                prepareRow(row)
                return (
                  <Tr
                    cursor={onRowClick ? 'pointer' : undefined}
                    display="table"
                    width="100%"
                    {...row.getRowProps()}
                  >
                    {selectableRows && (
                      <Td>
                        <Checkbox {...row.getToggleRowSelectedProps()} />
                      </Td>
                    )}
                    {row.cells.map((cell) => (
                      <Td
                        onClick={() => onRowClick && onRowClick(row)}
                        width={cell.column.width || 200}
                        {...cell.getCellProps()}
                      >
                        {cell.render('Cell')}
                      </Td>
                    ))}
                    {renderRowActions && (
                      <Td paddingTop={0.5} paddingBottom={0.5}>
                        <Menu>
                          <MenuButton
                            backgroundColor="white"
                            as={IconButton}
                            icon={<IoEllipsisVertical />}
                          ></MenuButton>
                          <MenuList>
                            {renderRowActions(row).map(
                              ({ action, icon, label }, idx) => (
                                <MenuItem
                                  key={idx}
                                  onClick={() => {
                                    action(row)
                                  }}
                                >
                                  <Icon marginRight="2" as={icon} />
                                  {label}
                                </MenuItem>
                              ),
                            )}
                          </MenuList>
                        </Menu>
                      </Td>
                    )}
                  </Tr>
                )
              })}
            </Tbody>
          </Table>
          <Flex justifyContent="space-between" m={4} alignItems="center">
            <Flex>
              <Tooltip label="Primer página">
                <IconButton
                  aria-label="first-page"
                  onClick={() => gotoPage(0)}
                  isDisabled={isFirstPage}
                  icon={<ArrowLeftIcon h={3} w={3} />}
                  mr={4}
                />
              </Tooltip>
              <Tooltip label="Página anterior">
                <IconButton
                  aria-label="previous-page"
                  onClick={previousPage}
                  isDisabled={isFirstPage}
                  icon={<ChevronLeftIcon h={6} w={6} />}
                />
              </Tooltip>
            </Flex>

            <Flex alignItems="center">
              <Text mr={8}>
                Página{' '}
                <Text fontWeight="bold" as="span">
                  {pageIndex + 1}
                </Text>{' '}
                de{' '}
                <Text fontWeight="bold" as="span">
                  {pageCount}
                </Text>
              </Text>
            </Flex>

            <Flex>
              <Tooltip label="Página siguiente">
                <IconButton
                  aria-label="next-page"
                  onClick={nextPage}
                  isDisabled={isLastPage}
                  icon={<ChevronRightIcon h={6} w={6} />}
                />
              </Tooltip>
              <Tooltip label="Última página">
                <IconButton
                  aria-label="last-page"
                  onClick={() => gotoPage(pageCount - 1)}
                  isDisabled={isLastPage}
                  icon={<ArrowRightIcon h={3} w={3} />}
                  ml={4}
                />
              </Tooltip>
            </Flex>
          </Flex>
        </>
      ) : (
        <Box height={300}>
          <Heading size="lg">No hay resultados.</Heading>
          <Text>No se encontraron datos con tus criterios de búsqueda.</Text>
        </Box>
      )}
    </>
  )
}

export default memo(DataTable)
