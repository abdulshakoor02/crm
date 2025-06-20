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

import { getRegionData, createRegionData, updateRegionData } from '../../../store/apps/region'
import DataGridTable from 'src/components/Datagrid'
import Modal from 'src/components/Model/Model'
import { appendTenantId } from 'src/utils/tenantAppend'
import { checkAccess } from 'src/utils/accessCheck'

type Region = {
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

export default function RegionPage() { // Renamed component
  const dispatch = useDispatch<AppDispatch>()
  const [pageSize, setPageSize] = useState<number>(10)
  const [page, setPage] = useState<number>(0)
  const [searchValue, setSearchValue] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<'View' | 'Edit' | 'Add'>('View')
  const [formValues, setFormValues] = useState<Region>({
    id: undefined,
    name: '',
    status: 'Active', // Default status
    tenant_id: undefined
  })
  const [errors, setErrors] = useState<Partial<Region>>({})

  const region = useSelector((state: RootState) => state.region) // Used RootState

  useEffect(() => {
    dispatch(getRegionData({ limit: pageSize, offset: pageSize * page, where: { name: searchValue } }))
  }, [pageSize, page, dispatch, searchValue]) // Added dispatch and searchValue

  const handleOpenModal = async (id: string | null, mode: 'View' | 'Edit' | 'Add') => {
    let rowData: Region | undefined = undefined;
    if (id) {
      rowData = region?.rows?.find((row: Region) => row.id === id);
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
            status: 'Active', // Default for new
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
    const validationErrors: Partial<Region> = {}
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
        await dispatch(updateRegionData({ data: updateData, where: { id: dataToSubmit.id } })).unwrap()
        toast.success('Region updated successfully')
      } else if (modalMode === 'Add') {
        let { id, tenant_id, created_by, modified_by, ...addData } = dataToSubmit;
        addData = appendTenantId(addData) as Omit<Region, 'id' | 'created_by' | 'modified_by' | 'tenant_id'>; // Ensure correct type after append
        await dispatch(createRegionData([addData] as Region[])).unwrap()
        toast.success(`Region created successfully`)
      }

      dispatch(getRegionData({ limit: pageSize, offset: pageSize * page, where: { name: searchValue } }))
    } catch (error: any) {
      console.error(error)
      toast.error(error.message || `Failed to ${modalMode.toLowerCase()} Region. Try Again!`)
    } finally {
      handleCloseModal()
    }
  }

  const handleDelete = (id: string) => {
    console.log("Delete Region with ID:", id)
    // Implement delete logic here if needed
  }

  const onClearSearch = async () => {
    setSearchValue('')
    if (page !== 0) setPage(0);
    dispatch(getRegionData({ limit: pageSize, offset: 0 }))
  }

  const handleSearch = async () => {
    if (page !== 0) setPage(0);
    const whereClause = searchValue ? { name: searchValue } : {};
    dispatch(getRegionData({ limit: pageSize, offset: 0, where: whereClause }))
  }

  return (
    // Removed AclGuard wrapper, assuming handled by layout/middleware
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Card>
            <DataGridTable
              loading={region?.loading}
              checkBox={false}
              rows={region?.rows || []}
              columns={columns}
              total={region?.count || 0}
              pageSize={pageSize}
              changePageSize={(newPageSize: number) => setPageSize(newPageSize)}
              changePage={(newPage: number) => setPage(newPage)}
              searchValue={searchValue}
              onSearchChange={e => setSearchValue(e.target.value)}
              onSearch={handleSearch}
              onClearSearch={onClearSearch}
              edit={checkAccess('regionEdit')}
              view={checkAccess('regionView')}
              del={checkAccess('regionDelete')}
              add={checkAccess('regionCreate')}
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
          title={`${modalMode} Region`}
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
                  margin='normal' // Added margin for consistency
                  sx={{ mt: modalMode === 'View' ? 0 : 2.5 }} // Adjusted sx for spacing
                >
                  <MenuItem value='Active'>
                    Active
                  </MenuItem>
                  <MenuItem value='inActive'>
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
