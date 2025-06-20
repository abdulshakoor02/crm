'use client';
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
import { AppDispatch, RootState } from '../../../store' // Corrected RootState import

import { getBranchData, createBranchData, updateBranchData } from '../../../store/apps/branch'
import { getCountriesData } from '../../../store/apps/countries'
import { getRegionData } from '../../../store/apps/region'
import DataGridTable from 'src/components/Datagrid'
import Modal from 'src/components/Model/Model'
import uuid from 'react-uuid' // Keep for MenuItems if no other stable key source
import { checkAccess } from 'src/utils/accessCheck'
// import { setFlagsFromString } from 'v8' // This import seems unused, removing

type Branch = {
  id?: string // id can be optional for new entries
  name: string
  mobile: string
  email: string
  region_id: string
  website: string
  country_id: string
  tax: string | number // tax can be string or number
  address: string
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
    flex: 0.2,
    minWidth: 200,
    field: 'address',
    headerName: 'Address',
    renderCell: (params: GridRenderCellParams) => (
      <Typography variant='body2' sx={{ color: 'text.primary', whiteSpace: 'pre-line' }}>
        {params?.row?.['address']}
      </Typography>
    )
  },
  {
    flex: 0.1,
    minWidth: 150,
    field: 'mobile', // Corrected field name from 'phone' to 'mobile'
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
        {params?.row?.country?.['name']} {/* Assuming 'name' */}
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
        {params?.row?.region?.['name']} {/* Assuming 'name' */}
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

export default function BranchPage() { // Renamed component
  const theme = useTheme()
  const dispatch = useDispatch<AppDispatch>()
  const [pageSize, setPageSize] = useState<number>(10)
  const [page, setPage] = useState<number>(0)
  const [searchValue, setSearchValue] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<'View' | 'Edit' | 'Add'>('View')
  const [formValues, setFormValues] = useState<Branch>({
    id: undefined, // id is optional for new entries
    name: '',
    mobile: '',
    email: '',
    region_id: '',
    website: '',
    country_id: '',
    address: '',
    tax: '', // Initialize tax as string, convert to number on submit
    status: ''
  })
  const [errors, setErrors] = useState<Partial<Branch>>({}) // Initialize as empty object

  const branch = useSelector((state: RootState) => state.branch)
  const countries = useSelector((state: RootState) => state.country)
  const region = useSelector((state: RootState) => state.region)

  useEffect(() => {
    dispatch(
      getBranchData({
        limit: pageSize,
        offset: pageSize * page,
        where: { name: searchValue }, // Basic search by name
        joins: [{ column: 'Country' }, { column: 'Region' }]
      })
    )
    dispatch(getCountriesData({}))
    dispatch(getRegionData({}))
  }, [pageSize, page, dispatch, searchValue]) // Added dispatch and searchValue

  const handleOpenModal = async (id: string | null, mode: 'View' | 'Edit' | 'Add') => {
    let rowData: Branch | undefined = undefined
    if (id) {
      rowData = branch?.rows?.find((row: Branch) => row.id === id)
    }

    setFormValues(
      rowData
        ? {
            id: rowData.id,
            name: rowData.name,
            mobile: rowData.mobile,
            email: rowData.email,
            website: rowData.website,
            region_id: rowData.region_id, // Assuming region_id is directly available
            country_id: rowData.country_id, // Assuming country_id is directly available
            address: rowData.address,
            tax: String(rowData.tax), // Ensure tax is string for form
            status: rowData.status
          }
        : {
            id: undefined,
            name: '',
            mobile: '',
            email: '',
            website: '',
            region_id: '',
            country_id: '',
            address: '',
            tax: '',
            status: 'Active' // Default status for new entries
          }
    )
    setModalMode(mode)
    setModalOpen(true)
  }

  const handleCloseModal = () => {
    setModalOpen(false)
    setErrors({}) // Reset errors
  }

  const handlePaste = (event: React.ClipboardEvent<HTMLDivElement>) => { // Typed event
    const pasteText = event.clipboardData.getData('text')
    setFormValues({ ...formValues, address: formValues.address + pasteText })
    event.preventDefault()
  }

  const handleSubmit = async () => {
    const validationErrors: Partial<Branch> = {}
    let isValid = true

    // Basic Validation
    if (!formValues.name) { validationErrors.name = 'Name is required'; isValid = false; }
    if (!formValues.mobile) { validationErrors.mobile = 'Mobile is required'; isValid = false; }
    if (!formValues.email) { validationErrors.email = 'Email is required'; isValid = false; }
    // Add other necessary validations

    if (!isValid) {
      setErrors(validationErrors)
      return
    }

    const dataToSend: Branch = {
      ...formValues,
      tax: Number(formValues.tax) // Convert tax to number before sending
    };

    try {
      if (modalMode === 'Edit' && dataToSend.id) {
        await dispatch(updateBranchData({ data: dataToSend, where: { id: dataToSend.id } })).unwrap()
        toast.success('Branch updated successfully')
      } else if (modalMode === 'Add') {
        const { id, ...addData } = dataToSend; // Remove id for creation
        await dispatch(createBranchData([addData] as Branch[])).unwrap(); // createBranchData expects an array
        toast.success(`Branch created successfully`)
      }

      // Refetch data
      dispatch(
        getBranchData({
          limit: pageSize,
          offset: pageSize * page,
          where: { name: searchValue },
          joins: [{ column: 'Country' }, { column: 'Region' }]
        })
      )
    } catch (error: any) {
      console.error(error)
      toast.error(error.message || `Failed to ${modalMode.toLowerCase()} branch. Try Again!`)
    } finally {
      handleCloseModal()
    }
  }

  const handleDelete = (id: string) => { // id is string
    console.log("Delete branch with ID:", id)
    // Implement delete logic here if needed
  }

  const onClearSearch = async () => {
    setSearchValue('')
    if (page !== 0) setPage(0);
    dispatch(getBranchData({ limit: pageSize, offset: 0, joins: [{ column: 'Country' }, { column: 'Region' }] }))
  }

  const handleSearch = async () => {
    if (page !== 0) setPage(0);
    const whereClause = searchValue ? { name: searchValue } : {}; // Example: search by name
    dispatch(
      getBranchData({ limit: pageSize, offset: 0, where: whereClause, joins: [{ column: 'Country' }, {column: 'Region'}] })
    )
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <DataGridTable
            loading={branch?.loading}
            checkBox={false}
            rows={branch.rows || []}
            columns={columns}
            total={branch.count || 0}
            pageSize={pageSize}
            changePageSize={(newPageSize: number) => setPageSize(newPageSize)}
            changePage={(newPage: number) => setPage(newPage)}
            searchValue={searchValue}
            onSearchChange={e => setSearchValue(e.target.value)}
            onSearch={handleSearch}
            onClearSearch={onClearSearch}
            edit={checkAccess('branchEdit')}
            view={checkAccess('branchView')}
            del={checkAccess('branchDelete')}
            add={checkAccess('branchCreate')}
            onView={(id: string) => handleOpenModal(id, 'View')}
            onEdit={(id: string) => handleOpenModal(id, 'Edit')}
            onDelete={(id: string) => handleDelete(id)}
            onAddRow={() => handleOpenModal(null, 'Add')} // Pass null for new row
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
            <Grid item xs={12} sm={6}>
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
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label='Phone'
                placeholder='+country code...'
                value={formValues.mobile}
                onChange={e => setFormValues({ ...formValues, mobile: e.target.value })}
                error={!!errors.mobile}
                helperText={errors.mobile}
                disabled={modalMode === 'View'}
                margin='normal'
              />
            </Grid>
            <Grid item xs={12} sm={6}>
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
            <Grid item xs={12} sm={6}>
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
            <Grid item xs={12} sm={6}>
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
                sx={{ mt: 2, mb: 1 }}
              >
                {countries?.rows?.map((item: any) => (
                  <MenuItem key={item.id} value={item.id}>
                    {item.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
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
                sx={{ mt: 2, mb: 1 }}
              >
                {region?.rows?.map((item: any) => (
                  <MenuItem key={item.id} value={item.id}>
                    {item.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
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
                sx={{ mt: 2, mb: 1 }}
              >
                <MenuItem value='Active'> {/* Removed uuid key for static items */}
                  Active
                </MenuItem>
                <MenuItem value='inActive'> {/* Removed uuid key for static items */}
                  In Active
                </MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
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
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3} // Added rows for better multiline experience
                label='Address'
                value={formValues.address}
                onPaste={handlePaste}
                onChange={e => setFormValues({ ...formValues, address: e.target.value })}
                error={!!errors.address}
                helperText={errors.address}
                disabled={modalMode === 'View'}
                margin='dense'
              />
            </Grid>
          </Grid>
        }
      </Modal>
    </Grid>
  )
}
