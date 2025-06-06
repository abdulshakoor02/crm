import {
  DataGrid,
  GridColumns,
  GridRenderCellParams,
  GridSortModel,
  GridToolbarContainer,
  GridToolbarExport
} from '@mui/x-data-grid'
import { useTheme, alpha } from '@mui/material/styles'
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
    add,
    onAddRow,
    onClearSearch,
    onSearch,
    onSearchChange,
    searchValue,
    checkBox = false,
    loading = false,
    customActions = []
  }: {
    rows: any
    columns: GridColumns
    total: number
    edit: boolean
    view: boolean
    del: boolean
    add: boolean
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
    customActions?: Array<{
      icon: React.ReactNode
      tooltip: string
      onClick: (id: any, row: any) => void
      show?: (row: any) => boolean
    }>
  }) => {
    const theme = useTheme()
    // const { } = props

    // Add an action column with optional buttons
    const actionColumn = {
      field: 'actions',
      headerName: 'Actions',
      flex: 0.15,
      minWidth: 200,
      renderCell: (params: GridRenderCellParams) => (
        <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
          {view && (
            <Tooltip title='View Details'>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '50%',
                  width: 32,
                  height: 32,
                  mx: 0.5,
                  backgroundColor: theme.palette.mode === 'light' ? theme.palette.primary.light : theme.palette.primary.dark,
                  '&:hover': {
                    backgroundColor: theme.palette.mode === 'light' ? alpha(theme.palette.primary.light, 0.8) : alpha(theme.palette.primary.dark, 0.8),
                  }
                }}
              >
                <IconButton
                  onClick={() => onView?.(params.row.id)}
                  sx={{ color: theme.palette.common.black }}
                >
                  <EyeOutline fontSize='small' />
                </IconButton>
              </Box>
            </Tooltip>
          )}
          {edit && (
            <Tooltip title='Edit Item'>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '50%',
                  width: 32,
                  height: 32,
                  mx: 0.5,
                  backgroundColor: theme.palette.mode === 'light' ? theme.palette.warning.light : theme.palette.warning.dark,
                  '&:hover': {
                    backgroundColor: theme.palette.mode === 'light' ? alpha(theme.palette.warning.light, 0.8) : alpha(theme.palette.warning.dark, 0.8),
                  }
                }}
              >
                <IconButton
                  onClick={() => onEdit?.(params.row.id)}
                  sx={{ color: theme.palette.common.black }}
                >
                  <PencilOutline fontSize='small' />
                </IconButton>
              </Box>
            </Tooltip>
          )}
          {del && (
            <Tooltip title='Delete Item'>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '50%',
                  width: 32,
                  height: 32,
                  mx: 0.5,
                  backgroundColor: theme.palette.mode === 'light' ? theme.palette.error.light : theme.palette.error.dark,
                  '&:hover': {
                    backgroundColor: theme.palette.mode === 'light' ? alpha(theme.palette.error.light, 0.8) : alpha(theme.palette.error.dark, 0.8),
                  }
                }}
              >
                <IconButton
                  onClick={() => onDelete?.(params.row.id)}
                  sx={{ color: theme.palette.common.black }}
                >
                  <DeleteOutline fontSize='small' />
                </IconButton>
              </Box>
            </Tooltip>
          )}
          {customActions.map((action, index) => {
            const shouldShow = action.show ? action.show(params.row) : true

            return shouldShow ? (
              <Tooltip key={index} title={action.tooltip}>
                <IconButton onClick={() => action.onClick(params.row.id, params.row)}>
                  {action.icon}
                </IconButton>
              </Tooltip>
            ) : null
          })}
        </Box>
      )
    }

    // Conditionally add the action column only if any of the handlers are passed
    const columnsWithActions = view || edit || del || customActions.length > 0 ? [...columns, actionColumn] : columns

    return (
      <DataGrid
        loading={loading}
        autoHeight
        pagination
        disableColumnFilter
        disableColumnMenu
        disableSelectionOnClick
        checkboxSelection={checkBox}
        rowsPerPageOptions={[1, 5, 10, 25, 50]}
        pageSize={pageSize}
        onPageSizeChange={changePageSize}
        onPageChange={changePage}
        paginationMode="server"
        rows={rows}
        columns={columnsWithActions}
        rowCount={total}
        sx={{
          // color: theme.palette.primary.main, // Example, can be removed or adjusted
          boxShadow: theme.shadows[2],
          border: 0, // Or `1px solid ${theme.palette.divider}`
          padding: theme.spacing(1),
          minHeight: 300,
          background: theme.palette.mode === 'light'
            ? `linear-gradient(to bottom, ${theme.palette.grey[100]}, ${theme.palette.background.paper})`
            : `linear-gradient(to bottom, ${alpha(theme.palette.background.paper, 0.95)}, ${theme.palette.background.paper})`,
          '& .MuiDataGrid-columnHeaders': {
            backgroundColor: theme.palette.mode === 'light' ? theme.palette.grey[200] : theme.palette.grey[800],
          },
          '& .MuiDataGrid-cell': {
            borderBottom: `1px solid ${theme.palette.divider}`
          },

          // Custom scrollbar styles are in globals.css, but you can add fallbacks or specific overrides here
        }}
        components={{ Toolbar }}
        componentsProps={{
          toolbar: {
            add,
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
