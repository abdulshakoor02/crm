'use client';
// ** MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import { TextField } from '@mui/material' // MenuItem seems unused here
import { GridColumns, GridRenderCellParams } from '@mui/x-data-grid'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

// ** Store Imports
import { useDispatch, useSelector } from 'react-redux'
import { RootState, AppDispatch } from '../../../store'

import { getFeaturesData, createFeaturesData, updateFeaturesData } from '../../../store/apps/feature'
import DataGridTable from 'src/components/Datagrid'
import Modal from 'src/components/Model/Model'
// import uuid from 'react-uuid'; // Seems unused in this component

type Features = {
  id?: string; // id is optional for new entries
  name: string;
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

export default function FeaturesPage() { // Renamed component
  const dispatch = useDispatch<AppDispatch>()
  const [pageSize, setPageSize] = useState<number>(10)
  const [page, setPage] = useState<number>(0)
  const [searchValue, setSearchValue] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<'View' | 'Edit' | 'Add'>('View')
  const [formValues, setFormValues] = useState<Features>({
    id: undefined,
    name: ''
  })
  const [errors, setErrors] = useState<Partial<Features>>({}) // Initialize as empty object

  const features = useSelector((state: RootState) => state.features) // Used RootState

  useEffect(() => {
    dispatch(getFeaturesData({ limit: pageSize, offset: pageSize * page, where: { name: searchValue } }))
  }, [pageSize, page, dispatch, searchValue]) // Added dispatch and searchValue

  const handleOpenModal = async (id: string | null, mode: 'View' | 'Edit' | 'Add') => {
    let rowData: Features | undefined = undefined;
    if (id) {
      rowData = features?.rows?.find((row: Features) => row.id === id);
    }

    setFormValues(
      rowData
        ? {
            id: rowData.id,
            name: rowData.name
          }
        : {
            id: undefined,
            name: ''
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
    const validationErrors: Partial<Features> = {}
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
      if (modalMode === 'Edit' && formValues.id) {
        await dispatch(updateFeaturesData({ data: formValues, where: { id: formValues.id } })).unwrap()
        toast.success('Feature updated successfully')
      } else if (modalMode === 'Add') {
        const { id, ...addData } = formValues; // remove id for creation
        await dispatch(createFeaturesData([addData] as Features[])).unwrap() // createFeaturesData expects an array
        toast.success(`Feature created successfully`)
      }

      dispatch(getFeaturesData({ limit: pageSize, offset: pageSize * page, where: { name: searchValue } }))
    } catch (error: any) {
      console.error(error)
      toast.error(error.message || `Failed to ${modalMode.toLowerCase()} feature. Try Again!`)
    } finally {
      handleCloseModal()
    }
  }

  const handleDelete = (id: string) => { // id is string
    console.log("Delete feature with ID:", id)
    // Implement delete logic here if needed
  }

  const onClearSearch = async () => {
    setSearchValue('')
    if (page !== 0) setPage(0);
    dispatch(getFeaturesData({ limit: pageSize, offset: 0 }))
  }

  const handleSearch = async () => {
    if (page !== 0) setPage(0);
    const whereClause = searchValue ? { name: searchValue } : {};
    dispatch(getFeaturesData({ limit: pageSize, offset: 0, where: whereClause }))
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <DataGridTable
            loading={features?.loading}
            checkBox={false}
            rows={features?.rows || []}
            columns={columns}
            total={features?.count || 0}
            pageSize={pageSize}
            changePageSize={(newPageSize: number) => setPageSize(newPageSize)}
            changePage={(newPage: number) => setPage(newPage)}
            searchValue={searchValue}
            onSearchChange={e => setSearchValue(e.target.value)}
            onSearch={handleSearch}
            onClearSearch={onClearSearch}
            edit={true} // Assuming these are always true for this master page
            view={true}
            del={true}
            add={true} // Assuming add is always available
            onView={(id: string) => handleOpenModal(id, 'View')}
            onEdit={(id: string) => handleOpenModal(id, 'Edit')}
            onDelete={(id: string) => handleDelete(id)}
            onAddRow={() => handleOpenModal(null, 'Add')}
          />
        </Card>
      </Grid>

      <Modal
        width={700} // Adjusted width if necessary
        isOpen={modalOpen}
        onClose={handleCloseModal}
        title={`${modalMode} Feature`} // Corrected title
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
