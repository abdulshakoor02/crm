// ** MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import { useTheme } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import { MenuItem, TextField } from '@mui/material'
import { GridColumns, GridRenderCellParams } from '@mui/x-data-grid'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

// ** Store Imports
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch } from '../../../store'

import { getBranchData, createBranchData, updateBranchData } from '../../../store/apps/branch'
import { getCountriesData } from '../../../store/apps/countries'
import { getRegionData } from '../../../store/apps/region'
import DataGridTable from '../../components/Datagrid'
import Modal from 'src/pages/components/Model/Model'
import uuid from 'react-uuid'

type Branch = {
  id: string
  name: string
  mobile: string
  email: string
  region_id: string
  website: string
  country_id: string
  tax: string
  created_by?: string
  modified_by?: string
  status: string
}

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
    field: 'phone',
    headerName: 'Phone',
    renderCell: (params: GridRenderCellParams) => (
      <Typography variant='body2' sx={{ color: 'text.primary' }}>
        {params?.row?.['mobile']}
      </Typography>
    )
  },
  {
    flex: 0.1,
    minWidth: 150,
    field: 'email',
    headerName: 'Email',
    renderCell: (params: GridRenderCellParams) => (
      <Typography variant='body2' sx={{ color: 'text.primary' }}>
        {params?.row?.['email']}
      </Typography>
    )
  },
  {
    flex: 0.1,
    minWidth: 150,
    field: 'website',
    headerName: 'Website',
    renderCell: (params: GridRenderCellParams) => (
      <Typography variant='body2' sx={{ color: 'text.primary' }}>
        {params?.row?.['website']}
      </Typography>
    )
  },
  {
    flex: 0.1,
    minWidth: 150,
    field: 'country_id',
    headerName: 'Country',
    renderCell: (params: GridRenderCellParams) => (
      <Typography variant='body2' sx={{ color: 'text.primary' }}>
        {params?.row?.country?.['country_name']}
      </Typography>
    )
  },
  {
    flex: 0.1,
    minWidth: 150,
    field: 'region_id',
    headerName: 'Region',
    renderCell: (params: GridRenderCellParams) => (
      <Typography variant='body2' sx={{ color: 'text.primary' }}>
        {params?.row?.region?.['region_name']}
      </Typography>
    )
  },
  {
    flex: 0.1,
    minWidth: 150,
    field: 'tax',
    headerName: 'Tax',
    renderCell: (params: GridRenderCellParams) => (
      <Typography variant='body2' sx={{ color: 'text.primary' }}>
        {params?.row?.['tax']}
      </Typography>
    )
  },
  {
    flex: 0.1,
    minWidth: 150,
    field: 'status',
    headerName: 'Status',
    renderCell: (params: GridRenderCellParams) => (
      <Typography variant='body2' sx={{ color: 'text.primary' }}>
        {params?.row?.['status']}
      </Typography>
    )
  }
]

