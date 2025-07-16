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
                  background: theme.palette.customColors.primaryGradient,
                  '&:hover': {
                    filter: 'brightness(1.2)',
                  }
                }}
              >
                <IconButton
                  onClick={() => onView?.(params.row.id)}
                  sx={{ color: theme.palette.common.white }}
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
                  background: theme.palette.customColors.primaryGradient,
                  '&:hover': {
                    filter: 'brightness(1.2)',
                  }
                }}
              >
                <IconButton
                  onClick={() => onEdit?.(params.row.id)}
                  sx={{ color: theme.palette.common.white }}
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
                  background: theme.palette.customColors.primaryGradient,
                  '&:hover': {
                    filter: 'brightness(1.2)',
                  }
                }}
              >
                <IconButton
                  onClick={() => onDelete?.(params.row.id)}
                  sx={{ color: theme.palette.common.white }}
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
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '50%',
                    width: 32,
                    height: 32,
                    mx: 0.5,
                    background: theme.palette.customColors.primaryGradient,
                    '&:hover': {
                      filter: 'brightness(1.2)',
                    }
                  }}
                >
                  <IconButton onClick={() => action.onClick(params.row.id, params.row)} sx={{ color: theme.palette.common.white }}>
                    {action.icon}
                  </IconButton>
                </Box>
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
          background: theme.palette.customColors.primaryGradient,
          transition: 'transform 0.3s ease-in-out',
          '&:hover': {
            transform: 'scale(1.005)'
          },
          '& .MuiDataGrid-columnHeaders': {
            backgroundColor: 'rgba(255,255,255,0.2)',
            color: 'common.white',
          },
          '& .MuiDataGrid-cell': {
            borderBottom: `1px solid rgba(255,255,255,0.2)`,
            color: 'common.white',
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
