import {
  DataGrid,
  GridColumns,
  GridRenderCellParams,
  GridSortModel,
  GridToolbarContainer,
  GridToolbarExport
} from '@mui/x-data-grid'
import { useTheme } from '@mui/material/styles'
import Toolbar from './Toolbar'
import { IconButton, Tooltip } from '@mui/material'
import { Visibility, Edit, Delete } from '@mui/icons-material'
import Box from '@mui/material/Box'
import { DeleteOutline, EyeOutline, PencilOutline } from 'mdi-material-ui'
import React from 'react'

const DataGridTable = React.memo(
  ({
    rows,
    columns,
    total,
    edit,
    view,
    del,
    onView,
    onEdit,
    onDelete,
    pageSize,
    changePageSize,
    changePage,
    onAddRow,
    onClearSearch,
    onSearch,
    onSearchChange,
    searchValue,
    checkBox = false,
    loading = false
  }: {
    rows: any
    columns: GridColumns
    total: number
    edit: boolean
    view: boolean
    del: boolean
    onView?: (id: any) => void
    onEdit?: (id: any) => void
    onDelete?: (id: any) => void
    onAddRow?: () => void
    onSearch: () => void
    onSearchChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
    onClearSearch: () => void
    searchValue: any
    pageSize: number
    changePageSize: any
    changePage: any
    checkBox?: boolean
    loading?: boolean
  }) => {
    const theme = useTheme()
    // const { } = props

    // Add an action column with optional buttons
    const actionColumn = {
      field: 'actions',
      headerName: 'Actions',
      flex: 0.1,
      minWidth: 150,
      renderCell: (params: GridRenderCellParams) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {view && (
            <Tooltip title='View'>
              <IconButton sx={{ textDecoration: 'none' }} onClick={() => onView(params.row.id)}>
                <EyeOutline fontSize='small' />
              </IconButton>
            </Tooltip>
          )}
          {edit && (
            <Tooltip title='View'>
              <IconButton color='secondary' onClick={() => onEdit(params.row.id)}>
                <PencilOutline fontSize='small' />
              </IconButton>
            </Tooltip>
          )}
          {del && (
            <Tooltip title='View'>
              <IconButton onClick={() => onDelete(params.row.id)}>
                <DeleteOutline fontSize='small' />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      )
    }

    // Conditionally add the action column only if any of the handlers are passed
    const columnsWithActions = onView || onEdit || onDelete ? [...columns, actionColumn] : columns

    return (
      <DataGrid
        loading={loading}
        autoHeight
        pagination
        disableColumnFilter
        disableColumnMenu
        disableSelectionOnClick
        checkboxSelection={checkBox}
        paginationMode='server'
        rowsPerPageOptions={[1, 5, 10, 25, 50]}
        pageSize={pageSize}
        onPageSizeChange={changePageSize}
        onPageChange={changePage}
        paginationMode="server"
        rows={rows}
        columns={columnsWithActions}
        rowCount={total}
        sx={{ color: theme.palette.primary.main }}
        components={{ Toolbar }}
        componentsProps={{
          toolbar: {
            onAddRow,
            onSearch,
            onSearchChange,
            onClearSearch,
            searchValue
          }
        }}
      />
    )
  }
)

export default DataGridTable
