// ** MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import { useTheme } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import { GridColumns, GridRenderCellParams } from '@mui/x-data-grid'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

// ** Store Imports
import { useDispatch, useSelector } from 'react-redux'
import { RootState, AppDispatch } from '../../../store'

import { createCountryData, getCountriesData, updateCountryData } from '../../../store/apps/countries'
import DataGridTable from '../../components/Datagrid'
import Modal from 'src/pages/components/Model/Model'
import { TextField } from '@mui/material'
import FormTextField from 'src/pages/components/FormtextField'
import { validateFormValues } from 'src/validation/validation'
import { Countries as ICountries } from 'src/types/components/countries.types'


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
  const [formValues, setFormValues] = useState<ICountries>({ name: '', code: '', currency: '', currency_name: '' })
  const [errors, setErrors] = useState<Partial<ICountries>>({ name: '', code: '', currency: '', currency_name: '' })

  const country = useSelector((state: RootState) => state.country)

  useEffect(() => {
    dispatch(getCountriesData({ limit: pageSize, offset: pageSize * page, where: { name: searchValue } }))
  }, [pageSize, page])

  const handleOpenModal = (id: string, mode: 'view' | 'edit' | 'add') => {
    const rowData = country.rows.find(row => row.id === id)
    setSelectedRow(rowData)
    setFormValues(
      rowData
        ? {
            name: rowData.name,
            code: rowData.code,
            currency: rowData.currency,
            currency_name: rowData.currency_name
          }
        : { name: '', code: '', currency: '', currency_name: '' }
    )
    setModalMode(mode)
    setModalOpen(true)
  }

  const handleCloseModal = () => {
    setModalOpen(false)
    setSelectedRow(null)
    setErrors({ name: '', code: '', currency: '', currency_name: '' }) // Reset errors
  }

  const handleSubmit = async () => {
    // let validationErrors = { name: '', code: '', currency: '', currency_name: '' }
    let isValid = true;

    const validationRules: Record<keyof ICountries, string> = {
      name: 'Name is required',
      code: 'Valid code is required',
      currency: 'Currency is required',
      currency_name: 'Currency name is required',
    };

    const { hasError, errors: validationErrors } = validateFormValues(formValues,validationRules);
    if(hasError){
      setErrors(validationErrors); // Update the errors state
      return;
    }


    // // Validation logic
    // if (!formValues.name) {
    //   validationErrors.name = 'Name is required'
    //   isValid = false
    // }
    // if (!formValues.code) {
    //   validationErrors.code = 'Valid code is required'
    //   isValid = false
    // }
    // if (!formValues.currency) {
    //   validationErrors.currency = 'Currency is required'
    //   isValid = false
    // }
    // if (!formValues.currency_name) {
    //   validationErrors.currency_name = 'Currency name is required'
    //   isValid = false
    // }

    // if (!isValid) {
    //   setErrors(validationErrors)
    //   return
    // }

    try {
      let result

      console.log('form values', formValues, selectedRow?.id)
      if (modalMode === 'edit') {
        result = await dispatch(
          updateCountryData({ where: { id: selectedRow.id }, data: { ...formValues, id: selectedRow.id } })
        ).unwrap()
        if (result) toast.success('Country updated successfully!')
      } else if (modalMode === 'add') {
        result = await dispatch(createCountryData([formValues])).unwrap()
        if (result) toast.success('Country added successfully!')
      }

      // Refetch countries data after successful operation
      await dispatch(getCountriesData({ limit: pageSize, offset: pageSize * page }))
    } catch (error) {
      console.error('Operation failed:', error)
      toast.error('Operation failed, please try again.')
    } finally {
      handleCloseModal()
    }
  }

  const handleDelete = (id: number) => {
    // setData(prevData => prevData.filter(row => row.id !== id));
  }

  const handleOnSearch = () => {
    if (page !== 0) setPage(0); // Reset to first page on search
    dispatch(getCountriesData({ limit: pageSize, offset: pageSize * page, where: { name: searchValue } }))
  }

  const handleOnSearchClear = () => {
    setSearchValue('')
    dispatch(getCountriesData({ limit: pageSize, offset: pageSize * page }))
  }

  return (
    <>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Card>
            <DataGridTable
              rows={country.rows}
              columns={columns}
              total={country.count}
              pageSize={pageSize}
              loading={country.loading}
              changePageSize={(newPageSize: number) => setPageSize(newPageSize)}
              changePage={(newPage: number) => setPage(newPage)}
              searchValue={searchValue}
              onSearchChange={e => setSearchValue(e.target.value)}
              onSearch={handleOnSearch}
              onClearSearch={handleOnSearchClear}
              onView={id => handleOpenModal(id, 'view')}
              onEdit={id => handleOpenModal(id, 'edit')}
              onDelete={id => handleDelete(id)}
              onAddRow={() => handleOpenModal('', 'add')}
            />
          </Card>
        </Grid>

        {/* Modal */}
        <Modal
          isOpen={modalOpen}
          onClose={handleCloseModal}
          title={modalMode === 'edit' ? 'Edit Row' : 'View Row'}
          onSubmit={handleSubmit}
          mode={modalMode}
        >
          {
            <>
              <FormTextField
                label={'Name'}
                value={formValues.name}
                onChange={e => setFormValues({ ...formValues, name: e.target.value })}
                error={errors.name}
                disabled={modalMode === 'view'}
              />
              <FormTextField
                label={'Code'}
                value={formValues.code}
                onChange={e => setFormValues({ ...formValues, code: e.target.value })}
                error={errors.code}
                disabled={modalMode === 'view'}
              />
              <FormTextField
                label={'Currency'}
                value={formValues.currency}
                onChange={e => setFormValues({ ...formValues, currency: e.target.value })}
                error={errors.currency}
                disabled={modalMode === 'view'}
              />
              <FormTextField
                label={'Currency Name'}
                value={formValues.currency_name}
                onChange={e => setFormValues({ ...formValues, currency_name: e.target.value })}
                error={errors.currency_name}
                disabled={modalMode === 'view'}
              />
            </>
          }
        </Modal>
      </Grid>
    </>
  )
}

export default Countries
