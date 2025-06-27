// app/user/page.tsx
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Avatar from '@mui/material/Avatar';
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { confirm } from "material-ui-confirm"; // For delete confirmation

import DatagridTable from '@/components/Datagrid';
import Model from '@/components/Model/Model';
import UserForm, { UserFormData } from '@/components/users/UserForm';

export interface User extends UserFormData {
  id: string;
  createdAt: string;
}

const userColumns: GridColDef<User>[] = [
  {
    field: 'avatar',
    headerName: '',
    width: 60,
    renderCell: (params: GridRenderCellParams<User>) => (
      <Avatar src={params.row.avatar || undefined} alt={params.row.name} sx={{ width: 36, height: 36 }} />
    ),
    sortable: false,
    filterable: false,
    align: 'center',
    headerAlign: 'center',
  },
  { field: 'name', headerName: 'Name', flex: 1, minWidth: 180 },
  { field: 'email', headerName: 'Email', flex: 1, minWidth: 220 },
  {
    field: 'role',
    headerName: 'Role',
    flex: 0.7,
    minWidth: 100,
  },
  {
    field: 'status',
    headerName: 'Status',
    flex: 0.5,
    minWidth: 100,
    renderCell: (params: GridRenderCellParams<User>) => (
      <Typography
        variant="caption"
        sx={{
          px: 1.5,
          py: 0.5,
          borderRadius: '6px',
          color: 'common.white',
          backgroundColor: params.value === 'Active' ? 'success.main'
                         : params.value === 'Inactive' ? 'error.main'
                         : 'warning.main',
          fontWeight: 500,
          textTransform: 'capitalize'
        }}
      >
        {params.value}
      </Typography>
    ),
  },
  {
    field: 'createdAt',
    headerName: 'Created At',
    flex: 0.8,
    minWidth: 120,
    valueFormatter: (params) => params.value ? new Date(params.value).toLocaleDateString() : '',
  },
];


const UserManagementPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [currentPage, setCurrentPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [userModalMode, setUserModalMode] = useState<'add' | 'edit' | 'view'>('add');
  const [currentUser, setCurrentUser] = useState<Partial<UserFormData> | null>(null);

  const userFormId = "user-capture-form";

  const fetchUsers = useCallback(async (page: number, size: number, term: string) => {
    setLoading(true);
    const queryParams = new URLSearchParams({
      page: String(page),
      size: String(size),
      term: term,
    }).toString();

    try {
      const response = await fetch(`/api/users?${queryParams}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      setUsers(result.data || []);
      setTotalUsers(result.total || 0);
    } catch (error) {
      console.error("Failed to fetch users:", error);
      setUsers([]);
      setTotalUsers(0);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers(currentPage, pageSize, searchTerm);
  }, [currentPage, pageSize, searchTerm, fetchUsers]);

  const handlePageChange = (newPage: number) => setCurrentPage(newPage);
  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(0);
  };
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setSearchTerm(event.target.value);
  };
  const handleSearch = () => {
    setCurrentPage(0);
  };
  const handleClearSearch = () => {
    setSearchTerm('');
    setCurrentPage(0);
  };

  const handleAddUserModal = () => {
    setUserModalMode('add');
    setCurrentUser({});
    setIsUserModalOpen(true);
  };

  const handleEditUserModal = async (id: string) => {
    setLoading(true);
    const queryParams = new URLSearchParams({ id }).toString();
    try {
      const response = await fetch(`/api/users?${queryParams}`);
      if (!response.ok) throw new Error("Failed to fetch user for editing.");
      const result = await response.json();
      const userToEdit = result.data.find((u: User) => u.id === id);
      if (userToEdit) {
        setCurrentUser(userToEdit);
        setUserModalMode('edit');
        setIsUserModalOpen(true);
      } else {
        console.error("User not found for ID:", id);
      }
    } catch (error) {
      console.error("Error fetching user for edit:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewUser = (id: string) => {
    console.log('View user (opening edit modal for now):', id);
    handleEditUserModal(id);
  };

  const handleDeleteUser = async (id: string) => {
    try {
      // Confirmation dialog
      await confirm({
        title: "Confirm Deletion",
        description: "Are you sure you want to delete this user? This action cannot be undone.",
        confirmationText: "Delete",
        cancellationText: "Cancel",
      });

      // If confirmed, proceed with deletion
      setLoading(true);
      const response = await fetch(`/api/users?id=${id}`, { method: 'DELETE' });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      // console.log('User deleted successfully');
      fetchUsers(currentPage, pageSize, searchTerm); // Refresh user list
    } catch (error) {
      // If confirm throws (meaning user cancelled), error will be an empty object or specific type by material-ui-confirm
      // We only care about actual fetch errors here.
      if (error && (error as Error).message) { // Check if it's an actual error object
        console.error("Failed to delete user:", (error as Error).message);
      } else {
        console.log("User deletion cancelled.");
      }
    } finally {
      setLoading(false);
    }
  };


  const handleUserModalClose = () => {
    setIsUserModalOpen(false);
    setCurrentUser(null);
  };

  const handleUserFormSubmit = async (data: UserFormData) => {
    setLoading(true);
    const method = data.id ? 'PUT' : 'POST';
    const url = `/api/users`;

    try {
      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const errorData = await response.json();
        console.error("API Error:", errorData);
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      fetchUsers(currentPage, pageSize, searchTerm);
      handleUserModalClose();
    } catch (error) {
      console.error("Failed to save user:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom component="h1">
        User Management
      </Typography>
      <Typography variant="body1" paragraph>
        Manage user accounts and permissions.
      </Typography>

      <Box id="user-datagrid-container" sx={{ mt: 2 }}>
        <DatagridTable
          rows={users}
          columns={userColumns}
          total={totalUsers}
          loading={loading}
          pageSize={pageSize}
          changePageSize={handlePageSizeChange}
          changePage={handlePageChange}
          searchValue={searchTerm}
          onSearchChange={handleSearchChange}
          onSearch={handleSearch}
          onClearSearch={handleClearSearch}
          add={true}
          onAddRow={handleAddUserModal}
          edit={true}
          onEdit={handleEditUserModal}
          view={true}
          onView={handleViewUser}
          del={true}
          onDelete={handleDeleteUser} // Connected to the implemented handler
        />
      </Box>

      {isUserModalOpen && (
        <Model
          isOpen={isUserModalOpen}
          onClose={handleUserModalClose}
          title={userModalMode === 'add' ? 'Add New User' : 'Edit User'}
          mode={userModalMode as 'add' | 'edit'}
          width={600}
          formId={userFormId}
        >
          <UserForm
            formId={userFormId}
            initialData={currentUser || undefined}
            onSubmit={handleUserFormSubmit}
            isEditMode={userModalMode === 'edit'}
          />
        </Model>
      )}
    </Box>
  );
};

export default UserManagementPage;
