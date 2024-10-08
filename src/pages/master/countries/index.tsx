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
import Modal from 'src/pages/components/Model/Model'

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
  const [isLoading, setLoading] = useState(true)
  const [pageSize, setPageSize] = useState<number>(10)
  const [page, setPage] = useState<number>(0)
  const [searchValue, setSearchValue] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<'view' | 'edit' | 'add'>('view')
  const [selectedRow, setSelectedRow] = useState<any>(null)
  const [formValues, setFormValues] = useState({ name: '', age: 0, city: '' })
  const [errors, setErrors] = useState({ name: '', age: '', city: '' })

  const country = useSelector((state: RootState) => state.country)

  useEffect(() => {
    dispatch(getCountriesData({ limit: pageSize, offset: pageSize * page })).then(() => setLoading(false))
  }, [pageSize, page])

  const handleOpenModal = (id: number, mode: 'view' | 'edit' | 'add') => {
    const rowData = data.find(row => row.id === id)
    setSelectedRow(rowData)
    setFormValues(
      rowData
        ? {
            name: rowData.name,
            age: rowData.age, // Ensure age is a string
            city: rowData.city
          }
        : { name: '', age: 0, city: '' }
    )
    setModalMode(mode)
    setModalOpen(true)
  }

  const handleCloseModal = () => {
    setModalOpen(false)
    setSelectedRow(null)
    // setErrors({ name: '', age: '', city: '' }); // Reset errors
  }

  const handleSubmit = () => {
    // let validationErrors = { name: '', age: '', city: '' };
    // let isValid = true;

    // // Validation logic
    // if (!formValues.name) {
    //   validationErrors.name = 'Name is required';
    //   isValid = false;
    // }
    // if (!formValues.age || isNaN(Number(formValues.age))) {
    //   validationErrors.age = 'Valid age is required';
    //   isValid = false;
    // }
    // if (!formValues.city) {
    //   validationErrors.city = 'City is required';
    //   isValid = false;
    // }

    // if (!isValid) {
    //   setErrors(validationErrors);
    //   return;
    // }

    // if (modalMode === 'edit') {
    //   setData(prevData =>
    //     prevData.map(row => (row.id === selectedRow.id ? { ...row, ...formValues } : row))
    //   );
    // }

    // if (modalMode === 'add') {
    //   // Assuming formValues contains all the necessary data for the new row
    //   const newRow = {
    //     id: data.length + 1, // or another unique ID generation method
    //     ...formValues
    //   };
    //   setData(prevData => [...prevData, newRow]);
    // }

    handleCloseModal()
  }

  const handleDelete = (id: number) => {
    // setData(prevData => prevData.filter(row => row.id !== id));
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <DataGridTable
            checkBox={false}
            loading={isLoading}
            rows={country.rows}
            columns={columns}
            total={country.count}
            pageSize={pageSize}
            changePageSize={(newPageSize: number) => setPageSize(newPageSize)}
            changePage={(newPage: number) => setPage(newPage)}
            searchValue={searchValue}
            onSearchChange={e => setSearchValue(e.target.value)}
            onSearch={() => console.log('searched!')}
            onClearSearch={() => setSearchValue('')}
            onView={id => handleOpenModal(id, 'view')}
            onEdit={id => handleOpenModal(id, 'edit')}
            onDelete={id => handleDelete(id)}
            onAddRow={() => handleOpenModal(0, 'add')}
          />
        </Card>
      </Grid>

      {/* Modal
       <Modal isOpen={modalOpen} onClose={handleCloseModal} title={modalMode === 'edit' ? 'Edit Row' : 'View Row'} onSubmit={handleSubmit} mode={modalMode}>
          {
            <>
              <TextField
                fullWidth
                label="Name"
                value={formValues.name}
                onChange={(e) => setFormValues({ ...formValues, name: e.target.value })}
                error={!!errors.name}
                helperText={errors.name}
                disabled={modalMode === 'view'}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Age"
                type="number"
                value={formValues.age}
                onChange={(e) => setFormValues({ ...formValues, age: Number(e.target.value) })}
                error={!!errors.age}
                helperText={errors.age}
                disabled={modalMode === 'view'}
                margin="normal"
              />
              <TextField
                fullWidth
                label="City"
                value={formValues.city}
                onChange={(e) => setFormValues({ ...formValues, city: e.target.value })}
                error={!!errors.city}
                helperText={errors.city}
                disabled={modalMode === 'view'}
                margin="normal"
              />
            </>
          }
      </Modal> */}
    </Grid>
  )
}

export default Countries
