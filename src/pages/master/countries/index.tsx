// ** MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import { useTheme } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import { GridColumns, GridRenderCellParams } from '@mui/x-data-grid'
import { useEffect, useState } from 'react'

// ** Store Imports
import { useDispatch, useSelector } from 'react-redux'
import { RootState, AppDispatch } from '../../../store'

import { getCountriesData } from '../../../store/apps/countries'
import DataGridTable from '../../components/Datagrid'

const data = [
  { id: 1, name: 'Alice', age: 30, city: 'New York' },
  { id: 2, name: 'Bob', age: 25, city: 'London' },
  { id: 3, name: 'Charlie', age: 42, city: 'Paris' },
  { id: 4, name: 'Diana', age: 28, city: 'Berlin' },
  { id: 5, name: 'Ethan', age: 35, city: 'Tokyo' }
]

const columns: GridColumns = [
  {
    flex: 0.1,
    minWidth: 150,
    sortable: false,
    field: 'name',
    headerName: 'Name',
    renderCell: (params: GridRenderCellParams) => (
      <Typography variant='body2' sx={{ color: 'text.primary' }}>
        {params?.row?.['name']}
      </Typography>
    )
  },
  {
    flex: 0.1,
    minWidth: 150,
    field: 'code',
    headerName: 'Code',
    renderCell: (params: GridRenderCellParams) => (
      <Typography variant='body2' sx={{ color: 'text.primary' }}>
        {params?.row?.['code']}
      </Typography>
    )
  },
  {
    flex: 0.1,
    minWidth: 150,
    field: 'currency',
    headerName: 'Currency',
    renderCell: (params: GridRenderCellParams) => (
      <Typography variant='body2' sx={{ color: 'text.primary' }}>
        {params?.row?.['currency']}
      </Typography>
    )
  },
  {
    flex: 0.1,
    minWidth: 150,
    field: 'currency_name',
    headerName: 'Currency Name',
    renderCell: (params: GridRenderCellParams) => (
      <Typography variant='body2' sx={{ color: 'text.primary' }}>
        {params?.row?.['currency_name']}
      </Typography>
    )
  }
]
const Countries = () => {
  const theme = useTheme()
  const dispatch = useDispatch<AppDispatch>()
  const [pageSize, setPageSize] = useState<number>(10)
  const [page, setPage] = useState<number>(0)

  const country = useSelector((state: RootState) => state.country)

  useEffect(() => {
    dispatch(getCountriesData({ limit: pageSize, offset: pageSize * page }))
  }, [pageSize, page])

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <DataGridTable
            rows={country.rows}
            columns={columns}
            total={country.count}
            pageSize={pageSize}
            changePageSize={newPageSize => setPageSize(newPageSize)}
            changePage={newPage => setPage(newPage)}
          />
        </Card>
      </Grid>
    </Grid>
  )
}

export default Countries
