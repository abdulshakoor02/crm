'use client';
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
import { RootState, AppDispatch } from '../../../store'

import { getRoleData, createRoleData, updateRoleData } from '../../../store/apps/role'
import { getFeaturesData } from '../../../store/apps/feature'
import DataGridTable from 'src/components/Datagrid'
import Modal from 'src/components/Model/Model'
import RoleCard from 'src/components/RoleCard' // Ensure this path is correct
import PageHeader from 'src/@core/components/page-header' // Ensure this path is correct
import { appendTenantId } from 'src/utils/tenantAppend'
import { checkAccess } from 'src/utils/accessCheck'

type Role = {
  id?: string;
  name: string;
  created_by?: string;
  modified_by?: string;
  tenant_id?: string;
  status: string;
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

export default function RolePage() { // Renamed component
  const dispatch = useDispatch<AppDispatch>()
  const [pageSize, setPageSize] = useState<number>(10)
  const [page, setPage] = useState<number>(0)
  const [searchValue, setSearchValue] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<'View' | 'Edit' | 'Add'>('View')
  const [formValues, setFormValues] = useState<Role>({
    id: undefined,
    name: '',
    status: 'Active', // Default status
    tenant_id: undefined
  })
  const [errors, setErrors] = useState<Partial<Role>>({})

  const role = useSelector((state: RootState) => state.role)
  const features = useSelector((state: RootState) => state.features)

  useEffect(() => {
    dispatch(getRoleData({ limit: pageSize, offset: pageSize * page, where: { name: searchValue } }))
    dispatch(getFeaturesData({ orderBy: 'name' })) // Keep this if RoleCard needs all features
  }, [pageSize, page, dispatch, searchValue]) // Added dispatch and searchValue

  const handleOpenModal = async (id: string | null, mode: 'View' | 'Edit' | 'Add') => {
    let rowData: Role | undefined = undefined;
    if (id) {
      rowData = role?.rows?.find((row: Role) => row.id === id);
    }

    setFormValues(
      rowData
        ? {
            id: rowData.id,
            name: rowData.name,
            status: rowData.status,
            tenant_id: rowData.tenant_id
          }
        : {
            id: undefined,
            name: '',
            status: 'Active',
            tenant_id: undefined
          }
    )
    setModalMode(mode)
    setModalOpen(true)
  }

  const handleCloseModal = () => {
    setModalOpen(false)
    setErrors({})
  }

  const handleSubmit = async () => {
    const validationErrors: Partial<Role> = {}
    let isValid = true

    if (!formValues.name) { validationErrors.name = 'Name is required'; isValid = false; }
    if (!formValues.status) { validationErrors.status = 'Status is required'; isValid = false; }

    if (!isValid) {
      setErrors(validationErrors)
      return
    }

    const dataToSubmit = { ...formValues };

    try {
      if (modalMode === 'Edit' && dataToSubmit.id) {
        const { tenant_id, created_by, modified_by, ...updateData } = dataToSubmit;
        await dispatch(updateRoleData({ data: updateData, where: { id: dataToSubmit.id } })).unwrap()
        toast.success('Role updated successfully')
      } else if (modalMode === 'Add') {
        let { id, tenant_id, created_by, modified_by, ...addData } = dataToSubmit;
        addData = appendTenantId(addData) as Omit<Role, 'id' | 'created_by' | 'modified_by' | 'tenant_id'>;
        await dispatch(createRoleData([addData] as Role[])).unwrap()
        toast.success(`Role created successfully`)
      }

      dispatch(getRoleData({ limit: pageSize, offset: pageSize * page, where: { name: searchValue } }))
    } catch (error: any) {
      console.error(error)
      toast.error(error.message || `Failed to ${modalMode.toLowerCase()} Role. Try Again!`)
    } finally {
      handleCloseModal()
    }
  }

  const handleDelete = (id: string) => {
    console.log("Delete Role with ID:", id)
    // Implement delete logic here
  }

  const onClearSearch = async () => {
    setSearchValue('')
    if (page !== 0) setPage(0);
    dispatch(getRoleData({ limit: pageSize, offset: 0 }))
  }

  const handleSearch = async () => {
    if (page !== 0) setPage(0);
    const whereClause = searchValue ? { name: searchValue } : {};
    dispatch(getRoleData({ limit: pageSize, offset: 0, where: whereClause }))
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
            rows={role?.rows || []}
            columns={columns}
            total={role?.count || 0}
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
            onView={(id: string) => handleOpenModal(id, 'View')}
            onEdit={(id: string) => handleOpenModal(id, 'Edit')}
            onDelete={(id: string) => handleDelete(id)}
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
                margin='normal'
                sx={{ mt: modalMode === 'View' ? 0 : 2.5 }}
              >
                <MenuItem value='Active'>Active</MenuItem>
                <MenuItem value='inActive'>In Active</MenuItem>
              </TextField>
            </Grid>
          </Grid>
        }
      </Modal>
    </Grid>
  )
}
