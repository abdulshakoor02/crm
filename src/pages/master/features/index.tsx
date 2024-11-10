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

import { getFeaturesData, createFeaturesData, updateFeaturesData } from '../../../store/apps/feature'
import DataGridTable from '../../components/Datagrid'
import Modal from 'src/pages/components/Model/Model'
import uuid from 'react-uuid'

type Features = {
  id?: string,
  name: string
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

const FeaturesComponent = () => {
  const dispatch = useDispatch<AppDispatch>()
  const [pageSize, setPageSize] = useState<number>(10)
  const [page, setPage] = useState<number>(0)
  const [searchValue, setSearchValue] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<'View' | 'Edit' | 'Add'>('View')
  const [formValues, setFormValues] = useState<Features>({
    name: '',
  })
  const [errors, setErrors] = useState<Features>({
    name: '',
  })

  const features = useSelector((state: any) => state.features)

  useEffect(() => {
    dispatch(getFeaturesData({ limit: pageSize, offset: pageSize * page }))
  }, [pageSize, page])

  const handleOpenModal = async (id: string | null, mode: 'View' | 'Edit' | 'Add') => {
    let rowData = undefined
    if (id) {
      rowData = features?.rows?.find((row: Features) => row.id === id) as unknown as Features
    }

    setFormValues(
      rowData
        ? {
          id: rowData.id,
    name: rowData.name,
  }
        : {
    name: '',
  }
    )
    setModalMode(mode)
    setModalOpen(true)
  }

  const handleCloseModal = () => {
    setModalOpen(false)
    setErrors({
    name: '',
  }) // Reset errors
  }

  const handleSubmit = async () => {
    const data = []
    const validationErrors: Features = {
    name: '',
  }
    let isValid = true

    // Validation logic
    for (const i in validationErrors) {
      if (!formValues[i as keyof Features]) {
        validationErrors[i as keyof Features] = `Valid ${i} is required`
        isValid = false
      }
    }

    if (!isValid) {
      setErrors(validationErrors)

      return
    }
    try {
      if (modalMode == 'Edit') {
        const res = await dispatch(updateFeaturesData({ data: formValues, where: { id: formValues.id } }))
        if (res.error) {
          toast.error(`failed to update Features Try Again!`)

          return
        }
        await dispatch(getFeaturesData({ limit: pageSize, offset: pageSize * page }))
        toast.success('Features updated successfully')
        handleCloseModal()

        return
      }
      data.push(formValues)
      const res = await dispatch(createFeaturesData(data))
      if (res.error) {
        toast.error(`failed to create features Try Again!`)

        return
      }
      await dispatch(getFeaturesData({ limit: pageSize, offset: pageSize * page }))
      toast.success(`Features created successfully`)
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
    await dispatch(getFeaturesData({ limit: pageSize, offset: pageSize * page }))
  }
  const handleSearch = async () => {
    if (searchValue != '') {
    await dispatch(
      getFeaturesData({ limit: pageSize, offset: pageSize * page, where: { name: searchValue } })
    )
    }
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <DataGridTable
            loading={features?.loading}
            checkBox={false}
            rows={features?.rows}
            columns={columns}
            total={features?.count}
            pageSize={pageSize}
            changePageSize={(newPageSize: number) => setPageSize(newPageSize)}
            changePage={(newPage: number) => setPage(newPage)}
            searchValue={searchValue}
            onSearchChange={e => setSearchValue(e.target.value)}
            onSearch={handleSearch}
            onClearSearch={onClearSearch}
            edit={true}
            view={true}
            del={true}
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
        title={`${modalMode} Features`}
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
          </Grid>
        }
      </Modal>
    </Grid>
  )
}

export default FeaturesComponent
