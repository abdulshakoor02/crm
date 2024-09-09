// ** MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import { useTheme } from '@mui/material/styles'
import uuid from 'react-uuid'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import { DataGrid, GridColumns, GridRenderCellParams, GridSortModel, GridToolbarContainer } from '@mui/x-data-grid'
import DataGridTable from '../components/Datagrid'

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
    field: 'age',
    headerName: 'Age',
    renderCell: (params: GridRenderCellParams) => (
      <Typography variant='body2' sx={{ color: 'text.primary' }}>
        {params?.row?.['age']}
      </Typography>
    )
  },
  {
    flex: 0.1,
    minWidth: 150,
    field: 'city',
    headerName: 'City',
    renderCell: (params: GridRenderCellParams) => (
      <Typography variant='body2' sx={{ color: 'text.primary' }}>
        {params?.row?.['city']}
      </Typography>
    )
  }
]
const SecondPage = () => {
  const theme = useTheme()

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <DataGridTable rows={data} columns={columns} total={data.length} />
        </Card>
      </Grid>
    </Grid>
  )
}

export default SecondPage
