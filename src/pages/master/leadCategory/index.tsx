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
import { AppDispatch } from '../../../store'

import { getLeadCategoryData, createLeadCategoryData, updateLeadCategoryData } from '../../../store/apps/leadCategory'
import DataGridTable from 'src/components/Datagrid'
import Modal from 'src/components/Model/Model'
import { appendTenantId } from 'src/utils/tenantAppend'
import { checkAccess } from 'src/utils/accessCheck'

type LeadCategory = {
  id?: string
  name: string
  tenant_id?: string
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

const LeadCategoryComponent = () => {
  const dispatch = useDispatch<AppDispatch>()
  const [pageSize, setPageSize] = useState<number>(10)
  const [page, setPage] = useState<number>(0)
  const [searchValue, setSearchValue] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<'View' | 'Edit' | 'Add'>('View')
  const [formValues, setFormValues] = useState<LeadCategory>({
    name: ''
  })
  const [errors, setErrors] = useState<LeadCategory>({
    name: ''
  })

  const leadCategory = useSelector((state: any) => state.leadCategory)

  useEffect(() => {
    dispatch(getLeadCategoryData({ limit: pageSize, offset: pageSize * page }))
  }, [pageSize, page])

  const handleOpenModal = async (id: string | null, mode: 'View' | 'Edit' | 'Add') => {
    let rowData = undefined
    if (id) {
      rowData = leadCategory?.rows?.find((row: LeadCategory) => row.id === id) as unknown as LeadCategory
    }

    setFormValues(
      rowData
        ? {
            id: rowData.id,
            name: rowData.name
          }
        : {
            name: ''
          }
    )
    setModalMode(mode)
    setModalOpen(true)
  }

  const handleCloseModal = () => {
    setModalOpen(false)
    setErrors({
      name: ''
    })
  }

  const handleSubmit = async () => {
    const data = []
    const validationErrors: LeadCategory = {
      name: ''
    }
    let isValid = true

    // Validation logic
    for (const i in validationErrors) {
      if (!formValues[i as keyof LeadCategory]) {
        validationErrors[i as keyof LeadCategory] = `Valid ${i} is required`
        isValid = false
      }
    }

    if (!isValid) {
      setErrors(validationErrors)

      return
    }
    try {
      if (modalMode == 'Edit') {
        const res = await dispatch(updateLeadCategoryData({ data: formValues, where: { id: formValues.id } }))
        if (res.error) {
          toast.error(`failed to update LeadCategory Try Again!`)

          return
        }
        await dispatch(getLeadCategoryData({ limit: pageSize, offset: pageSize * page }))
        toast.success('LeadCategory updated successfully')
        handleCloseModal()

        return
      }
      appendTenantId(formValues)
      data.push(formValues)
      const res = await dispatch(createLeadCategoryData(data))
      if (res.error) {
        toast.error(`failed to create leadCategory Try Again!`)

        return
      }
      await dispatch(getLeadCategoryData({ limit: pageSize, offset: pageSize * page }))
      toast.success(`LeadCategory created successfully`)
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
    await dispatch(getLeadCategoryData({ limit: pageSize, offset: pageSize * page }))
  }
  const handleSearch = async () => {
    if (searchValue != '') {
      const query: any = []
      query.push({
        column: '"leadCategory".name',
        operator: 'like',
        value: `%${searchValue}%`
      })
      await dispatch(getLeadCategoryData({ limit: pageSize, offset: pageSize * page, where: query }))
    }
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <DataGridTable
            loading={leadCategory?.loading}
            checkBox={false}
            rows={leadCategory.rows}
            columns={columns}
            total={leadCategory.count}
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
        title={`${modalMode} LeadCategory`}
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

export default LeadCategoryComponent
