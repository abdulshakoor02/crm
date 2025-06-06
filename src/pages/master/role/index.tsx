// ** MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import { MenuItem, TextField } from '@mui/material'
import { GridColumns, GridRenderCellParams } from '@mui/x-data-grid'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

// ** Store Imports
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch } from '../../../store'

import { getRoleData, createRoleData, updateRoleData } from '../../../store/apps/role'
import { getFeaturesData } from '../../../store/apps/feature'
import DataGridTable from 'src/components/Datagrid'
import Modal from 'src/components/Model/Model'
import RoleCard from 'src/components/RoleCard'
import PageHeader from 'src/@core/components/page-header'
import { appendTenantId } from 'src/utils/tenantAppend'
import { checkAccess } from 'src/utils/accessCheck'

type Role = {
  id?: string
  name: string
  created_by?: string
  modified_by?: string
  tenant_id?: string
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
    field: 'status',
    headerName: 'Status',
    renderCell: (params: GridRenderCellParams) => (
      <Typography variant='body2' sx={{ color: 'text.primary' }}>
        {params?.row?.['status']}
      </Typography>
    )
  }
]

const RoleComponent = () => {
  const dispatch = useDispatch<AppDispatch>()
  const [pageSize, setPageSize] = useState<number>(10)
  const [page, setPage] = useState<number>(0)
  const [searchValue, setSearchValue] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<'View' | 'Edit' | 'Add'>('View')
  const [formValues, setFormValues] = useState<Role>({
    name: '',
    status: ''
  })
  const [errors, setErrors] = useState<Role>({
    name: '',
    status: ''
  })

  const role = useSelector((state: any) => state.role)
  const features = useSelector((state: any) => state.features)

  useEffect(() => {
    dispatch(getRoleData({ limit: pageSize, offset: pageSize * page }))
    dispatch(getFeaturesData({ orderBy: 'name' }))
  }, [pageSize, page])

  const handleOpenModal = async (id: string | null, mode: 'View' | 'Edit' | 'Add') => {
    let rowData = undefined
    if (id) {
      rowData = role?.rows?.find((row: Role) => row.id === id) as unknown as Role
    }

    setFormValues(
      rowData
        ? {
            id: rowData.id,
            name: rowData.name,
            status: rowData.status
          }
        : {
            name: '',
            status: ''
          }
    )
    setModalMode(mode)
    setModalOpen(true)
  }

  const handleCloseModal = () => {
    setModalOpen(false)
    setErrors({
      name: '',
      status: ''
    }) // Reset errors
  }

  const handleSubmit = async () => {
    const data = []
    const validationErrors: Role = {
      name: '',
      status: ''
    }
    let isValid = true

    // Validation logic
    for (const i in validationErrors) {
      if (!formValues[i as keyof Role]) {
        validationErrors[i as keyof Role] = `Valid ${i} is required`
        isValid = false
      }
    }

    if (!isValid) {
      setErrors(validationErrors)

      return
    }
    try {
      if (modalMode == 'Edit') {
        const res = await dispatch(updateRoleData({ data: formValues, where: { id: formValues.id } }))
        if (res.error) {
          toast.error(`failed to update Role Try Again!`)

          return
        }
        await dispatch(getRoleData({ limit: pageSize, offset: pageSize * page }))
        toast.success('Role updated successfully')
        handleCloseModal()

        return
      }
      appendTenantId(formValues)
      data.push(formValues)
      const res = await dispatch(createRoleData(data))
      if (res.error) {
        toast.error(`failed to create role Try Again!`)

        return
      }
      await dispatch(getRoleData({ limit: pageSize, offset: pageSize * page }))
      toast.success(`Role created successfully`)
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
    await dispatch(getRoleData({ limit: pageSize, offset: pageSize * page }))
  }
  const handleSearch = async () => {
    if (searchValue != '') {
      await dispatch(getRoleData({ limit: pageSize, offset: pageSize * page, where: { name: searchValue } }))
    }
  }

  return (
    <Grid container spacing={6}>
      <PageHeader
        title={<Typography variant='h5'>Roles List</Typography>}
        subtitle={
          <Typography variant='body2'>
            A role provided access to predefined menus and features so that depending on assigned role an administrator
            can have access to what he need
          </Typography>
        }
      />
      <Grid item xs={12} sx={{ mb: 4 }}>
        <RoleCard role={role} features={features} />
      </Grid>

      <Grid item xs={12}>
        <Card>
          <DataGridTable
            loading={role?.loading}
            checkBox={false}
            rows={role?.rows}
            columns={columns}
            total={role?.count}
            pageSize={pageSize}
            changePageSize={(newPageSize: number) => setPageSize(newPageSize)}
            changePage={(newPage: number) => setPage(newPage)}
            searchValue={searchValue}
            onSearchChange={e => setSearchValue(e.target.value)}
            onSearch={handleSearch}
            onClearSearch={onClearSearch}
            edit={checkAccess('roleEdit')}
            view={checkAccess('roleView')}
            del={checkAccess('roleDelete')}
            add={checkAccess('roleCreate')}
            onView={id => handleOpenModal(id, 'View')}
            onEdit={id => handleOpenModal(id, 'Edit')}
            onDelete={id => handleDelete(id)}
            onAddRow={() => handleOpenModal(null, 'Add')}
          />
        </Card>
      </Grid>

      <Modal
        width={700}
        isOpen={modalOpen}
        onClose={handleCloseModal}
        title={`${modalMode} Role`}
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
                <MenuItem key='Active' value='Active'>
                  Active
                </MenuItem>
                <MenuItem key='inActive' value='inActive'>
                  In Active
                </MenuItem>
              </TextField>
            </Grid>
          </Grid>
        }
      </Modal>
    </Grid>
  )
}

export default RoleComponent
