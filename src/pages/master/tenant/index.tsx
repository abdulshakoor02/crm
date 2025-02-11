// ** MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import { useTheme } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import { MenuItem, TextField, Button } from '@mui/material'
import { GridColumns, GridRenderCellParams } from '@mui/x-data-grid'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { styled } from '@mui/material/styles'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import axios from 'src/store/axios'

// ** Store Imports
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '../../../store'

import { getTenantData, createTenantData, updateTenantData } from '../../../store/apps/tenant'
import { getCountriesData } from '../../../store/apps/countries'
import DataGridTable from 'src/components/Datagrid'
import Modal from 'src/components/Model/Model'
import uuid from 'react-uuid'
// import { Tenant } from 'src/types/components/tenant.types'
import { validateFormValues } from 'src/validation/validation'

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1
})

type Tenant = {
  id: string
  name: string
  phone: string
  email: string
  website: string
  country_id: string
  status: string
  logo?: string
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
        {params?.row?.['phone']}
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
    field: 'country',
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
    field: 'status',
    headerName: 'Status',
    renderCell: (params: GridRenderCellParams) => (
      <Typography variant='body2' sx={{ color: 'text.primary' }}>
        {params?.row?.['status']}
      </Typography>
    )
  }
]

const TenantComponent = () => {
  const theme = useTheme()
  const dispatch = useDispatch<AppDispatch>()
  const [pageSize, setPageSize] = useState<number>(10)
  const [page, setPage] = useState<number>(0)
  const [searchValue, setSearchValue] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [file, setFile] = useState<any>()
  const [modalMode, setModalMode] = useState<'View' | 'Edit' | 'Add'>('View')
  const [formValues, setFormValues] = useState<Tenant>({
    id: '',
    name: '',
    phone: '',
    email: '',
    website: '',
    country_id: '',
    status: ''
  })
  const [errors, setErrors] = useState<Partial<Tenant>>({
    id: '',
    name: '',
    phone: '',
    email: '',
    website: '',
    country_id: '',
    status: ''
  })

  const tenant = useSelector((state: RootState) => state.tenant)
  const countries = useSelector((state: RootState) => state.country)

  useEffect(() => {
    dispatch(getTenantData({ limit: pageSize, offset: pageSize * page, joins: [{ column: 'Country' }] }))
    dispatch(getCountriesData({}))
  }, [pageSize, page])

  const handleLogo = async () => {
    const resp = await axios.post(`${process.env.baseUrl}/fileDownload`, { url: formValues.logo })

    // Create a URL for the blob data
    const url = window.URL.createObjectURL(new Blob([resp.data]))

    // Create a link element to download the image
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', 'image.jpg') // Specify the file name
    document.body.appendChild(link)
    link.click()
    link.remove()
  }

  const handleOpenModal = async (id: string | null, mode: 'View' | 'Edit' | 'Add') => {
    let rowData = undefined
    if (id) {
      rowData = tenant?.rows?.find((row: Tenant) => row.id === id) as unknown as Tenant
    }

    setFormValues(
      rowData
        ? {
            id: rowData.id,
            name: rowData.name,
            phone: rowData.phone,
            email: rowData.email,
            website: rowData.website,
            country_id: rowData.country_id,
            status: rowData.status,
            logo: rowData.logo
          }
        : {
            id: '',
            name: '',
            phone: '',
            email: '',
            website: '',
            country_id: '',
            status: ''
          }
    )
    setModalMode(mode)
    setModalOpen(true)
  }

  const handleFileChange = (event: any) => {
    setFile(event.target.files)
  }

  const handleCloseModal = () => {
    setModalOpen(false)
    setErrors({ id: '', name: '', phone: '', email: '', website: '', country_id: '', status: '' }) // Reset errors
  }

  const handleSubmit = async () => {
    const data = []

    const validationRules: Partial<Record<keyof Tenant, string>> = {
      id: 'Id is required',
      name: 'Name is required',
      phone: 'Valid phone number is required',
      email: 'Email is required',
      website: 'Website is required',
      country_id: 'Country is required',
      status: 'Status is required'
    }

    const { hasError, errors: validationErrors } = validateFormValues(formValues, validationRules)
    if (hasError) {
      setErrors(validationErrors) // Update the errors state
      return
    }

    // const validationErrors: Tenant = { id: '', name: '', phone: '', email: '', website: '', country_id: '', status: '' }
    // let isValid = true

    // // Validation logic
    // for (let i in validationErrors) {
    //   if (!formValues[i]) {
    //     validationErrors[i] = `Valid ${i} is required`
    //     isValid = false
    //   }
    // }

    // if (!isValid) {
    //   setErrors(validationErrors)

    //   return
    // }

    try {
      if (modalMode == 'Edit') {
        const res = await dispatch(updateTenantData({ data: formValues, where: { id: formValues.id } }))
        if (res.error) {
          toast.error(`failed to update tenant Try Again!`)

          return
        }
        if (file[0]) {
          const formdata = new FormData()
          formdata.append('file', file[0])
          try {
            console.log(formValues.id)
            const response = await axios.post(`${process.env.baseUrl}/fileUpload`, formdata, {
              headers: {
                'Content-Type': 'multipart/form-data',
                filename: file[0].name,
                folder: 'crm',
                tenant_id: formValues.id
              }
            })
            toast.success('file uploaded successfully')
          } catch (error) {
            toast.error('failed to uplaod the file')
          }
        }

        await dispatch(getTenantData({ limit: pageSize, offset: pageSize * page, joins: [{ column: 'Country' }] }))

        toast.success('Tenant updated successfully')
        handleCloseModal()

        return
      }
      data.push(formValues)
      const res = await dispatch(createTenantData(data))
      if (res.error) {
        toast.error(`failed to create tenant Try Again!`)

        return
      }
      await dispatch(getTenantData({ limit: pageSize, offset: pageSize * page, joins: [{ column: 'Country' }] }))
      toast.success(`Tenant created successfully`)
    } catch (error) {
      console.log(error)
      toast.error(`failed to create tenant Try Again!`)
    }

    // handleCloseModal()
  }

  const handleDelete = (id: number) => {
    // setData(prevData => prevData.filter(row => row.id !== id));
  }

  const onClearSearch = async () => {
    setSearchValue('')
    await dispatch(getTenantData({ limit: pageSize, offset: pageSize * page, joins: [{ column: 'Country' }] }))
  }
  const handleSearch = async () => {
    const query = []
    if (searchValue != '') {
      query.push({
        column: 'tenants.name',
        operator: 'like',
        value: `%${searchValue}%`
      })
      query.push({
        column: 'tenants.phone',
        operator: 'like',
        value: `%${searchValue}%`
      })
      query.push({
        column: 'tenants.email',
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
      getTenantData({ limit: pageSize, offset: pageSize * page, where: query, joins: [{ column: 'Country' }] })
    )
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <DataGridTable
            loading={tenant?.loading}
            checkBox={false}
            rows={tenant.rows}
            columns={columns}
            total={tenant.count}
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
            onAddRow={() => handleOpenModal('', 'Add')}
          />
        </Card>
      </Grid>

      <Modal
        width={700}
        isOpen={modalOpen}
        onClose={handleCloseModal}
        title={`${modalMode} Tenant`}
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
                value={formValues.phone}
                onChange={e => setFormValues({ ...formValues, phone: e.target.value })}
                error={!!errors.phone}
                helperText={errors.phone}
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
                  <MenuItem key={uuid()} value={items.id}>
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
              <Button
                component='label'
                role={undefined}
                variant='contained'
                tabIndex={-1}
                startIcon={<CloudUploadIcon />}
              >
                Upload files
                <VisuallyHiddenInput type='file' onChange={handleFileChange} />
              </Button>
            </Grid>
            <Grid item xs={6}>
              {formValues.logo !== '' && <Button onClick={handleLogo}>Download Logo</Button>}
            </Grid>
          </Grid>
        }
      </Modal>
    </Grid>
  )
}

export default TenantComponent
