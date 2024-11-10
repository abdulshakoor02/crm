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
  Button
} from '@mui/material'
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { GridColDef, GridColumns, GridRenderCellParams } from '@mui/x-data-grid'
import { useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import moment from 'moment'

// ** Store Imports
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch } from 'src/store'

import { getLeadData, createLeadData, updateLeadData } from 'src/store/apps/leads'
import { getAdditionalInfoData, createAdditionalInfoData } from 'src/store/apps/additionalInfo'
import { getEmployeesData } from 'src/store/apps/user'
import { getCountriesData } from 'src/store/apps/countries'
import { getBranchData } from 'src/store/apps/branch'
import { getLeadCategoryData } from 'src/store/apps/leadCategory'
import DataGridTable from 'src/pages/components/Datagrid'
import Modal from 'src/pages/components/Model/Model'
import { appendTenantId } from 'src/pages/utils/tenantAppend'
import uuid from 'react-uuid'
import { DescriptionOutlined } from '@mui/icons-material'
import { useRouter } from 'next/router';
import { checkAccess } from '../utils/accessCheck';

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
  product_id?: string
  tenant_id?: string
}

const LeadComponent = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const [pageSize, setPageSize] = useState<number>(10)
  const [page, setPage] = useState<number>(0)
  const [searchValue, setSearchValue] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [dailogOpen, setDailogOpen] = useState(false)
  const [modalMode, setModalMode] = useState<'View' | 'Edit' | 'Add'>('View')
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
    lead_category_id: ''
  })
  const [errors, setErrors] = useState<Lead>({
    name: '',
    email: '',
    mobile: '',
    address: '',
    country_id: '',
    employee_id: '',
    branch_id: '',
    lead_category_id: ''
  })

  const leads = useSelector((state: any) => state.leads)
  const user = useSelector((state: any) => state.user)
  const branch = useSelector((state: any) => state.branch)
  const country = useSelector((state: any) => state.country)
  const leadCategory = useSelector((state: any) => state.leadCategory)
  const comments = useSelector((state: any) => state.additionalInfo)
  const columns: GridColumns = useMemo(() => {
    const baseColumns = [
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
    ];
  
    // Dynamically include 'assigned_user' column if the user has access
    if (checkAccess('AssignedUserColumn')) {
      baseColumns.push({
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
      });
    }
  
    return baseColumns;
  }, [checkAccess]); // Add `checkAccess` to the dependency array
  

  useEffect(() => {
    dispatch(
      getLeadData({
        limit: pageSize,
        offset: pageSize * page,
        orderBy: '"leads".created_at desc',
        joins: [{ column: 'Country' }, { column: 'Branch' }, { column: 'LeadCategory' }, { column: 'Employee' }]
      })
    )
  }, [pageSize, page])

  useEffect(() => {
    dispatch(getEmployeesData({}))
    dispatch(getCountriesData({}))
    dispatch(getBranchData({ joins: [{ column: 'Region' }] }))
    dispatch(getLeadCategoryData({}))
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
            lead_category_id: rowData.lead_category_id
          }
        : {
            name: '',
            email: '',
            mobile: '',
            address: '',
            country_id: '',
            employee_id: '',
            branch_id: '',
            lead_category_id: ''
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
      lead_category_id: ''
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
      lead_category_id: ''
    }
    let isValid = true

    // Validation logic
    for (const i in validationErrors) {
      if(i == 'employee_id') {
        continue;
      }
      if (!formValues[i as keyof Lead]) {
        validationErrors[i as keyof Lead] = `Valid ${i} is required`
        isValid = false
      }
    }

    if (!isValid) {
      setErrors(validationErrors)

      return
    }
    try {
      if (modalMode == 'Edit') {
        const res = await dispatch(updateLeadData({ data: formValues, where: { id: formValues.id } }))
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
      appendTenantId(formValues)
      data.push(formValues)
      const res = await dispatch(createLeadData(data))
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
            <Grid item xs={6}>
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
            <Grid item xs={6}>
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
            <Grid item xs={6}>
            {
              checkAccess('AssignedUserColumn') && (
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
              )
            }
            </Grid>
            <Grid item xs={6}>
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
            <Grid item xs={6}>
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
            <Grid item xs={12}></Grid>
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
    </Grid>
  )
}

export default LeadComponent
