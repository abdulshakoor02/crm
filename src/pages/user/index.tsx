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
import { AppDispatch } from '../../store'

import { getEmployeesData, updateEmployeesData, createEmployeesData } from '../../store/apps/user'
import { getCountriesData } from '../../store/apps/countries'
import { getBranchData } from '../../store/apps/branch'
import { getRoleData } from '../../store/apps/role'
import DataGridTable from '../components/Datagrid'
import Modal from 'src/pages/components/Model/Model'
import uuid from 'react-uuid'
import { appendTenantId } from 'src/pages/utils/tenantAppend'

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
        {params?.row?.country?.['country_name']}
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
        {params?.row?.role?.['role_name']}
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
        {params?.row?.branch?.['branch_name']}
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

const UserComponent = () => {
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
  const [errors, setErrors] = useState<User>({
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

  const user = useSelector((state: any) => state.user)
  const countries = useSelector((state: any) => state.country)
  const branch = useSelector((state: any) => state.branch)
  const role = useSelector((state: any) => state.role)

  useEffect(() => {
    dispatch(
      getEmployeesData({
        limit: pageSize,
        offset: pageSize * page,
        joins: [{ column: 'Country' }, { column: 'Role' }, { column: 'Branch' }]
      })
    )
    dispatch(getCountriesData({}))
    dispatch(getBranchData({ joins: [{ column: 'Region' }] }))
    dispatch(getRoleData({}))
  }, [pageSize, page])

  const handleOpenModal = async (id: string | null, mode: 'View' | 'Edit' | 'Add') => {
    let rowData = undefined
    if (id) {
      rowData = user?.rows?.find((row: User) => row.id === id) as unknown as User
    }

    setFormValues(
      rowData
        ? {
            id: rowData.id,
            first_name: rowData.first_name,
            last_name: rowData.last_name,
            password: '',
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
    const data = []

    const validationErrors: User = {
      first_name: '',
      last_name: '',
      password: '',
      phone: '',
      email: '',
      role_id: '',
      branch_id: '',
      country_id: '',
      status: ''
    }
    let isValid = true

    // Validation logic
    for (const i in validationErrors) {
      if (!formValues[i as keyof User]) {
        validationErrors[i as keyof User] = `Valid ${i} is required`
        isValid = false
      }
    }

    if (!isValid) {
      setErrors(validationErrors)

      return
    }
    try {
      if (modalMode == 'Edit') {
        const res = await dispatch(updateEmployeesData({ data: formValues, where: { id: formValues.id } }))
        if (res.error) {
          toast.error(`failed to update user Try Again!`)

          return
        }
        await dispatch(
          getEmployeesData({
            limit: pageSize,
            offset: pageSize * page,
            joins: [{ column: 'Country' }, { column: 'Role' }, { column: 'Branch' }]
          })
        )
        toast.success('User updated successfully')
        handleCloseModal()

        return
      }
      appendTenantId(formValues)
      data.push(formValues)
      const res = await dispatch(createEmployeesData(data))
      if (res.error) {
        toast.error(`failed to create user Try Again!`)

        return
      }
      await dispatch(
        getEmployeesData({
          limit: pageSize,
          offset: pageSize * page,
          joins: [{ column: 'Country' }, { column: 'Role' }, { column: 'Branch' }]
        })
      )
      toast.success(`User created successfully`)
    } catch (error) {
      console.log(error)
      toast.error(`failed to create user Try Again!`)
    }
    handleCloseModal()
  }

  const handleDelete = (id: number) => {
    // setData(prevData => prevData.filter(row => row.id !== id));
  }

  const onClearSearch = async () => {
    setSearchValue('')
    const query: any = []
    await dispatch(
      getEmployeesData({ limit: pageSize, offset: pageSize * page, where: query, joins: [{ column: 'Country' }] })
    )
  }
  const handleSearch = async () => {
    const query: any = []
    if (searchValue != '') {
      query.push({
        column: 'employees.first_name',
        operator: 'like',
        value: `%${searchValue}%`
      })
      query.push({
        column: 'employees.last_name',
        operator: 'like',
        value: `%${searchValue}%`
      })
      query.push({
        column: 'employees.phone',
        operator: 'like',
        value: `%${searchValue}%`
      })
      query.push({
        column: 'employees.email',
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
      getEmployeesData({ limit: pageSize, offset: pageSize * page, where: query, joins: [{ column: 'Country' }] })
    )
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <DataGridTable
            loading={user?.loading}
            checkBox={false}
            rows={user.rows}
            columns={columns}
            total={user.count}
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
            <Grid item xs={6}>
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
            <Grid item xs={6}>
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
            <Grid item xs={12}>
              <TextField
                fullWidth
                type='password'
                label='Password'
                value={formValues.password}
                onChange={e => setFormValues({ ...formValues, password: e.target.value })}
                error={!!errors.password}
                helperText={errors.password}
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
                sx={{ mt: 4 }}
              >
                {role?.rows?.map((items: any) => (
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
                name='branch_id'
                value={formValues.branch_id}
                label='Branch'
                error={!!errors.branch_id}
                helperText={errors.branch_id}
                onChange={e => setFormValues({ ...formValues, branch_id: e.target.value })}
                disabled={modalMode === 'View'}
                sx={{ mt: 4 }}
              >
                {branch?.rows?.map((items: any) => (
                  <MenuItem key={items.id} value={items.id}>
                    {items.name}
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

export default UserComponent
