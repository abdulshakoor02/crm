// src/components/leads/LeadForm.tsx
"use client";

import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Grid from '@mui/material/Grid';

export interface LeadFormData {
  id?: string;
  name: string;
  email: string;
  phone: string;
  status: 'New' | 'Contacted' | 'Qualified' | 'Lost' | 'Won' | '';
  leadCategory: string;
  company?: string;
}

interface LeadFormProps {
  initialData?: Partial<LeadFormData>;
  onSubmit: (data: LeadFormData) => void;
  formId: string; // Added formId prop
}

const LeadForm: React.FC<LeadFormProps> = ({ initialData, onSubmit, formId }) => {
  const [formData, setFormData] = useState<LeadFormData>({
    name: '',
    email: '',
    phone: '',
    status: '',
    leadCategory: '',
    company: '',
    ...initialData,
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        email: initialData.email || '',
        phone: initialData.phone || '',
        status: initialData.status || '',
        leadCategory: initialData.leadCategory || '',
        company: initialData.company || '',
        id: initialData.id
      });
    } else {
      setFormData({
        name: '', email: '', phone: '', status: '', leadCategory: '', company: '',
      });
    }
  }, [initialData]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>) => {
    const { name, value } = event.target;
    setFormData(prev => ({ ...prev, [name as string]: value }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => { // Updated event type
    event.preventDefault(); // Prevent default form submission
    onSubmit(formData); // Call the passed onSubmit prop with form data
  };

  const leadCategories = ["Product Inquiry", "Demo Request", "Referral", "Website Signup", "Other"];
  const leadStatuses: LeadFormData['status'][] = ["New", "Contacted", "Qualified", "Lost", "Won"];

  return (
    <Box
      component="form" // Changed to form
      id={formId} // Use passed formId
      onSubmit={handleSubmit} // Handle submission
      sx={{ mt: 1 }}
    >
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            fullWidth
            id={`${formId}-name`} // Unique ID based on formId
            label="Lead Name"
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
            id={`${formId}-email`} // Unique ID
            label="Email Address"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            id={`${formId}-phone`} // Unique ID
            label="Phone Number"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            id={`${formId}-company`} // Unique ID
            label="Company"
            name="company"
            value={formData.company || ''}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth required>
            <InputLabel id={`${formId}-status-label`}>Status</InputLabel>
            <Select
              labelId={`${formId}-status-label`}
              id={`${formId}-status`} // Unique ID
              name="status"
              value={formData.status}
              label="Status"
              onChange={handleChange}
            >
              <MenuItem value=""><em>Select Status</em></MenuItem>
              {leadStatuses.filter(s => s !== '').map((status) => (
                <MenuItem key={status} value={status}>{status}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth required>
            <InputLabel id={`${formId}-leadCategory-label`}>Lead Category</InputLabel>
            <Select
              labelId={`${formId}-leadCategory-label`}
              id={`${formId}-leadCategory`} // Unique ID
              name="leadCategory"
              value={formData.leadCategory}
              label="Lead Category"
              onChange={handleChange}
            >
               <MenuItem value=""><em>Select Category</em></MenuItem>
              {leadCategories.map((category) => (
                <MenuItem key={category} value={category}>{category}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>
      {/* Submit button is now part of the Modal, associated by formId */}
    </Box>
  );
};

export default LeadForm;
