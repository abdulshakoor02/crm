'use client';
// ** MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import { TextField } from '@mui/material' // MenuItem seems unused
import { GridColumns, GridRenderCellParams } from '@mui/x-data-grid'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

// ** Store Imports
import { useDispatch, useSelector } from 'react-redux'
import { RootState, AppDispatch } from '../../../store'

import { getProductData, createProductData, updateProductData } from '../../../store/apps/product'
import DataGridTable from 'src/components/Datagrid'
import Modal from 'src/components/Model/Model'
import { appendTenantId } from 'src/utils/tenantAppend'
import { checkAccess } from 'src/utils/accessCheck'

type Product = {
  id?: string;
  name: string;
  price: string | number; // Allow string for form input, convert to number for API
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
  },
  {
    flex: 0.1,
    minWidth: 150,
    field: 'price',
    headerName: 'Price',
    renderCell: (params: GridRenderCellParams) => (
      <Typography variant='body2' sx={{ color: 'text.primary' }}>
        {params?.row?.['price']}
      </Typography>
    )
  }
]

export default function ProductsPage() { // Renamed component
  const dispatch = useDispatch<AppDispatch>()
  const [pageSize, setPageSize] = useState<number>(10)
  const [page, setPage] = useState<number>(0)
  const [searchValue, setSearchValue] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<'View' | 'Edit' | 'Add'>('View')
  const [formValues, setFormValues] = useState<Product>({
    id: undefined,
    name: '',
    price: '', // Initialize as string for TextField
    tenant_id: undefined
  })
  const [errors, setErrors] = useState<Partial<Product>>({})

  const products = useSelector((state: RootState) => state.products) // Used RootState

  useEffect(() => {
    dispatch(getProductData({ limit: pageSize, offset: pageSize * page, where: { name: searchValue } }))
  }, [pageSize, page, dispatch, searchValue]) // Added dispatch and searchValue

  const handleOpenModal = async (id: string | null, mode: 'View' | 'Edit' | 'Add') => {
    let rowData: Product | undefined = undefined;
    if (id) {
      rowData = products?.rows?.find((row: Product) => row.id === id);
    }

    setFormValues(
      rowData
        ? {
          id: rowData.id,
          name: rowData.name,
          price: String(rowData.price), // Ensure price is string for form
          tenant_id: rowData.tenant_id
        }
        : {
          id: undefined,
          name: '',
          price: '',
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
    const validationErrors: Partial<Product> = {}
    let isValid = true

    if (!formValues.name) { validationErrors.name = 'Name is required'; isValid = false; }
    if (formValues.price === '' || isNaN(Number(formValues.price))) {
      validationErrors.price = 'Valid price is required';
      isValid = false;
    }


    if (!isValid) {
      setErrors(validationErrors)
      return
    }

    const dataToSubmit: Product = {
      ...formValues,
      price: Number(formValues.price) // Convert price to number
    };

    try {
      if (modalMode === 'Edit' && dataToSubmit.id) {
        const { tenant_id, ...updateData } = dataToSubmit; // tenant_id might not be needed for update
        await dispatch(updateProductData({ data: updateData, where: { id: dataToSubmit.id } })).unwrap()
        toast.success('Product updated successfully')
      } else if (modalMode === 'Add') {
        let { id, tenant_id, ...addData } = dataToSubmit; // remove id, tenant_id handled by appendTenantId
        addData = appendTenantId(addData) as Product;
        await dispatch(createProductData([addData])).unwrap()
        toast.success(`Product created successfully`)
      }

      dispatch(getProductData({ limit: pageSize, offset: pageSize * page, where: { name: searchValue } }))
    } catch (error: any) {
      console.error(error)
      toast.error(error.message || `Failed to ${modalMode.toLowerCase()} Product. Try Again!`)
    } finally {
      handleCloseModal()
    }
  }

  const handleDelete = (id: string) => {
    console.log("Delete Product with ID:", id)
    // Implement delete logic here if needed
  }

  const onClearSearch = async () => {
    setSearchValue('')
    if (page !== 0) setPage(0);
    dispatch(getProductData({ limit: pageSize, offset: 0 }))
  }

  const handleSearch = async () => {
    if (page !== 0) setPage(0);
    const whereClause = searchValue ? { name: searchValue } : {};
    dispatch(getProductData({ limit: pageSize, offset: 0, where: whereClause }))
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <DataGridTable
            loading={products?.loading}
            checkBox={false}
            rows={products?.rows || []}
            columns={columns}
            total={products?.count || 0}
            pageSize={pageSize}
            changePageSize={(newPageSize: number) => setPageSize(newPageSize)}
            changePage={(newPage: number) => setPage(newPage)}
            searchValue={searchValue}
            onSearchChange={e => setSearchValue(e.target.value)}
            onSearch={handleSearch}
            onClearSearch={onClearSearch}
            edit={checkAccess('productEdit')}
            view={checkAccess('productView')}
            del={checkAccess('productDelete')}
            add={checkAccess('productCreate')}
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
        title={`${modalMode} Product`}
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
                label='Price'
                type='number' // Use type number for better input experience
                value={formValues.price}
                onChange={e => setFormValues({ ...formValues, price: e.target.value })}
                error={!!errors.price}
                helperText={errors.price}
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
