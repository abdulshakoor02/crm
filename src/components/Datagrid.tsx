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
import DataGridSkeleton from './DataGridSkeleton'

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
    customActions = [],
    loading = false
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

    if (loading) {
      return (
        <DataGridSkeleton 
          rowCount={Math.min(pageSize, 5)} 
          columnCount={columns.length + (view || edit || del || customActions.length > 0 ? 1 : 0)} 
        />
      )
    }

    // const { } = props

    // Add an action column with optional buttons
    const actionColumn = {
      field: 'actions',
      headerName: 'Actions',
      flex: 0.15,
      minWidth: 160,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          {view && (
            <Tooltip title='View Details'>
              <IconButton
                onClick={() => onView?.(params.row.id)}
                sx={{
                  color: theme.palette.primary.main,
                  padding: theme.spacing(0.75),
                  backgroundColor: alpha(theme.palette.primary.main, 0.08),
                  borderRadius: theme.spacing(1),
                  '&:hover': {
                    color: theme.palette.primary.contrastText,
                    backgroundColor: theme.palette.primary.main,
                    transform: 'scale(1.1)',
                  },
                  transition: 'all 0.2s ease',
                }}
              >
                <EyeOutline fontSize='small' />
              </IconButton>
            </Tooltip>
          )}
          {edit && (
            <Tooltip title='Edit Item'>
              <IconButton
                onClick={() => onEdit?.(params.row.id)}
                sx={{
                  color: theme.palette.warning.main,
                  padding: theme.spacing(0.75),
                  backgroundColor: alpha(theme.palette.warning.main, 0.08),
                  borderRadius: theme.spacing(1),
                  '&:hover': {
                    color: theme.palette.warning.contrastText,
                    backgroundColor: theme.palette.warning.main,
                    transform: 'scale(1.1)',
                  },
                  transition: 'all 0.2s ease',
                }}
              >
                <PencilOutline fontSize='small' />
              </IconButton>
            </Tooltip>
          )}
          {del && (
            <Tooltip title='Delete Item'>
              <IconButton
                onClick={() => onDelete?.(params.row.id)}
                sx={{
                  color: theme.palette.error.main,
                  padding: theme.spacing(0.75),
                  backgroundColor: alpha(theme.palette.error.main, 0.08),
                  borderRadius: theme.spacing(1),
                  '&:hover': {
                    color: theme.palette.error.contrastText,
                    backgroundColor: theme.palette.error.main,
                    transform: 'scale(1.1)',
                  },
                  transition: 'all 0.2s ease',
                }}
              >
                <DeleteOutline fontSize='small' />
              </IconButton>
            </Tooltip>
          )}
          {customActions.map((action, index) => {
            const shouldShow = action.show ? action.show(params.row) : true

            return shouldShow ? (
              <Tooltip key={index} title={action.tooltip}>
                <IconButton
                  onClick={() => action.onClick(params.row.id, params.row)}
                  sx={{
                    color: theme.palette.secondary.main,
                    padding: theme.spacing(0.75),
                    backgroundColor: alpha(theme.palette.secondary.main, 0.08),
                    borderRadius: theme.spacing(1),
                    '&:hover': {
                      color: theme.palette.secondary.contrastText,
                      backgroundColor: theme.palette.secondary.main,
                      transform: 'scale(1.1)',
                    },
                    transition: 'all 0.2s ease',
                  }}
                >
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
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: theme.spacing(1.5),
          boxShadow: theme.shadows[2],
          background: theme.palette.background.paper,
          minHeight: 300,
          overflow: 'hidden',
          '& .MuiDataGrid-columnHeaders': {
            backgroundColor: alpha(theme.palette.primary.main, 0.08),
            color: theme.palette.primary.main,
            fontWeight: 600,
            borderBottom: `2px solid ${theme.palette.primary.main}`,
            fontSize: '0.875rem',
            letterSpacing: '0.01em',
          },
          '& .MuiDataGrid-columnHeaderTitle': {
            fontWeight: 600,
          },
          '& .MuiDataGrid-cell': {
            borderBottom: `1px solid ${theme.palette.divider}`,
            color: theme.palette.text.primary,
            padding: theme.spacing(1.5, 2),
            fontSize: '0.875rem',
          },
          '& .MuiDataGrid-row:nth-of-type(even)': {
            backgroundColor: alpha(theme.palette.grey[100], 0.5),
          },
          '& .MuiDataGrid-row:hover': {
            backgroundColor: alpha(theme.palette.primary.main, 0.08),
            transform: 'translateY(-1px)',
            transition: 'all 0.2s ease',
          },
          '& .MuiDataGrid-row.Mui-selected': {
            backgroundColor: alpha(theme.palette.primary.main, 0.12),
            borderLeft: `3px solid ${theme.palette.primary.main}`,
          },
          '& .MuiDataGrid-row.Mui-selected:hover': {
            backgroundColor: alpha(theme.palette.primary.main, 0.18),
          },
          '& .MuiDataGrid-footerContainer': {
            backgroundColor: alpha(theme.palette.grey[50], 0.8),
            borderTop: `1px solid ${theme.palette.divider}`,
          },
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
