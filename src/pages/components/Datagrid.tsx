import { DataGrid, GridColumns, GridRenderCellParams, GridSortModel, GridToolbarContainer } from '@mui/x-data-grid'
import { useTheme } from '@mui/material/styles'
import Toolbar from './Toolbar'

const DataGridTable = (props: { rows: any; columns: GridColumns; total: number }) => {
  const theme = useTheme()
  const { rows, columns, total } = props

  return (
    <DataGrid
      autoHeight
      pagination
      disableColumnFilter
      disableColumnMenu
      disableSelectionOnClick
      rows={rows}
      columns={columns}
      rowCount={total}
      sx={{ color: theme.palette.primary.main }}
      components={{ Toolbar }}
    />
  )
}

export default DataGridTable