const BranchComponent = () => {
  const theme = useTheme()
  const dispatch = useDispatch<AppDispatch>()
  const [pageSize, setPageSize] = useState<number>(10)
  const [page, setPage] = useState<number>(0)
  const [searchValue, setSearchValue] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<'View' | 'Edit' | 'Add'>('View')
  const [formValues, setFormValues] = useState<Branch>({
    id: '',
    name: '',
    mobile: '',
    email: '',
    region_id: '',
    website: '',
    country_id: '',
    tax: '',
    status: ''
  })
  const [errors, setErrors] = useState<Branch>({
    id: '',
    name: '',
    mobile: '',
    email: '',
    region_id: '',
    website: '',
    country_id: '',
    tax: '',
    status: ''
  })

  const branch = useSelector((state: any) => state.branch)
  const countries = useSelector((state: any) => state.country)
  const region = useSelector((state: any) => state.region)

  useEffect(() => {
    dispatch(
      getBranchData({ limit: pageSize, offset: pageSize * page, joins: [{ column: 'Country' }, { column: 'Region' }] })
    )
    dispatch(getCountriesData({}))
    dispatch(getRegionData({}))
  }, [pageSize, page])

  const handleOpenModal = async (id: string | null, mode: 'View' | 'Edit' | 'Add') => {
    let rowData = undefined
    if (id) {
      rowData = branch?.rows?.find((row: Branch) => row.id == id) as unknown as Branch
    }

    setFormValues(
      rowData
        ? {
            id: rowData.id,
            name: rowData.name,
            mobile: rowData.mobile,
            email: rowData.email,
            website: rowData.website,
            region_id: rowData.region.region_id,
            country_id: rowData.country.country_id,
            tax: rowData.tax,
            status: rowData.status
          }
        : {
            id: '',
            name: '',
            mobile: '',
            email: '',
            website: '',
            region_id: '',
            country_id: '',
            tax: '',
            status: ''
          }
    )
    setModalMode(mode)
    setModalOpen(true)
  }

  const handleCloseModal = () => {
    setModalOpen(false)
    setErrors({
      id: '',
      name: '',
      mobile: '',
      email: '',
      website: '',
      region_id: '',
      country_id: '',
      tax: '',
      status: ''
    }) // Reset errors
  }

  const handleSubmit = async () => {
    const data = []
    const validationErrors: Branch = {
      id: '',
      name: '',
      mobile: '',
      email: '',
      website: '',
      region_id: '',
      country_id: '',
      tax: '',
      status: ''
    }
    let isValid = true

    // Validation logic
    for (let i in validationErrors) {
      if (i == 'id') {
        continue
      }
      if (!formValues[i]) {
        validationErrors[i] = `Valid ${i} is required`
        isValid = false
      }
    }

    if (!isValid) {
      setErrors(validationErrors)

      return
    }

    try {
      if (modalMode == 'Edit') {
        formValues.tax = Number(formValues.tax)
        const res = await dispatch(updateBranchData({ data: formValues, where: { id: formValues.id } }))
        if (res.error) {
          toast.error(`failed to update branch Try Again!`)

          return
        }
        await dispatch(
          getBranchData({
            limit: pageSize,
            offset: pageSize * page,
            joins: [{ column: 'Country' }, { column: 'Region' }]
          })
        )
        toast.success('Branch updated successfully')
        handleCloseModal()

        return
      }
      delete formValues.id
      formValues.tax = Number(formValues.tax)
      data.push(formValues)
      console.log(data)
      const res = await dispatch(createBranchData(data))
      if (res.error) {
        toast.error(`failed to create branch Try Again!`)

        return
      }
      await dispatch(
        getBranchData({
          limit: pageSize,
          offset: pageSize * page,
          joins: [{ column: 'Country' }, { column: 'Region' }]
        })
      )
      toast.success(`Branch created successfully`)
    } catch (error) {
      console.log(error)
      toast.error(`failed to create branch Try Again!`)
    }
    handleCloseModal()
  }

  const handleDelete = (id: number) => {
    // setData(prevData => prevData.filter(row => row.id !== id));
  }

  const onClearSearch = async () => {
    setSearchValue('')
    await dispatch(getBranchData({ limit: pageSize, offset: pageSize * page, joins: [{ column: 'Country' }] }))
  }
  const handleSearch = async () => {
    const query = []
    if (searchValue != '') {
      query.push({
        column: 'branchs.name',
        operator: 'like',
        value: `%${searchValue}%`
      })
      query.push({
        column: 'branchs.phone',
        operator: 'like',
        value: `%${searchValue}%`
      })
      query.push({
        column: 'branchs.email',
        operator: 'like',
        value: `%${searchValue}%`
      })
      query.push({
        column: '"Country"."name"',
        operator: 'like',
        value: `%${searchValue}%`
      })
    }
    await dispatch(
      getBranchData({ limit: pageSize, offset: pageSize * page, where: query, joins: [{ column: 'Country' }] })
    )
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <DataGridTable
            loading={branch?.loading}
            checkBox={false}
            rows={branch.rows}
            columns={columns}
            total={branch.count}
            pageSize={pageSize}
            changePageSize={(newPageSize: number) => setPageSize(newPageSize)}
            changePage={(newPage: number) => setPage(newPage)}
            searchValue={searchValue}
            onSearchChange={e => setSearchValue(e.target.value)}
            onSearch={handleSearch}
            onClearSearch={onClearSearch}
            onView={id => handleOpenModal(id, 'View')}
            onEdit={id => handleOpenModal(id, 'Edit')}
            onDelete={id => handleDelete(id)}
            onAddRow={() => handleOpenModal(0, 'Add')}
          />
        </Card>
      </Grid>

      <Modal
        width={700}
        isOpen={modalOpen}
        onClose={handleCloseModal}
        title={`${modalMode} Branch`}
        onSubmit={handleSubmit}
        mode={modalMode}
      >
        {
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label='Name'
                value={formValues.name}
                onChange={e => setFormValues({ ...formValues, name: e.target.value })}
                error={!!errors.name}
                helperText={errors.name}
                disabled={modalMode === 'View'}
                margin='normal'
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label='phone'
                placeholder='+country code...'
                value={formValues.mobile}
                onChange={e => setFormValues({ ...formValues, mobile: e.target.value })}
                error={!!errors.mobile}
                helperText={errors.mobile}
                disabled={modalMode === 'View'}
                margin='normal'
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label='Email'
                value={formValues.email}
                onChange={e => setFormValues({ ...formValues, email: e.target.value })}
                error={!!errors.email}
                helperText={errors.email}
                disabled={modalMode === 'View'}
                margin='normal'
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label='Website'
                value={formValues.website}
                onChange={e => setFormValues({ ...formValues, website: e.target.value })}
                error={!!errors.website}
                helperText={errors.website}
                disabled={modalMode === 'View'}
                margin='normal'
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                select
                name='country_id'
                value={formValues.country_id}
                label='Country'
                error={!!errors.country_id}
                helperText={errors.country_id}
                onChange={e => setFormValues({ ...formValues, country_id: e.target.value })}
                disabled={modalMode === 'View'}
                sx={{ mt: 4 }}
              >
                {countries?.rows?.map((items: any) => (
                  <MenuItem key={items.id} value={items.id}>
                    {items.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                select
                name='region_id'
                value={formValues.region_id}
                label='Region'
                error={!!errors.region_id}
                helperText={errors.region_id}
                onChange={e => setFormValues({ ...formValues, region_id: e.target.value })}
                disabled={modalMode === 'View'}
                sx={{ mt: 4 }}
              >
                {region?.rows?.map((items: any) => (
                  <MenuItem key={items.id} value={items.id}>
                    {items.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                select
                name='status'
                value={formValues.status}
                label='Status'
                error={!!errors.status}
                helperText={errors.status}
                onChange={e => setFormValues({ ...formValues, status: e.target.value })}
                disabled={modalMode === 'View'}
                sx={{ mt: 4 }}
              >
                <MenuItem key={uuid()} value='Active'>
                  Active
                </MenuItem>
                <MenuItem key={uuid()} value='inActive'>
                  In Active
                </MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                type='number'
                label='Tax'
                value={formValues.tax}
                onChange={e => setFormValues({ ...formValues, tax: e.target.value })}
                error={!!errors.tax}
                helperText={errors.tax}
                disabled={modalMode === 'View'}
                margin='normal'
              />
            </Grid>
          </Grid>
        }
      </Modal>
    </Grid>
  )
}

export default BranchComponent
