// ** MUI Imports
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import {
  TextField,
  Box,
  Tooltip,
  IconButton,
  MenuItem,
  Accordion,
  Card,
  CardContent,
  AccordionSummary,
  AccordionDetails,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  CloseIcon,
  Button
} from '@mui/material'
import ReceiptIcon from '@mui/icons-material/Receipt'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { GridColumns, GridRenderCellParams } from '@mui/x-data-grid'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import moment from 'moment'
import { useRouter } from 'next/router'

// ** Store Imports
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch } from 'src/store'

import { getLeadData, createLeadData, updateLeadData } from 'src/store/apps/leads'
import { getAdditionalInfoData, createAdditionalInfoData } from 'src/store/apps/additionalInfo'
import { getEmployeesData } from 'src/store/apps/user'
import { getCountriesData } from 'src/store/apps/countries'
import { getBranchData } from 'src/store/apps/branch'
import { getLeadCategoryData } from 'src/store/apps/leadCategory'
import { getProductData } from 'src/store/apps/product'
import { createInvoiceData } from 'src/store/apps/invoice'
import DataGridTable from 'src/components/Datagrid'
import Modal from 'src/components/Model/Model'
import { appendTenantId } from 'src/utils/tenantAppend'
import uuid from 'react-uuid'
import { checkAccess } from 'src/utils/accessCheck'

import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV2'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker'
import { getUnixTime, format, fromUnixTime } from 'date-fns' // Added format and fromUnixTime

type Lead = {
  id?: string
  name: string
  email: string
  mobile: string
  address: string
  country_id: string
  employee_id: string
  branch_id: string
  lead_category_id: string

  // product_ids?: string[] // Removed as per new requirement
  tenant_id?: string
  appointmentDateTime?: Date | null // Added
}

let columns: GridColumns = [
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
    sortable: false,
    field: 'email',
    headerName: 'Email',
    renderCell: (params: GridRenderCellParams) => (
      <Typography variant='body2' sx={{ color: 'text.primary' }}>
        {params?.row?.['email']}
      </Typography>
    )
  },
  {
    flex: 0.1,
    minWidth: 150,
    sortable: false,
    field: 'mobile',
    headerName: 'Mobile',
    renderCell: (params: GridRenderCellParams) => (
      <Typography variant='body2' sx={{ color: 'text.primary' }}>
        {params?.row?.['mobile']}
      </Typography>
    )
  },
  {
    flex: 0.1,
    minWidth: 150,
    sortable: false,
    field: 'country',
    headerName: 'Country',
    renderCell: (params: GridRenderCellParams) => (
      <Typography variant='body2' sx={{ color: 'text.primary' }}>
        {params?.row?.country['name']}
      </Typography>
    )
  },
  {
    flex: 0.1,
    minWidth: 150,
    sortable: false,
    field: 'branch',
    headerName: 'Branch',
    renderCell: (params: GridRenderCellParams) => (
      <Typography variant='body2' sx={{ color: 'text.primary' }}>
        {params?.row?.branch['name']}
      </Typography>
    )
  },
  {
    flex: 0.1,
    minWidth: 150,
    sortable: false,
    field: 'leadCategory',
    headerName: 'LeadCategory',
    renderCell: (params: GridRenderCellParams) => (
      <Typography variant='body2' sx={{ color: 'text.primary' }}>
        {params?.row?.lead_category['name']}
      </Typography>
    )
  }

  // Omitting other columns for brevity in this diff, they remain unchanged
]

const assigned_user = {
  flex: 0.1,
  minWidth: 150,
  sortable: false,
  field: 'assigned_user',
  headerName: 'Assigned User',
  renderCell: (params: GridRenderCellParams) => (
    <Typography variant='body2' sx={{ color: 'text.primary' }}>
      {`${params?.row?.employee['first_name']} ${params?.row?.employee['last_name']}`}
    </Typography>
  )
}

columns = checkAccess('AssignedUserColumn') ? [...columns, assigned_user] : columns

