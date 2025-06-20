'use client';
// ** MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import { TextField } from '@mui/material'
import { GridColumns, GridRenderCellParams } from '@mui/x-data-grid'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

// ** Store Imports
import { useDispatch, useSelector } from 'react-redux'
import { RootState, AppDispatch } from '../../../store'

import { getLeadCategoryData, createLeadCategoryData, updateLeadCategoryData } from '../../../store/apps/leadCategory'
import DataGridTable from 'src/components/Datagrid'
import Modal from 'src/components/Model/Model'
import { appendTenantId } from 'src/utils/tenantAppend'
import { checkAccess } from 'src/utils/accessCheck'

type LeadCategory = {
  id?: string;
  name: string;
  tenant_id?: string;
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
  }
]

export default function LeadCategoryPage() { // Renamed component
  const dispatch = useDispatch<AppDispatch>()
  const [pageSize, setPageSize] = useState<number>(10)
  const [page, setPage] = useState<number>(0)
  const [searchValue, setSearchValue] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<'View' | 'Edit' | 'Add'>('View')
  const [formValues, setFormValues] = useState<LeadCategory>({
    id: undefined,
    name: '',
    tenant_id: undefined
  })
  const [errors, setErrors] = useState<Partial<LeadCategory>>({})

  const leadCategory = useSelector((state: RootState) => state.leadCategory) // Used RootState

  useEffect(() => {
    dispatch(getLeadCategoryData({ limit: pageSize, offset: pageSize * page, where: { name: searchValue } }))
  }, [pageSize, page, dispatch, searchValue]) // Added dispatch and searchValue

  const handleOpenModal = async (id: string | null, mode: 'View' | 'Edit' | 'Add') => {
    let rowData: LeadCategory | undefined = undefined;
    if (id) {
      rowData = leadCategory?.rows?.find((row: LeadCategory) => row.id === id);
    }

    setFormValues(
      rowData
        ? {
            id: rowData.id,
            name: rowData.name,
            tenant_id: rowData.tenant_id
          }
        : {
            id: undefined,
            name: '',
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
    const validationErrors: Partial<LeadCategory> = {}
    let isValid = true

    if (!formValues.name) {
      validationErrors.name = 'Name is required'
      isValid = false
    }

    if (!isValid) {
      setErrors(validationErrors)
      return
    }

    try {
      let dataToSubmit = { ...formValues };
      if (modalMode === 'Edit' && dataToSubmit.id) {
        // For edit, tenant_id might not be needed in the payload or might be handled by backend
        const { tenant_id, ...updateData } = dataToSubmit;
        await dispatch(updateLeadCategoryData({ data: updateData, where: { id: dataToSubmit.id } })).unwrap()
        toast.success('Lead Category updated successfully')
      } else if (modalMode === 'Add') {
        let addData = { name: dataToSubmit.name } as LeadCategory; // Only include name for add
        addData = appendTenantId(addData); // Add tenant_id if needed
        await dispatch(createLeadCategoryData([addData])).unwrap() // createLeadCategoryData expects an array
        toast.success(`Lead Category created successfully`)
      }

      dispatch(getLeadCategoryData({ limit: pageSize, offset: pageSize * page, where: { name: searchValue } }))
    } catch (error: any) {
      console.error(error)
      toast.error(error.message || `Failed to ${modalMode.toLowerCase()} Lead Category. Try Again!`)
    } finally {
      handleCloseModal()
    }
  }

  const handleDelete = (id: string) => {
    console.log("Delete Lead Category with ID:", id)
    // Implement delete logic here if needed
  }

  const onClearSearch = async () => {
    setSearchValue('')
    if (page !== 0) setPage(0);
    dispatch(getLeadCategoryData({ limit: pageSize, offset: 0 }))
  }

  const handleSearch = async () => {
    if (page !== 0) setPage(0);
    const whereClause = searchValue ? { name: searchValue } : {};
    dispatch(getLeadCategoryData({ limit: pageSize, offset: 0, where: whereClause }))
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <DataGridTable
            loading={leadCategory?.loading}
            checkBox={false}
            rows={leadCategory?.rows || []}
            columns={columns}
            total={leadCategory?.count || 0}
            pageSize={pageSize}
            changePageSize={(newPageSize: number) => setPageSize(newPageSize)}
            changePage={(newPage: number) => setPage(newPage)}
            searchValue={searchValue}
            onSearchChange={e => setSearchValue(e.target.value)}
            onSearch={handleSearch}
            onClearSearch={onClearSearch}
            edit={checkAccess('leadCategoryEdit')}
            view={checkAccess('leadCategoryView')}
            del={checkAccess('leadCategoryDelete')}
            add={checkAccess('leadCategoryCreate')}
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
        title={`${modalMode} Lead Category`}
        onSubmit={handleSubmit}
        mode={modalMode}
      >
        {
          <Grid container spacing={2}>
            <Grid item xs={12}>
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
          </Grid>
        }
      </Modal>
    </Grid>
  )
}
