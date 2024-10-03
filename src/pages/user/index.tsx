// ** MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import { useTheme } from '@mui/material/styles'
import uuid from 'react-uuid'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import { DataGrid, GridColumns, GridRenderCellParams, GridSortModel, GridToolbarContainer } from '@mui/x-data-grid'
import DataGridTable from '../components/Datagrid'
import { useState } from 'react'
import { Button, IconButton, TextField } from '@mui/material'
import Modal from '../components/Model/Model'

const initialData = [
  { id: 1, name: 'Alice', age: 30, city: 'New York' },
  { id: 2, name: 'Bob', age: 25, city: 'London' },
  { id: 3, name: 'Charlie', age: 42, city: 'Paris' },
  { id: 4, name: 'Diana', age: 28, city: 'Berlin' },
  { id: 5, name: 'Ethan', age: 35, city: 'Tokyo' }
]

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
    field: 'age',
    headerName: 'Age',
    renderCell: (params: GridRenderCellParams) => (
      <Typography variant='body2' sx={{ color: 'text.primary' }}>
        {params?.row?.['age']}
      </Typography>
    )
  },
  {
    flex: 0.1,
    minWidth: 150,
    field: 'city',
    headerName: 'City',
    renderCell: (params: GridRenderCellParams) => (
      <Typography variant='body2' sx={{ color: 'text.primary' }}>
        {params?.row?.['city']}
      </Typography>
    )
  }
]

const SecondPage = () => {
  const theme = useTheme()

  // Pagination state
  const [pageSize, setPageSize] = useState(10)
  const [page, setPage] = useState(0);
  const [data, setData] = useState(initialData);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'view' | 'edit' | 'add'>('view');
  const [selectedRow, setSelectedRow] = useState<any>(null);
  const [formValues, setFormValues] = useState({ name: '', age: 0, city: '' });
  const [errors, setErrors] = useState({ name: '', age: '', city: '' });
  const [searchValue, setSearchValue] = useState("");

  const handleOpenModal = (id: number, mode: 'view' | 'edit' | 'add') => {
    const rowData = data.find(row => row.id === id);
    setSelectedRow(rowData);
    setFormValues(rowData ? {
      name: rowData.name,
      age: rowData.age, // Ensure age is a string
      city: rowData.city
    } : { name: '', age: 0, city: '' });
    setModalMode(mode);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedRow(null);
    setErrors({ name: '', age: '', city: '' }); // Reset errors
  };

  const handleSubmit = () => {
    let validationErrors = { name: '', age: '', city: '' };
    let isValid = true;

    // Validation logic
    if (!formValues.name) {
      validationErrors.name = 'Name is required';
      isValid = false;
    }
    if (!formValues.age || isNaN(Number(formValues.age))) {
      validationErrors.age = 'Valid age is required';
      isValid = false;
    }
    if (!formValues.city) {
      validationErrors.city = 'City is required';
      isValid = false;
    }

    if (!isValid) {
      setErrors(validationErrors);
      return;
    }

    if (modalMode === 'edit') {
      setData(prevData =>
        prevData.map(row => (row.id === selectedRow.id ? { ...row, ...formValues } : row))
      );
    }

    if (modalMode === 'add') {
      // Assuming formValues contains all the necessary data for the new row
      const newRow = {
        id: data.length + 1, // or another unique ID generation method
        ...formValues
      };
      setData(prevData => [...prevData, newRow]);
    }

    handleCloseModal();
  };

  const handleDelete = (id: number) => {
    setData(prevData => prevData.filter(row => row.id !== id));
  };

  // Handlers for page size and page change
  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize)
  }

  const handlePageChange = (newPage: number) => {
    setPage(newPage)
  }

  // Function to handle search input change
  const onSearchChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setSearchValue(event.target.value); // Only updates searchValue, no search triggered yet
  };

   // Function to handle search when the Enter key is pressed or search button is clicked
  const onSearch = () => {
    if (searchValue.trim()) {
      const filteredData = initialData.filter(
        (item) =>
          item.name.toLowerCase().includes(searchValue.toLowerCase()) ||
          item.city.toLowerCase().includes(searchValue.toLowerCase()) ||
          item.age.toString().includes(searchValue)
      );
      setData(filteredData);
    }
  };

  // Handler for clearing the search
  const handleClearSearch = () => {
    setSearchValue(""); // Clear search input
    setData(initialData); // Reset data to original state
  };

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <DataGridTable
            rows={data}
            columns={columns}
            total={data.length}
            onView={id => handleOpenModal(id, 'view')}
            onEdit={id => handleOpenModal(id, 'edit')}
            onDelete={id => handleDelete(id)}
            onAddRow={() => handleOpenModal(0, 'add')}
            changePage={handlePageChange}
            changePageSize={handlePageSizeChange}
            pageSize={pageSize}
            searchValue={searchValue}
            onSearch={onSearch}
            onSearchChange={(e) => {
              onSearchChange(e)
            }}
            onClearSearch={handleClearSearch}
            checkBox={true}
          />
        </Card>
      </Grid>

      {/* Modal */}
      <Modal isOpen={modalOpen} onClose={handleCloseModal} title={modalMode === 'edit' ? 'Edit Row' : 'View Row'} onSubmit={handleSubmit} mode={modalMode}>
          {
            <>
              <TextField
                fullWidth
                label="Name"
                value={formValues.name}
                onChange={(e) => setFormValues({ ...formValues, name: e.target.value })}
                error={!!errors.name}
                helperText={errors.name}
                disabled={modalMode === 'view'}
                sx={{
                  "& .MuiInputBase-input.Mui-disabled": {
                    WebkitTextFillColor: "#000000", //Adjust text color here
                  },
                  "& .MuiInputLabel-root.Mui-disabled": {
                    color: "rgba(0, 0, 0, 0.87)", // Darker label color
                  },
                 }}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Age"
                type="number"
                value={formValues.age}
                onChange={(e) => setFormValues({ ...formValues, age: Number(e.target.value) })}
                error={!!errors.age}
                helperText={errors.age}
                disabled={modalMode === 'view'}
                sx={{
                  "& .MuiInputBase-input.Mui-disabled": {
                    WebkitTextFillColor: "#000000", //Adjust text color here
                  },
                  "& .MuiInputLabel-root.Mui-disabled": {
                    color: "rgba(0, 0, 0, 0.87)", // Darker label color
                  },
                 }}
                margin="normal"
              />
              <TextField
                fullWidth
                label="City"
                value={formValues.city}
                onChange={(e) => setFormValues({ ...formValues, city: e.target.value })}
                error={!!errors.city}
                helperText={errors.city}
                disabled={modalMode === 'view'}
               sx={{
                "& .MuiInputBase-input.Mui-disabled": {
                  WebkitTextFillColor: "#000000", //Adjust text color here
                },
                "& .MuiInputLabel-root.Mui-disabled": {
                  color: "rgba(0, 0, 0, 0.87)", // Darker label color
                },
               }}
                margin="normal"
              />
            </>
          }
      </Modal>
    </Grid>
  )
}

export default SecondPage