const LeadComponent = () => {

  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>()
  const [pageSize, setPageSize] = useState<number>(10)
  const [page, setPage] = useState<number>(0)
  const [searchValue, setSearchValue] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [dailogOpen, setDailogOpen] = useState(false)
  const [modalMode, setModalMode] = useState<'View' | 'Edit' | 'Add'>('View')
  const [invoiceModalOpen, setInvoiceModalOpen] = useState(false)
  const [selectedLead, setSelectedLead] = useState<any>(null)
  const [selectedBranch, setSelectedBranch] = useState<any>(null)
  const [invoiceData, setInvoiceData] = useState({
    amountPaid: '',
    discount: '',
    discountType: 'percentage' // 'percentage' or 'fixed'
  })
  const [invoiceErrors, setInvoiceErrors] = useState({
    amountPaid: '',
    discount: ''
  })
  const [infoValues, setInfoValues] = useState<{
    title: string
    description: string
    lead_id?: string
  }>({
    title: 'Comments',
    description: ''
  })
  const [formValues, setFormValues] = useState<Lead>({
    name: '',
    email: '',
    mobile: '',
    address: '',
    country_id: '',
    employee_id: '',
    branch_id: '',
    lead_category_id: '',

    // product_ids: [], // Removed
    appointmentDateTime: null // Added
  })
  const [errors, setErrors] = useState<Lead>({
    name: '',
    email: '',
    mobile: '',
    address: '',
    country_id: '',
    employee_id: '',
    branch_id: '',
    lead_category_id: '',

    // product_id: '', // Removed
    appointmentDateTime: null // Added
  })

  const leads = useSelector((state: any) => state.leads)
  const user = useSelector((state: any) => state.user)
  const branch = useSelector((state: any) => state.branch)
  const country = useSelector((state: any) => state.country)
  const leadCategory = useSelector((state: any) => state.leadCategory)
  const comments = useSelector((state: any) => state.additionalInfo)
  const product = useSelector((state: any) => state.products)

  useEffect(() => {
    dispatch(
      getLeadData({
        limit: pageSize,
        offset: pageSize * page,
        orderBy: '"leads".created_at desc',
        joins: [{ column: 'Country' }, { column: 'Branch' }, { column: 'LeadCategory' }, { column: 'Employee' }, { column: 'Country' }]
      })
    )
  }, [pageSize, page])

  useEffect(() => {
    dispatch(getEmployeesData({}))
    dispatch(getCountriesData({}))
    dispatch(getBranchData({ joins: [{ column: 'Region' }, { column: 'Country' }] }))
    dispatch(getLeadCategoryData({}))
    dispatch(getProductData({}))
  }, [])

  const handleOpenModal = async (id: string | null, mode: 'View' | 'Edit' | 'Add') => {
    let rowData = undefined
    if (id) {
      rowData = leads?.rows?.find((row: Lead) => row.id === id) as unknown as Lead
    }
    await dispatch(getAdditionalInfoData({ where: { lead_id: rowData?.id, title: 'Comments' } }))

    setFormValues(
      rowData
        ? {
          id: rowData.id,
          name: rowData.name,
          email: rowData.email,
          mobile: rowData.mobile,
          address: rowData.address,
          country_id: rowData.country_id,
          employee_id: rowData.employee_id,
          branch_id: rowData.branch_id,
          lead_category_id: rowData.lead_category_id,

          // product_ids: rowData.product_ids, // Removed
          appointmentDateTime: rowData.appointmentDateTime
            ? typeof rowData.appointmentDateTime === 'number'
              ? new Date(rowData.appointmentDateTime * 1000)
              : new Date(rowData.appointmentDateTime)
            : null // Added
        }
        : {
          name: '',
          email: '',
          mobile: '',
          address: '',
          country_id: '',
          employee_id: '',
          branch_id: '',
          lead_category_id: '',

          // product_id: '', // Removed
          appointmentDateTime: null // Added
        }
    )
    setModalMode(mode)
    setModalOpen(true)
  }

  const handleCloseModal = () => {
    setModalOpen(false)
    setErrors({
      name: '',
      email: '',
      mobile: '',
      address: '',
      country_id: '',
      employee_id: '',
      branch_id: '',
      lead_category_id: '',

      // product_ids: [], // Removed
      appointmentDateTime: null // Added
    })
    setFormValues({
      // Also reset appointmentDateTime in formValues
      ...formValues, // Keep existing values that are not part of initial state if any.
      name: '',
      email: '',
      mobile: '',
      address: '',
      country_id: '',
      employee_id: '',
      branch_id: '',
      lead_category_id: '',
      appointmentDateTime: null
    })
    setInfoValues({ ...infoValues, description: '' })
  }

  const handleSubmit = async () => {
    const data = []
    const validationErrors: Lead = {
      name: '',
      email: '',
      mobile: '',
      address: '',
      country_id: '',
      employee_id: '',
      branch_id: '',
      lead_category_id: '',

      // product_ids: [], // Removed
      appointmentDateTime: null // Added
    }
    let isValid = true

    // Validation logic
    for (const i in validationErrors) {
      if (i == 'employee_id') {
        continue
      }
      if (i == 'appointmentDateTime') {
        continue
      }
      if (!formValues[i as keyof Lead]) {
        validationErrors[i as keyof Lead] = `Valid ${i} is required`
        isValid = false
      }
    }

    // if (!formValues.appointmentDateTime) {
    //   validationErrors.appointmentDateTime = 'Appointment datetime is required';
    //   isValid = false;
    // }

    if (!isValid) {
      setErrors(validationErrors)

      return
    }

    const submissionData: any = { ...formValues }

    if (submissionData.appointmentDateTime) {
      submissionData.appointmentDateTime = getUnixTime(new Date(submissionData.appointmentDateTime))
    }

    console.log(submissionData)

    try {
      if (modalMode == 'Edit') {
        const res = await dispatch(updateLeadData({ data: submissionData, where: { id: submissionData.id } }))
        if (res.error) {
          toast.error(`failed to update Lead Try Again!`)

          return
        }
        if (infoValues.description !== '') {
          infoValues.lead_id = formValues.id
          const comnts = await dispatch(createAdditionalInfoData([infoValues]))
          if (comnts.error) {
            toast.error(`failed to add comments`)
          }
          toast.success('comments updated successfully')
        }
        dispatch(
          getLeadData({
            limit: pageSize,
            offset: pageSize * page,
            joins: [{ column: 'Country' }, { column: 'Branch' }, { column: 'LeadCategory' }, { column: 'Employee' }]
          })
        )
        toast.success('Lead updated successfully')
        handleCloseModal()

        return
      }
      const dupcheck = await dispatch(
        getLeadData({
          where: [
            {
              column: '"leads".email',
              operator: 'like',
              value: `%${formValues.email}%`
            },
            {
              column: '"leads".mobile',
              operator: 'like',
              value: `%${formValues.mobile}%`
            }
          ]
        })
      )
      if (dupcheck.payload.count > 0) {
        toast.error('please check email or mobile already exists in the application')

        return
      }
      appendTenantId(submissionData)

      // data.push(submissionData) // createLeadData expects an array, but if it's a single object, adjust accordingly.
      // Assuming createLeadData can handle a single object in an array.
      const res = await dispatch(createLeadData([submissionData]))
      if (res.error) {
        toast.error(`failed to create leads Try Again!`)

        return
      }
      if (infoValues.description !== '') {
        infoValues.lead_id = res.payload[0]?.id
        const comnts = await dispatch(createAdditionalInfoData([infoValues]))
        if (comnts.error) {
          toast.error(`failed to add comments`)
        }
        toast.success('comments updated successfully')
      }
      dispatch(
        getLeadData({
          limit: pageSize,
          offset: pageSize * page,
          joins: [{ column: 'Country' }, { column: 'Branch' }, { column: 'LeadCategory' }, { column: 'Employee' }]
        })
      )
      toast.success(`Lead created successfully`)
    } catch (error) {
      console.log(error)
      toast.error(`failed to create user Try Again!`)
    }
    handleCloseModal()
  }


  const handleAddProduct = () => {
    handleCloseInvoiceModal()
    router.push('/master/products')
  }

  const handleGenerateInvoice = (id: string, row: any) => {
    // Ensure product_ids is an array, defaulting to an empty array if it's null or undefined
    const leadDataWithEnsuredProductIds = {
      ...row,
      product_ids: Array.isArray(row.product_ids) ? row.product_ids : []
    }
    setSelectedLead(leadDataWithEnsuredProductIds)
    const selectedBranch = branch?.rows?.find((p: any) => p.id === row?.branch_id)
    setSelectedBranch(selectedBranch);
    setInvoiceModalOpen(true)
    setInvoiceData({
      amountPaid: '',
      discount: '',
      discountType: 'percentage'
    })
    setInvoiceErrors({
      amountPaid: '',
      discount: ''
    })
  }

  const handleCloseInvoiceModal = () => {
    setInvoiceModalOpen(false)
    setSelectedLead(null)
    setInvoiceData({
      amountPaid: '',
      discount: '',
      discountType: 'percentage'
    })
    setInvoiceErrors({
      amountPaid: '',
      discount: ''
    })
  }

  const handleInvoiceSubmit = async () => {
    const selectedProducts: any = [];
    let totalProductPrice = 0

    // Validate discount
    const errors = { discount: '' }
    let isValid = true

    // Ensure at least one product is selected
    if (!selectedLead?.product_ids || selectedLead.product_ids.length === 0) {
      toast.error('Please select at least one product to generate an invoice.')
      isValid = false

      // Optionally, set an error state for UI feedback if a dedicated error display area for products exists
      // setInvoiceErrors(prev => ({...prev, products: 'Please select at least one product.'})); // Example
      return // Early return if no products selected
    }

    if (!invoiceData.discount || !invoiceData.amountPaid) {
      if (!invoiceData.discount) {
        errors.discount = 'Discount is required'
      }
      if (!invoiceData.amountPaid) {
        errors.amountPaid = 'amount to be paid is required'
      }
      isValid = false
    } else {
      const discountValue = parseFloat(invoiceData.discount)
      if (isNaN(discountValue) || discountValue < 0) {
        errors.discount = 'Please enter a valid discount value'
        isValid = false
      } else if (invoiceData.discountType === 'percentage' && discountValue > 100) {
        errors.discount = 'Percentage discount cannot exceed 100%'
        isValid = false
      } else if (selectedLead && selectedLead.product_ids && selectedLead.product_ids.length > 0) {
        // Calculate total price of selected products for validation
        selectedLead.product_ids.forEach((productId: string) => {
          const selectedProduct = product?.rows?.find((p: any) => p.id === productId)
          selectedProducts.push(
            {
              "product_id": selectedProduct?.id,
              "price": selectedProduct?.price,
              "quantity": 1
            },
          );
          totalProductPrice += selectedProduct?.price || 0
        })

        // Maximum allowed discount (90% of total product price to prevent zero total)
        const maxDiscountPercentage = 90
        const maxFixedDiscount = (totalProductPrice * maxDiscountPercentage) / 100 // Changed productPrice to totalProductPrice

        if (invoiceData.discountType === 'fixed') {
          if (discountValue >= totalProductPrice) { // Changed productPrice to totalProductPrice
            errors.discount = `Fixed discount cannot be equal to or exceed total product price ($${totalProductPrice.toFixed(2)}). Maximum allowed: $${maxFixedDiscount.toFixed(2)}`
            isValid = false
          } else if (discountValue > maxFixedDiscount) {
            errors.discount = `Fixed discount too high. Maximum allowed: $${maxFixedDiscount.toFixed(2)} (${maxDiscountPercentage}% of total product price)` // Changed product price to total product price
            isValid = false
          }
        } else if (invoiceData.discountType === 'percentage') {
          if (discountValue >= 100) {
            errors.discount = `Percentage discount cannot be 100% or more. Maximum allowed: ${maxDiscountPercentage}%`
            isValid = false
          } else if (discountValue > maxDiscountPercentage) {
            errors.discount = `Percentage discount too high. Maximum allowed: ${maxDiscountPercentage}%`
            isValid = false
          }
        }
      }

      const invoice = await dispatch(createInvoiceData({
        lead_id: selectedLead.id,
        products: selectedProducts,
        total: totalProductPrice,
        amount_paid: parseFloat(invoiceData.amountPaid),
        discount: parseFloat(invoiceData.discount),
      }))

      // Navigate to invoice2 page with query parameter
      router.push(`/invoice2?reciept_id=${invoice?.payload?.reciept?.id}&invoice_id=${invoice?.payload?.invoice?.id}`)
      handleCloseInvoiceModal()

    }

    if (!isValid) {
      setInvoiceErrors(errors as any)

      return
    }

  }

  const handlePaste = (event: any) => {
    const pasteText = event.clipboardData.getData('text')
    console.log('pastedText', pasteText)

    setInfoValues({ ...infoValues, description: infoValues.description + pasteText }) // Append pasted content to current value
    event.preventDefault() // Prevent default paste behavior if needed
  }

  const handleDelete = (id: number) => {
    // setData(prevData => prevData.filter(row => row.id !== id));
  }

  const onClearSearch = async () => {
    setSearchValue('')
    dispatch(
      getLeadData({
        limit: pageSize,
        offset: pageSize * page,
        joins: [{ column: 'Country' }, { column: 'Branch' }, { column: 'LeadCategory' }, { column: 'Employee' }]
      })
    )
  }
  const handleSearch = async () => {
    if (searchValue != '') {
      const query: any = []
      query.push({
        column: '"leads".name',
        operator: 'like',
        value: `%${searchValue}%`
      })
      query.push({
        column: '"leads".email',
        operator: 'like',
        value: `%${searchValue}%`
      })
      query.push({
        column: '"leads".mobile',
        operator: 'like',
        value: `%${searchValue}%`
      })
      await dispatch(
        getLeadData({
          limit: pageSize,
          offset: pageSize * page,
          joins: [{ column: 'Country' }, { column: 'Branch' }, { column: 'LeadCategory' }, { column: 'Employee' }],
          where: query
        })
      )
    }
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <DataGridTable
            loading={leads?.loading}
            checkBox={false}
            rows={leads.rows}
            columns={columns}
            total={leads.count}
            pageSize={pageSize}
            changePageSize={(newPageSize: number) => setPageSize(newPageSize)}
            changePage={(newPage: number) => setPage(newPage)}
            searchValue={searchValue}
            onSearchChange={e => setSearchValue(e.target.value)}
            onSearch={handleSearch}
            onClearSearch={onClearSearch}
            edit={checkAccess('leadEdit')}
            view={checkAccess('leadView')}
            del={checkAccess('leadDelete')}
            add={checkAccess('leadCreate')}
            onView={id => handleOpenModal(id, 'View')}
            onEdit={id => handleOpenModal(id, 'Edit')}
            onDelete={id => handleDelete(id)}
            onAddRow={() => handleOpenModal(null, 'Add')}
            customActions={[
              {
                icon: <ReceiptIcon fontSize='medium' sx={{ color: '#28a745' }} />,
                tooltip: 'Generate Invoice',
                onClick: handleGenerateInvoice

                // show: (row: any) => !!row.product_ids && row.product_ids.length > 0 // Removed to make button always visible
              }
            ]}
          />
        </Card>
      </Grid>

      <Modal
        width={1200}
        isOpen={modalOpen}
        onClose={handleCloseModal}
        title={`${modalMode} Lead`}
        onSubmit={handleSubmit}
        mode={modalMode}
        height='100vh'
      >
        {
          <LocalizationProvider dateAdapter={AdapterDateFns}>
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
                  label='Email'
                  value={formValues.email}
                  onChange={e => setFormValues({ ...formValues, email: e.target.value })}
                  error={!!errors.email}
                  helperText={errors.email}
                  disabled={modalMode === 'View'}
                  margin='normal'
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label='Address'
                  value={formValues.address}
                  onChange={e => setFormValues({ ...formValues, address: e.target.value })}
                  error={!!errors.address}
                  helperText={errors.address}
                  disabled={modalMode === 'View'}
                  margin='normal'
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label='mobile'
                  value={formValues.mobile}
                  onChange={e => setFormValues({ ...formValues, mobile: e.target.value })}
                  error={!!errors.mobile}
                  helperText={errors.mobile}
                  disabled={modalMode === 'View'}
                  margin='normal'
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  select
                  name='country_id'
                  value={formValues.country_id}
                  label='Country'
                  error={!!errors.country_id}
                  helperText={errors.country_id}
                  onChange={e => setFormValues({ ...formValues, country_id: e.target.value })}
                  disabled={modalMode === 'View'}
                  sx={{ mt: 4 }}
                >
                  {country?.rows?.map((items: any) => (
                    <MenuItem key={items.id} value={items.id}>
                      {items.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                {checkAccess('AssignedUserColumn') && (
                  <TextField
                    fullWidth
                    select
                    name='employee_id'
                    value={formValues.employee_id}
                    label='Assign to User'
                    error={!!errors.employee_id}
                    helperText={errors.employee_id}
                    onChange={e => setFormValues({ ...formValues, employee_id: e.target.value })}
                    disabled={modalMode === 'View'}
                    sx={{ mt: 4 }}
                  >
                    {user?.rows?.map((items: any) => (
                      <MenuItem key={items.id} value={items.id}>
                        {`${items.first_name} ${items.last_name}`}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  select
                  name='branch_id'
                  value={formValues.branch_id}
                  label='Branch'
                  error={!!errors.branch_id}
                  helperText={errors.branch_id}
                  onChange={e => setFormValues({ ...formValues, branch_id: e.target.value })}
                  disabled={modalMode === 'View'}
                  sx={{ mt: 4 }}
                >
                  {branch?.rows?.map((items: any) => (
                    <MenuItem key={items.id} value={items.id}>
                      {items.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  select
                  name='lead_category_id'
                  value={formValues.lead_category_id}
                  label='Lead Category'
                  error={!!errors.lead_category_id}
                  helperText={errors.lead_category_id}
                  onChange={e => setFormValues({ ...formValues, lead_category_id: e.target.value })}
                  disabled={modalMode === 'View'}
                  sx={{ mt: 4 }}
                >
                  {leadCategory?.rows?.map((items: any) => (
                    <MenuItem key={items.id} value={items.id}>
                      {items.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                {' '}
                {/* DateTimePicker Added Here */}
                <DateTimePicker
                  fullWidth
                  label='Appointment Date Time'
                  value={formValues.appointmentDateTime}
                  sx={{ mt: 4 }}
                  onChange={newValue => {
                    setFormValues({ ...formValues, appointmentDateTime: newValue })
                    if (errors.appointmentDateTime) {
                      setErrors({ ...errors, appointmentDateTime: '' })
                    }
                  }}
                  renderInput={params => (
                    <TextField
                      {...params}
                      fullWidth
                      margin='normal' // Consistent margin
                      sx={{ mt: 4 }} // Consistent with other select fields
                      error={!!errors.appointmentDateTime}
                      helperText={errors.appointmentDateTime}
                      disabled={modalMode === 'View'}
                    />
                  )}
                  disabled={modalMode === 'View'}
                />
              </Grid>

              {/* Product selection removed from here */}
              {/* <Grid item xs={6}> ... </Grid> */}

              <Grid item xs={12}></Grid>{' '}
              {/* This was an empty full-width spacer, kept it. If DateTimePicker makes it too long, could be xs={12} sm={6} and this becomes a real spacer or removed. */}
              <Grid item xs={12}>
                {(modalMode == 'Edit' || modalMode == 'Add') && 'Comments'}
              </Grid>
              <Grid item xs={12}>
                {(modalMode == 'Edit' || modalMode == 'Add') && (
                  <TextField
                    fullWidth
                    multiline
                    label='Add New Comments'
                    value={infoValues.description}
                    onPaste={handlePaste}
                    onChange={e => setInfoValues({ ...infoValues, description: e.target.value })}
                    margin='dense'
                  />
                )}
              </Grid>
            </Grid>
          </LocalizationProvider>
        }
        {(modalMode === 'Edit' || modalMode === 'View') && comments.count > 0 ? (
          <Accordion sx={{ mt: 4 }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls='panel1-content' id='panel1-header'>
              Comments
            </AccordionSummary>
            <AccordionDetails key={uuid()}>
              {comments?.rows?.map((comment: any) => {
                return (
                  <Card key={uuid()} sx={{ mt: 2 }}>
                    <CardContent>
                      <Grid container spacing={2}>
                        <Grid item xs={10}>
                          {comment?.description}
                        </Grid>
                        <Grid item xs={2}>
                          {moment(comment.created_at).format('DD/MM/YY hh:mm:ss a')}
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                )
              })}
            </AccordionDetails>
          </Accordion>
        ) : (
          ''
        )}
      </Modal>

      {/* Invoice Modal */}
      <Modal
        width={520}
        isOpen={invoiceModalOpen}
        onClose={handleCloseInvoiceModal}
        title="🧾 Generate Invoice"
        onSubmit={handleInvoiceSubmit}
        mode="Add"
        height="auto"
      >
        <Grid container spacing={2}>

          {selectedLead && (
            <>
              {/* Lead Info Card */}
              <Grid item xs={12}>
                <Box sx={{
                  p: 2,
                  backgroundColor: (theme) => theme.palette.mode === 'dark' ? 'rgba(144, 202, 249, 0.08)' : 'rgba(25, 118, 210, 0.04)',
                  borderRadius: 1.5,
                  border: (theme) => `1px solid ${theme.palette.mode === 'dark' ? 'rgba(144, 202, 249, 0.2)' : 'rgba(25, 118, 210, 0.12)'}`
                }}>
                  <Typography variant="subtitle2" sx={{ color: 'text.primary', mb: 1, fontWeight: 600 }}>
                    Lead Information
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 3 }}>
                    <Typography variant="body2"><strong>Name:</strong> {selectedLead.name}</Typography>
                    <Typography variant="body2"><strong>Email:</strong> {selectedLead.email}</Typography>
                  </Box>
                </Box>
              </Grid>

              {/* Product Info & Add Button */}
              <Grid item xs={12}>
                <Box sx={{
                  p: 2,
                  backgroundColor: (theme) => theme.palette.mode === 'dark' ? 'rgba(144, 202, 249, 0.08)' : 'rgba(25, 118, 210, 0.04)',
                  borderRadius: 1.5,
                  border: (theme) => theme.palette.mode === 'dark' ? '1px solid rgba(144, 202, 249, 0.2)' : '1px solid rgba(25, 118, 210, 0.12)}'
                }}>
                  <Typography variant="subtitle2" sx={{ color: 'text.primary', mb: 1, fontWeight: 600 }}>
                    Select Products
                  </Typography>
                  <TextField
                    fullWidth
                    select
                    multiple // Added multiple prop
                    name='product_ids' // Changed name to product_ids
                    value={selectedLead?.product_ids || []} // Ensure value is an array, access from selectedLead
                    label='Products' // Changed label to Products
                    // error={!!errors.product_ids} // Accessing errors might be complex here, consider if needed
                    // helperText={errors.product_ids}
                    onChange={e => {
                      const selectedValues = e.target.value as unknown as string[]
                      setSelectedLead({ ...selectedLead, product_ids: selectedValues })
                    }}
                    sx={{ mt: 2 }} // Adjusted margin
                    SelectProps={{
                      multiple: true,
                      renderValue: (selected) => (product?.rows?.filter((p: any) => (selected as string[]).includes(p.id)).map((p: any) => p.name).join(', ') || '') as React.ReactNode,
                    }}
                  >
                    {product?.rows?.map((items: any) => (
                      <MenuItem key={items.id} value={items.id}>
                        {items.name} ({selectedBranch.country.currency} {items.price?.toFixed(2)})
                      </MenuItem>
                    ))}
                  </TextField>
                </Box>
              </Grid>

              {/* Product Info Display - This will be updated in a later step to show multiple products */}
              {selectedLead?.product_ids && selectedLead.product_ids.length > 0 && (
                <Grid item xs={12}>
                  <Box sx={{
                    p: 2,
                    mt: 2,
                    backgroundColor: (theme) => theme.palette.mode === 'dark' ? 'rgba(144, 202, 249, 0.08)' : 'rgba(25, 118, 210, 0.04)',
                    borderRadius: 1.5,
                    border: (theme) => `1px solid ${theme.palette.mode === 'dark' ? 'rgba(144, 202, 249, 0.2)' : 'rgba(25, 118, 210, 0.12)'}`
                  }}>
                    <Typography variant="subtitle2" sx={{ color: 'text.primary', mb: 1, fontWeight: 600 }}>
                      Selected Product Details
                    </Typography>
                    {selectedLead.product_ids.map((productId: string) => {
                      const selectedProduct = product?.rows?.find((p: any) => p.id === productId)
                      if (!selectedProduct) return null

                      return (
                        <Box key={productId} sx={{ mb: 1, pb: 1, borderBottom: '1px dashed rgba(0,0,0,0.1)' }}>
                          <Typography variant="body2" sx={{ mb: 0.5 }}>
                            <strong>Product:</strong> {selectedProduct.name}
                          </Typography>
                          <Typography variant="body2" sx={{ mb: 0.5 }}>
                            <strong>Description:</strong> {selectedProduct.desc}
                          </Typography>
                          <Typography variant="body2">
                            <strong>Price:</strong> {selectedBranch.country.currency} {selectedProduct.price?.toFixed(2)}
                          </Typography>
                        </Box>
                      )
                    })}
                  </Box>
                </Grid>
              )}
            </>
          )}

          {/* Discount Section */}
          <Grid item xs={12}>
            <Box sx={{
              p: 2,
              backgroundColor: (theme) => theme.palette.mode === 'dark' ? 'rgba(144, 202, 249, 0.08)' : 'rgba(25, 118, 210, 0.04)',
              borderRadius: 1.5,
              border: (theme) => `1px solid ${theme.palette.mode === 'dark' ? 'rgba(144, 202, 249, 0.2)' : 'rgba(25, 118, 210, 0.12)'}`
            }}>
              <Typography variant="subtitle2" sx={{ color: 'text.primary', mb: 1.5, fontWeight: 600 }}>
                Discount Settings
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={8}>
                  <TextField
                    fullWidth
                    label="Discount"
                    type="number"
                    value={invoiceData.discount}
                    onChange={e => setInvoiceData({ ...invoiceData, discount: e.target.value })}
                    error={!!invoiceErrors.discount}
                    helperText={invoiceErrors.discount}
                    size="small"
                    inputProps={{ min: 0, step: 0.01 }}
                  />
                </Grid>
              </Grid>
              <Typography variant="caption" color="textSecondary" sx={{ mt: 1, display: 'block' }}>
                {invoiceData.discountType === 'percentage'
                  ? 'Maximum: 90% (to ensure minimum invoice value)'
                  : 'Maximum: 90% of product price'}
              </Typography>
            </Box>
          </Grid>

          {/* Amount Paid */}
          <Grid item xs={12}>
            <Box sx={{
              p: 2,
              backgroundColor: (theme) => theme.palette.mode === 'dark' ? 'rgba(144, 202, 249, 0.08)' : 'rgba(25, 118, 210, 0.04)',
              borderRadius: 1.5,
              border: (theme) => `1px solid ${theme.palette.mode === 'dark' ? 'rgba(144, 202, 249, 0.2)' : 'rgba(25, 118, 210, 0.12)'}`
            }}>
              <Typography variant="subtitle2" sx={{ color: 'text.primary', mb: 1.5, fontWeight: 600 }}>
                Payment Details
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={8}>
                  <TextField
                    fullWidth
                    label="Amount Paid"
                    type="number"
                    value={invoiceData.amountPaid}
                    onChange={e => setInvoiceData({ ...invoiceData, amountPaid: e.target.value })}
                    error={!!invoiceErrors.amountPaid}
                    helperText={invoiceErrors.amountPaid}
                    size="small"
                    inputProps={{ min: 0, step: 0.01 }}
                  />
                </Grid>
              </Grid>
            </Box>
          </Grid>


        </Grid>
      </Modal >


    </Grid >
  )
}

export default LeadComponent
