// src/components/users/UserForm.tsx
"use client";

import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Grid from '@mui/material/Grid';
import FormHelperText from '@mui/material/FormHelperText';

export interface UserFormData {
  id?: string;
  name: string;
  email: string;
  role: 'Admin' | 'Editor' | 'Viewer' | 'User' | '';
  status: 'Active' | 'Inactive' | 'Pending' | '';
  avatar?: string;
  password?: string;
  confirmPassword?: string;
}

interface UserFormProps {
  initialData?: Partial<UserFormData>;
  onSubmit: (data: UserFormData) => void;
  formId: string;
  isEditMode?: boolean;
}

const UserForm: React.FC<UserFormProps> = ({ initialData, onSubmit, formId, isEditMode = false }) => {
  const [formData, setFormData] = useState<UserFormData>({
    name: '',
    email: '',
    role: '',
    status: '',
    avatar: '',
    password: '',
    confirmPassword: '',
    ...initialData,
  });
  const [passwordError, setPasswordError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        email: initialData.email || '',
        role: initialData.role || '',
        status: initialData.status || '',
        avatar: initialData.avatar || '',
        password: '',
        confirmPassword: '',
        id: initialData.id,
      });
    } else {
      setFormData({
        name: '', email: '', role: '', status: '', avatar: '', password: '', confirmPassword: '',
      });
    }
    setPasswordError(null);
  }, [initialData]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>) => {
    const { name, value } = event.target;
    setFormData(prev => ({ ...prev, [name as string]: value }));
    if (name === "password" || name === "confirmPassword") {
        setPasswordError(null);
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (formData.password !== formData.confirmPassword) {
        setPasswordError("Passwords do not match.");
        return;
    }

    const dataToSubmit = { ...formData };
    if (isEditMode && (!dataToSubmit.password || dataToSubmit.password.trim() === '')) {
        delete dataToSubmit.password; // Don't send empty password for edit
        delete dataToSubmit.confirmPassword;
    } else if (!isEditMode && (!dataToSubmit.password || dataToSubmit.password.trim() === '')) {
        setPasswordError("Password is required for new users.");
        return;
    }

    // Remove confirmPassword before submitting if it exists
    if ('confirmPassword' in dataToSubmit) {
        delete dataToSubmit.confirmPassword;
    }

    onSubmit(dataToSubmit);
  };

  const userRoles: Exclude<UserFormData['role'], ''>[] = ["Admin", "Editor", "Viewer", "User"];
  const userStatuses: Exclude<UserFormData['status'], ''>[] = ["Active", "Inactive", "Pending"];

  return (
    <Box
      component="form"
      id={formId}
      onSubmit={handleSubmit}
      sx={{ mt: 1 }}
    >
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            fullWidth
            id={`${formId}-name`}
            label="Full Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            autoFocus
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            fullWidth
            id={`${formId}-email`}
            label="Email Address"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth required>
            <InputLabel id={`${formId}-role-label`}>Role</InputLabel>
            <Select
              labelId={`${formId}-role-label`}
              id={`${formId}-role`}
              name="role"
              value={formData.role}
              label="Role"
              onChange={handleChange}
            >
              <MenuItem value=""><em>Select Role</em></MenuItem>
              {userRoles.map((role) => (
                <MenuItem key={role} value={role}>{role}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth required>
            <InputLabel id={`${formId}-status-label`}>Status</InputLabel>
            <Select
              labelId={`${formId}-status-label`}
              id={`${formId}-status`}
              name="status"
              value={formData.status}
              label="Status"
              onChange={handleChange}
            >
              <MenuItem value=""><em>Select Status</em></MenuItem>
              {userStatuses.map((status) => (
                <MenuItem key={status} value={status}>{status}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            id={`${formId}-avatar`}
            label="Avatar URL (optional)"
            name="avatar"
            value={formData.avatar || ''} // Ensure controlled
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={6} />

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            id={`${formId}-password`}
            label={isEditMode ? "New Password (optional)" : "Password"}
            name="password"
            type="password"
            value={formData.password || ''} // Ensure controlled
            onChange={handleChange}
            required={!isEditMode}
            error={!!passwordError && (isEditMode ? !!formData.password : true)} // Show error if relevant
            helperText={isEditMode ? "Leave blank to keep current password." : ""}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            id={`${formId}-confirmPassword`}
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword || ''} // Ensure controlled
            onChange={handleChange}
            required={!isEditMode || !!formData.password}
            error={!!passwordError}
            helperText={passwordError}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default UserForm;
