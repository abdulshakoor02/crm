'use client';
// ** MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
// import { useTheme } from '@mui/material/styles'; // useTheme seems unused
import Typography from '@mui/material/Typography'
import { MenuItem, TextField, Button } from '@mui/material'
import { GridColumns, GridRenderCellParams } from '@mui/x-data-grid'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { styled } from '@mui/material/styles'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import axios from 'src/store/axios' // Assuming this is your configured axios instance

// ** Store Imports
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '../../../store'

import { getTenantData, createTenantData, updateTenantData } from '../../../store/apps/tenant'
import { getCountriesData } from '../../../store/apps/countries'
import DataGridTable from 'src/components/Datagrid'
import Modal from 'src/components/Model/Model'
import uuid from 'react-uuid' // Keep for MenuItems if no other stable key source
import { validateFormValues } from 'src/validation/validation'
import { checkAccess } from 'src/utils/accessCheck'; // Added for action button visibility

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1
})

type Tenant = {
  id?: string; // id is optional for new entries
  name: string;
  phone: string;
  email: string;
  website: string;
  country_id: string;
  status: string;
  logo?: string;
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
    field: 'phone',
    headerName: 'Phone',
    renderCell: (params: GridRenderCellParams) => (
      <Typography variant='body2' sx={{ color: 'text.primary' }}>
        {params?.row?.['phone']}
      </Typography>
    )
  },
  {
    flex: 0.1,
    minWidth: 150,
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
    field: 'website',
    headerName: 'Website',
    renderCell: (params: GridRenderCellParams) => (
      <Typography variant='body2' sx={{ color: 'text.primary' }}>
        {params?.row?.['website']}
      </Typography>
    )
  },
  {
    flex: 0.1,
    minWidth: 150,
    field: 'country', // Field name in data
    headerName: 'Country',
    renderCell: (params: GridRenderCellParams) => (
      <Typography variant='body2' sx={{ color: 'text.primary' }}>
        {params?.row?.country?.['name']} {/* Accessing nested property */}
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

export default function TenantPage() { // Renamed component
  // const theme = useTheme(); // Seems unused
  const dispatch = useDispatch<AppDispatch>()
  const [pageSize, setPageSize] = useState<number>(10)
  const [page, setPage] = useState<number>(0)
  const [searchValue, setSearchValue] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [file, setFile] = useState<FileList | null>(null) // Corrected type for file
  const [modalMode, setModalMode] = useState<'View' | 'Edit' | 'Add'>('View')
  const [formValues, setFormValues] = useState<Tenant>({
    id: undefined,
    name: '',
    phone: '',
    email: '',
    website: '',
    country_id: '',
    status: 'Active', // Default status
    logo: ''
  })
  const [errors, setErrors] = useState<Partial<Tenant>>({})

  const tenant = useSelector((state: RootState) => state.tenant)
  const countries = useSelector((state: RootState) => state.country)

  useEffect(() => {
    dispatch(getTenantData({ limit: pageSize, offset: pageSize * page, where: {name: searchValue}, joins: [{ column: 'Country' }] }))
    dispatch(getCountriesData({}))
  }, [pageSize, page, dispatch, searchValue]) // Added dispatch and searchValue

  const handleLogoDownload = async () => { // Renamed function
    if (!formValues.logo) {
      toast.error('No logo URL available');
      return;
    }
    try {
      // Assuming process.env.BASE_URL is configured for your API
      const response = await axios.post(`${process.env.BASE_URL || ''}/fileDownload`, { url: formValues.logo }, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      const fileName = formValues.logo.split('/').pop() || 'logo.png'; // Extract filename
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url); // Clean up
    } catch (error) {
      console.error("Logo download failed:", error);
      toast.error("Failed to download logo.");
    }
  }

  const handleOpenModal = async (id: string | null, mode: 'View' | 'Edit' | 'Add') => {
    let rowData: Tenant | undefined = undefined;
    if (id) {
      rowData = tenant?.rows?.find((row: Tenant) => row.id === id);
    }

    setFormValues(
      rowData
        ? {
            id: rowData.id,
            name: rowData.name,
            phone: rowData.phone,
            email: rowData.email,
            website: rowData.website,
            country_id: rowData.country_id,
            status: rowData.status,
            logo: rowData.logo || ''
          }
        : {
            id: undefined,
            name: '',
            phone: '',
            email: '',
            website: '',
            country_id: '',
            status: 'Active',
            logo: ''
          }
    )
    setFile(null); // Reset file on modal open
    setModalMode(mode)
    setModalOpen(true)
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => { // Typed event
    if (event.target.files) {
      setFile(event.target.files);
    }
  }

  const handleCloseModal = () => {
    setModalOpen(false)
    setErrors({})
  }

  const handleSubmit = async () => {
    const validationRules: Partial<Record<keyof Omit<Tenant, 'id' | 'logo'>, string>> = {
      name: 'Name is required',
      phone: 'Valid phone number is required',
      email: 'Email is required',
      website: 'Website is required',
      country_id: 'Country is required',
      status: 'Status is required'
    };

    // Exclude id and logo from validation for this purpose
    const valuesToValidate = { ...formValues };
    delete valuesToValidate.id;
    delete valuesToValidate.logo;


    const { hasError, errors: validationErrors } = validateFormValues(valuesToValidate, validationRules as any); // Cast to any if type mismatch
    if (hasError) {
      setErrors(validationErrors);
      return;
    }

    let dataToSubmit = { ...formValues };

    try {
      let tenantIdForFileUpload = dataToSubmit.id;

      if (modalMode === 'Add') {
        const { id, logo, ...addData } = dataToSubmit; // remove id and logo before creation
        const res = await dispatch(createTenantData([addData] as Tenant[])).unwrap();
        toast.success(`Tenant created successfully`);
        // Assuming the response `res` contains the created tenant with its new ID
        if (res && res.length > 0 && res[0].id) {
          tenantIdForFileUpload = res[0].id;
        } else {
          // Fallback or error if ID is not returned
          console.error("Tenant ID not available after creation for file upload.");
        }
      } else if (modalMode === 'Edit' && dataToSubmit.id) {
        const { logo, ...updateData } = dataToSubmit; // logo handled separately
        await dispatch(updateTenantData({ data: updateData, where: { id: dataToSubmit.id } })).unwrap();
        toast.success('Tenant updated successfully');
      }

      if (file && file[0] && tenantIdForFileUpload) {
        const formdata = new FormData();
        formdata.append('file', file[0]);
        await axios.post(`${process.env.BASE_URL || ''}/fileUpload`, formdata, {
          headers: {
            'Content-Type': 'multipart/form-data',
            filename: file[0].name, // Consider sanitizing filename
            folder: 'crm', // Or a more dynamic folder structure
            tenant_id: tenantIdForFileUpload
          }
        });
        toast.success('File uploaded successfully');
      }

      dispatch(getTenantData({ limit: pageSize, offset: pageSize * page, where: {name: searchValue}, joins: [{ column: 'Country' }] }));
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || `Failed to ${modalMode.toLowerCase()} tenant. Try Again!`);
    } finally {
      handleCloseModal();
    }
  }

  const handleDelete = (id: string) => {
    console.log("Delete Tenant with ID:", id);
  }

  const onClearSearch = async () => {
    setSearchValue('')
    if (page !== 0) setPage(0);
    dispatch(getTenantData({ limit: pageSize, offset: 0, joins: [{ column: 'Country' }] }));
  }

  const handleSearch = async () => {
    if (page !== 0) setPage(0);
    const whereClause = searchValue ? { name: searchValue } : {}; // Basic search by name
    dispatch(
      getTenantData({ limit: pageSize, offset: 0, where: whereClause, joins: [{ column: 'Country' }] })
    );
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <DataGridTable
            loading={tenant?.loading}
            checkBox={false}
            rows={tenant?.rows || []}
            columns={columns}
            total={tenant?.count || 0}
            pageSize={pageSize}
            changePageSize={(newPageSize: number) => setPageSize(newPageSize)}
            changePage={(newPage: number) => setPage(newPage)}
            searchValue={searchValue}
            onSearchChange={e => setSearchValue(e.target.value)}
            onSearch={handleSearch}
            onClearSearch={onClearSearch}
            edit={checkAccess('tenantEdit')}
            view={checkAccess('tenantView')}
            del={checkAccess('tenantDelete')}
            add={checkAccess('tenantCreate')}
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
        title={`${modalMode} Tenant`}
        onSubmit={handleSubmit}
        mode={modalMode}
      >
        {
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label='Name' value={formValues.name} onChange={e => setFormValues({ ...formValues, name: e.target.value })} error={!!errors.name} helperText={errors.name} disabled={modalMode === 'View'} margin='normal'/>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label='Phone' placeholder='+country code...' value={formValues.phone} onChange={e => setFormValues({ ...formValues, phone: e.target.value })} error={!!errors.phone} helperText={errors.phone} disabled={modalMode === 'View'} margin='normal'/>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label='Email' value={formValues.email} onChange={e => setFormValues({ ...formValues, email: e.target.value })} error={!!errors.email} helperText={errors.email} disabled={modalMode === 'View'} margin='normal'/>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label='Website' value={formValues.website} onChange={e => setFormValues({ ...formValues, website: e.target.value })} error={!!errors.website} helperText={errors.website} disabled={modalMode === 'View'} margin='normal'/>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth select name='country_id' value={formValues.country_id} label='Country' error={!!errors.country_id} helperText={errors.country_id} onChange={e => setFormValues({ ...formValues, country_id: e.target.value })} disabled={modalMode === 'View'} sx={{ mt: 2, mb: 1 }}>
                {countries?.rows?.map((item: any) => ( <MenuItem key={item.id} value={item.id}> {item.name} </MenuItem> ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth select name='status' value={formValues.status} label='Status' error={!!errors.status} helperText={errors.status} onChange={e => setFormValues({ ...formValues, status: e.target.value })} disabled={modalMode === 'View'} sx={{ mt: 2, mb: 1 }}>
                <MenuItem value='Active'>Active</MenuItem>
                <MenuItem value='inActive'>In Active</MenuItem>
              </TextField>
            </Grid>
            {modalMode !== 'View' && (
              <Grid item xs={12} sm={6}>
                <Button component="label" variant="contained" startIcon={<CloudUploadIcon />} sx={{ mt:2}}>
                  Upload Logo
                  <VisuallyHiddenInput type="file" onChange={handleFileChange} />
                </Button>
                {file && file[0] && <Typography variant="body2" sx={{mt:1}}>{file[0].name}</Typography>}
              </Grid>
            )}
            {modalMode === 'View' && formValues.logo && (
              <Grid item xs={12} sm={6}>
                <Button onClick={handleLogoDownload} sx={{mt:2}}>Download Logo</Button>
              </Grid>
            )}
          </Grid>
        }
      </Modal>
    </Grid>
  )
}
