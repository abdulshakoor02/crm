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

import { getProductData, createProductData, updateProductData } from '../../../store/apps/product'
import DataGridTable from 'src/components/Datagrid'
import Modal from 'src/components/Model/Model'
import { appendTenantId } from 'src/utils/tenantAppend'
import { checkAccess } from 'src/utils/accessCheck'

type Product = {
  id?: string
  name: string
  price: string | number
  desc: string
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
  },
  {
    flex: 0.1,
    minWidth: 150,
    field: 'desc',
    headerName: 'Description',
    renderCell: (params: GridRenderCellParams) => (
      <Typography variant='body2' sx={{ color: 'text.primary' }}>
        {params?.row?.['desc']}
      </Typography>
    )
  }
]

const ProductComponent = () => {
  const dispatch = useDispatch<AppDispatch>()
  const [pageSize, setPageSize] = useState<number>(10)
  const [page, setPage] = useState<number>(0)
  const [searchValue, setSearchValue] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<'View' | 'Edit' | 'Add'>('View')
  const [formValues, setFormValues] = useState<Product>({
    name: '',
    price: '',
    desc: ''
  })
  const [errors, setErrors] = useState<Product>({
    name: '',
    price: '',
    desc: ''
  })

  const products = useSelector((state: any) => state.products)

  useEffect(() => {
    dispatch(getProductData({ limit: pageSize, offset: pageSize * page }))
  }, [pageSize, page])

  const handleOpenModal = async (id: string | null, mode: 'View' | 'Edit' | 'Add') => {
    let rowData = undefined
    if (id) {
      rowData = products?.rows?.find((row: Product) => row.id === id) as unknown as Product
    }

    setFormValues(
      rowData
        ? {
          id: rowData.id,
          name: rowData.name,
          price: rowData.price,
          desc: rowData.desc
        }
        : {
          name: '',
          price: '',
          desc: ''
        }
    )
    setModalMode(mode)
    setModalOpen(true)
  }

  const handleCloseModal = () => {
    setModalOpen(false)
    setErrors({
      name: '',
      price: '',
      desc: ''
    }) // Reset errors
  }

  const handleSubmit = async () => {
    const data = []
    const validationErrors: Product = {
      name: '',
      price: '',
      desc: ''
    }
    let isValid = true

    // Validation logic
    for (const i in validationErrors) {
      if (!formValues[i as keyof Product]) {
        validationErrors[i as keyof Product] = `Valid ${i} is required`
        isValid = false
      }
    }

    if (!isValid) {
      setErrors(validationErrors)

      return
    }
    formValues.price = Number(formValues.price)
    try {
      if (modalMode == 'Edit') {
        const res = await dispatch(updateProductData({ data: formValues, where: { id: formValues.id } }))
        if (res.error) {
          toast.error(`failed to update Product Try Again!`)

          return
        }
        await dispatch(getProductData({ limit: pageSize, offset: pageSize * page }))
        toast.success('Product updated successfully')
        handleCloseModal()

        return
      }
      appendTenantId(formValues)
      data.push(formValues)
      const res = await dispatch(createProductData(data))
      if (res.error) {
        toast.error(`failed to create products Try Again!`)

        return
      }
      await dispatch(getProductData({ limit: pageSize, offset: pageSize * page }))
      toast.success(`Product created successfully`)
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
    await dispatch(getProductData({ limit: pageSize, offset: pageSize * page }))
  }
  const handleSearch = async () => {
    if (searchValue != '') {
      const query: any = []
      query.push({
        column: '"products".name',
        operator: 'like',
        value: `%${searchValue}%`
      })
      await dispatch(getProductData({ limit: pageSize, offset: pageSize * page, where: query }))
    }
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <DataGridTable
            loading={products?.loading}
            checkBox={false}
            rows={products.rows}
            columns={columns}
            total={products.count}
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
                value={formValues.price}
                onChange={e => setFormValues({ ...formValues, price: e.target.value })}
                error={!!errors.price}
                helperText={errors.price}
                disabled={modalMode === 'View'}
                margin='normal'
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                label='Description'
                value={formValues.desc}
                onChange={e => setFormValues({ ...formValues, desc: e.target.value })}
                error={!!errors.desc}
                helperText={errors.desc}
                disabled={modalMode === 'View'}
                margin='dense'
              />
            </Grid>
          </Grid>
        }
      </Modal>
    </Grid>
  )
}

export default ProductComponent
