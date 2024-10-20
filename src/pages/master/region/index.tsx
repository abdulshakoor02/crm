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

import { getRegionData, createRegionData, updateRegionData } from '../../../store/apps/region'
import DataGridTable from '../../components/Datagrid'
import Modal from 'src/pages/components/Model/Model'
import { appendTenantId, appendTenantToQuery } from 'src/pages/utils/tenantAppend'

type Region = {
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

const RegionComponent = () => {
  const dispatch = useDispatch<AppDispatch>()
  const [pageSize, setPageSize] = useState<number>(10)
  const [page, setPage] = useState<number>(0)
  const [searchValue, setSearchValue] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<'View' | 'Edit' | 'Add'>('View')
  const [formValues, setFormValues] = useState<Region>({
    name: '',
    status: ''
  })
  const [errors, setErrors] = useState<Region>({
    name: '',
    status: ''
  })

  const region = useSelector((state: any) => state.region)

  useEffect(() => {
    dispatch(getRegionData({ limit: pageSize, offset: pageSize * page }))
  }, [pageSize, page])

  const handleOpenModal = async (id: string | null, mode: 'View' | 'Edit' | 'Add') => {
    let rowData = undefined
    if (id) {
      rowData = region?.rows?.find((row: Region) => row.id === id) as unknown as Region
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
    const validationErrors: Region = {
      name: '',
      status: ''
    }
    let isValid = true

    // Validation logic
    for (const i in validationErrors) {
      if (!formValues[i as keyof Region]) {
        validationErrors[i as keyof Region] = `Valid ${i} is required`
        isValid = false
      }
    }

    if (!isValid) {
      setErrors(validationErrors)

      return
    }
    try {
      if (modalMode == 'Edit') {
        const res = await dispatch(updateRegionData({ data: formValues, where: { id: formValues.id } }))
        if (res.error) {
          toast.error(`failed to update Region Try Again!`)

          return
        }
        await dispatch(getRegionData({ limit: pageSize, offset: pageSize * page }))
        toast.success('Region updated successfully')
        handleCloseModal()

        return
      }
      appendTenantId(formValues)
      data.push(formValues)
      const res = await dispatch(createRegionData(data))
      if (res.error) {
        toast.error(`failed to create region Try Again!`)

        return
      }
      await dispatch(getRegionData({ limit: pageSize, offset: pageSize * page }))
      toast.success(`Region created successfully`)
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
    await dispatch(getRegionData({ limit: pageSize, offset: pageSize * page }))
  }
  const handleSearch = async () => {
    if (searchValue != '') {
      const query: any = []
      query.push({
        column: '"regions".name',
        operator: 'like',
        value: `%${searchValue}%`
      })
      await dispatch(getRegionData({ limit: pageSize, offset: pageSize * page, where: query }))
    }
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <DataGridTable
            loading={region?.loading}
            checkBox={false}
            rows={region.rows}
            columns={columns}
            total={region.count}
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
        width={700}
        isOpen={modalOpen}
        onClose={handleCloseModal}
        title={`${modalMode} Region`}
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

export default RegionComponent
