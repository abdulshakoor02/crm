'use client';
// ** MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import { useTheme } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import { MenuItem, TextField } from '@mui/material' // Combined TextField import
import { GridColumns, GridRenderCellParams } from '@mui/x-data-grid'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

// ** Store Imports
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '../../store' // Added RootState import

import { getEmployeesData, updateEmployeesData, createEmployeesData } from '../../store/apps/user'
import { getCountriesData } from '../../store/apps/countries'
import { getBranchData } from '../../store/apps/branch'
import { getRoleData } from '../../store/apps/role'
import DataGridTable from 'src/components/Datagrid'
import Modal from 'src/components/Model/Model'
import uuid from 'react-uuid'
import { appendTenantId } from 'src/utils/tenantAppend'
import { checkAccess } from 'src/utils/accessCheck'

type User = {
  id?: string
  first_name: string
  last_name: string
  password?: string
  phone: string
  email: string
  country_id: string
  created_by?: string
  modified_by?: string
  role_id: string
  branch_id: string
  tenant_id?: string
  status: string
}

const columns: GridColumns = [
  {
    flex: 0.1,
    minWidth: 150,
    sortable: false,
    field: 'first_name',
    headerName: 'First Name',
    renderCell: (params: GridRenderCellParams) => (
      <Typography variant='body2' sx={{ color: 'text.primary' }}>
        {params?.row?.['first_name']}
      </Typography>
    )
  },
  {
    flex: 0.1,
    minWidth: 150,
    sortable: false,
    field: 'last_name',
    headerName: 'Last Name',
    renderCell: (params: GridRenderCellParams) => (
      <Typography variant='body2' sx={{ color: 'text.primary' }}>
        {params?.row?.['last_name']}
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
    field: 'country_id',
    headerName: 'Country',
    renderCell: (params: GridRenderCellParams) => (
      <Typography variant='body2' sx={{ color: 'text.primary' }}>
        {params?.row?.country?.['name']} {/* Corrected: was country_name */}
      </Typography>
    )
  },
  {
    flex: 0.1,
    minWidth: 150,
    field: 'role_id',
    headerName: 'Role',
    renderCell: (params: GridRenderCellParams) => (
      <Typography variant='body2' sx={{ color: 'text.primary' }}>
        {params?.row?.role?.['name']} {/* Corrected: was role_name */}
      </Typography>
    )
  },
  {
    flex: 0.1,
    minWidth: 150,
    field: 'branch_id',
    headerName: 'Branch',
    renderCell: (params: GridRenderCellParams) => (
      <Typography variant='body2' sx={{ color: 'text.primary' }}>
        {params?.row?.branch?.['name']} {/* Corrected: was branch_name */}
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

export default function UserPage() { // Renamed component
  const theme = useTheme()
  const dispatch = useDispatch<AppDispatch>()
  const [pageSize, setPageSize] = useState<number>(10)
  const [page, setPage] = useState<number>(0)
  const [searchValue, setSearchValue] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<'View' | 'Edit' | 'Add'>('View')
  const [formValues, setFormValues] = useState<User>({
    first_name: '',
    last_name: '',
    password: '',
    phone: '',
    email: '',
    country_id: '',
    tenant_id: '',
    role_id: '',
    branch_id: '',
    status: ''
  })
  const [errors, setErrors] = useState<Partial<User>>({ // Changed to Partial<User>
    first_name: '',
    last_name: '',
    password: '',
    phone: '',
    email: '',
    country_id: '',
    role_id: '',
    branch_id: '',
    tenant_id: '',
    status: ''
  })

  const user = useSelector((state: RootState) => state.user) // Used RootState
  const countries = useSelector((state: RootState) => state.country) // Used RootState
  const branch = useSelector((state: RootState) => state.branch) // Used RootState
  const role = useSelector((state: RootState) => state.role) // Used RootState

  useEffect(() => {
    dispatch(
      getEmployeesData({
        limit: pageSize,
        offset: pageSize * page,
        where: {first_name: searchValue}, // Added search value here
        joins: [{ column: 'Country' }, { column: 'Role' }, { column: 'Branch' }]
      })
    )
    dispatch(getCountriesData({}))
    dispatch(getBranchData({ joins: [{ column: 'Region' }] }))
    dispatch(getRoleData({}))
  }, [pageSize, page, dispatch, searchValue]) // Added dispatch and searchValue

  const handleOpenModal = async (id: string | null, mode: 'View' | 'Edit' | 'Add') => {
    let rowData: User | undefined = undefined // Explicitly typed rowData
    if (id) {
      rowData = user?.rows?.find((row: User) => row.id === id)
    }

    setFormValues(
      rowData
        ? {
            id: rowData.id,
            first_name: rowData.first_name,
            last_name: rowData.last_name,
            password: '', // Password should likely not be pre-filled
            phone: rowData.phone,
            email: rowData.email,
            tenant_id: rowData.tenant_id,
            role_id: rowData.role_id,
            branch_id: rowData.branch_id,
            country_id: rowData.country_id,
            status: rowData.status
          }
        : {
            first_name: '',
            last_name: '',
            password: '',
            phone: '',
            email: '',
            country_id: '',
            role_id: '',
            branch_id: '',
            tenant_id: '',
            status: ''
          }
    )
    setModalMode(mode)
    setModalOpen(true)
  }

  const handleCloseModal = () => {
    setModalOpen(false)
    setErrors({
      first_name: '',
      last_name: '',
      password: '',
      phone: '',
      email: '',
      role_id: '',
      branch_id: '',
      tenant_id: '',
      country_id: '',
      status: ''
    }) // Reset errors
  }

  const handleSubmit = async () => {
    const validationErrors: Partial<User> = {} // Changed to Partial<User>
    let isValid = true

    // Basic Validation logic (can be expanded with yup or similar)
    if (!formValues.first_name) { validationErrors.first_name = 'First name is required'; isValid = false; }
    if (!formValues.last_name) { validationErrors.last_name = 'Last name is required'; isValid = false; }
    if (modalMode === 'Add' && !formValues.password) { validationErrors.password = 'Password is required for new users'; isValid = false; }
    if (!formValues.email) { validationErrors.email = 'Email is required'; isValid = false; }
    // Add other necessary validations here for phone, country_id, role_id, branch_id, status

    if (!isValid) {
      setErrors(validationErrors)
      return
    }

    try {
      const dataToSend = { ...formValues };
      if (modalMode === 'Edit' && !dataToSend.password) { // Don't send empty password on edit unless intended
        delete dataToSend.password;
      }

      if (modalMode === 'Edit' && dataToSend.id) {
        const res = await dispatch(updateEmployeesData({ data: dataToSend, where: { id: dataToSend.id } })).unwrap()
        toast.success('User updated successfully')
      } else if (modalMode === 'Add') {
        const dataWithTenant = appendTenantId(dataToSend);
        const res = await dispatch(createEmployeesData([dataWithTenant])).unwrap() // createEmployeesData expects an array
        toast.success(`User created successfully`)
      }

      // Refetch data
      dispatch(
        getEmployeesData({
          limit: pageSize,
          offset: pageSize * page,
          where: {first_name: searchValue}, // Added search value
          joins: [{ column: 'Country' }, { column: 'Role' }, { column: 'Branch' }]
        })
      )
    } catch (error: any) { // Added type for error
      console.error(error)
      toast.error(error.message || `Failed to ${modalMode.toLowerCase()} user. Try Again!`)
    } finally {
      handleCloseModal()
    }
  }

  const handleDelete = (id: string) => { // id is string
    // Implement delete logic here
    console.log("Delete user with ID:", id)
  }

  const onClearSearch = async () => {
    setSearchValue('')
    if (page !== 0) setPage(0);
    dispatch(
      getEmployeesData({ limit: pageSize, offset: 0, joins: [{ column: 'Country' }, { column: 'Role' }, { column: 'Branch' }] }) // Use offset 0
    )
  }
  const handleSearch = async () => {
    if (page !== 0) setPage(0);
    // More robust search query construction needed if searching across multiple fields from a single input
    const whereClause = searchValue ? { first_name: searchValue } : {}; // Example: search by first_name
    dispatch(
      getEmployeesData({ limit: pageSize, offset: 0, where: whereClause, joins: [{ column: 'Country' }, { column: 'Role' }, { column: 'Branch' }] }) // Use offset 0
    )
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <DataGridTable
            loading={user?.loading}
            checkBox={false}
            rows={user.rows || []} // Ensure rows is an array
            columns={columns}
            total={user.count || 0} // Ensure count is a number
            pageSize={pageSize}
            changePageSize={(newPageSize: number) => setPageSize(newPageSize)}
            changePage={(newPage: number) => setPage(newPage)}
            searchValue={searchValue}
            onSearchChange={e => setSearchValue(e.target.value)}
            onSearch={handleSearch}
            onClearSearch={onClearSearch}
            edit={checkAccess('userEdit')}
            view={checkAccess('userView')}
            del={checkAccess('userDelete')}
            add={checkAccess('userCreate')}
            onView={(id: string) => handleOpenModal(id, 'View')}
            onEdit={(id: string) => handleOpenModal(id, 'Edit')}
            onDelete={(id: string) => handleDelete(id)}
            onAddRow={() => handleOpenModal(null, 'Add')}
          />
        </Card>
      </Grid>

      <Modal
        width={800}
        isOpen={modalOpen}
        onClose={handleCloseModal}
        title={`${modalMode} User`}
        onSubmit={handleSubmit}
        mode={modalMode}
      >
        {
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}> {/* Adjusted to sm={6} for two columns */}
              <TextField
                fullWidth
                label='First Name'
                value={formValues.first_name}
                onChange={e => setFormValues({ ...formValues, first_name: e.target.value })}
                error={!!errors.first_name}
                helperText={errors.first_name}
                disabled={modalMode === 'View'}
                margin='normal'
              />
            </Grid>
            <Grid item xs={12} sm={6}> {/* Adjusted to sm={6} for two columns */}
              <TextField
                fullWidth
                label='Last Name'
                value={formValues.last_name}
                onChange={e => setFormValues({ ...formValues, last_name: e.target.value })}
                error={!!errors.last_name}
                helperText={errors.last_name}
                disabled={modalMode === 'View'}
                margin='normal'
              />
            </Grid>
            {modalMode !== 'Edit' && ( // Password field only for Add mode or if explicitly needed in Edit
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  type='password'
                  label='Password'
                  value={formValues.password || ''} // Ensure value is not null/undefined
                  onChange={e => setFormValues({ ...formValues, password: e.target.value })}
                  error={!!errors.password}
                  helperText={errors.password}
                  disabled={modalMode === 'View'}
                  margin='normal'
                />
              </Grid>
            )}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label='Phone'
                placeholder='+country code...'
                value={formValues.phone}
                onChange={e => setFormValues({ ...formValues, phone: e.target.value })}
                error={!!errors.phone}
                helperText={errors.phone}
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
                select
                name='country_id'
                value={formValues.country_id}
                label='Country'
                error={!!errors.country_id}
                helperText={errors.country_id}
                onChange={e => setFormValues({ ...formValues, country_id: e.target.value })}
                disabled={modalMode === 'View'}
                sx={{ mt: modalMode === 'View' ? 0 : 2, mb: modalMode === 'View' ? 0 : 1 }} // Adjusted spacing
              >
                {countries?.rows?.map((item: any) => ( // Changed items to item
                  <MenuItem key={uuid()} value={item.id}>
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
                sx={{ mt: modalMode === 'View' ? 0 : 2, mb: modalMode === 'View' ? 0 : 1 }} // Adjusted spacing
              >
                <MenuItem key={uuid()} value='Active'>
                  Active
                </MenuItem>
                <MenuItem key={uuid()} value='inActive'> {/* Consistent casing */}
                  In Active
                </MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                name='role_id'
                value={formValues.role_id}
                label='Role'
                error={!!errors.role_id}
                helperText={errors.role_id}
                onChange={e => setFormValues({ ...formValues, role_id: e.target.value })}
                disabled={modalMode === 'View'}
                sx={{ mt: modalMode === 'View' ? 0 : 2, mb: modalMode === 'View' ? 0 : 1 }} // Adjusted spacing
              >
                {role?.rows?.map((item: any) => ( // Changed items to item
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
                name='branch_id'
                value={formValues.branch_id}
                label='Branch'
                error={!!errors.branch_id}
                helperText={errors.branch_id}
                onChange={e => setFormValues({ ...formValues, branch_id: e.target.value })}
                disabled={modalMode === 'View'}
                sx={{ mt: modalMode === 'View' ? 0 : 2, mb: modalMode === 'View' ? 0 : 1 }} // Adjusted spacing
              >
                {branch?.rows?.map((item: any) => ( // Changed items to item
                  <MenuItem key={item.id} value={item.id}>
                    {item.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>
        }
      </Modal>
    </Grid>
  )
}
