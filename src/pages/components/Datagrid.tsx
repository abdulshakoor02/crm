import { DataGrid, GridColumns, GridRenderCellParams, GridSortModel, GridToolbarContainer } from '@mui/x-data-grid'
import { useTheme } from '@mui/material/styles'
import Toolbar from './Toolbar'

const DataGridTable = (props: {
  rows: any
  columns: GridColumns
  total: number
  pageSize: number
  changePageSize: any
  changePage: any
}) => {
  const theme = useTheme()
  const { rows, columns, total, pageSize, changePageSize, changePage } = props

  return (
    <DataGrid
      autoHeight
      pagination
      disableColumnFilter
      disableColumnMenu
      disableSelectionOnClick
      rowsPerPageOptions={[10, 25, 50]}
      pageSize={pageSize}
      onPageSizeChange={changePageSize}
      onPageChange={changePage}
      paginationMode='server'
      rows={rows}
      columns={columns}
      rowCount={total}
      sx={{ color: theme.palette.primary.main }}
      components={{ Toolbar }}
    />
  )
}

export default DataGridTable
