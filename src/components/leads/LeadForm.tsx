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

// Define LeadData type for the form
// This should ideally be consistent with the Lead type in app/leads/page.tsx
// For simplicity here, we redefine a compatible version.
export interface LeadFormData { // Renamed to avoid conflict if Lead type is imported
  id?: string; // Optional for new leads
  name: string;
  email: string;
  phone: string;
  status: 'New' | 'Contacted' | 'Qualified' | 'Lost' | 'Won' | ''; // Allow empty for initial state
  leadCategory: string;
  company?: string;
}

interface LeadFormProps {
  initialData?: Partial<LeadFormData>;
  onSubmit: (data: LeadFormData) => void;
  // onCancel could be added if needed, but Modal handles its own cancel
}

const LeadForm: React.FC<LeadFormProps> = ({ initialData, onSubmit }) => {
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
      // Ensure all fields are updated, even if some in initialData are undefined
      setFormData({
        name: initialData.name || '',
        email: initialData.email || '',
        phone: initialData.phone || '',
        status: initialData.status || '',
        leadCategory: initialData.leadCategory || '',
        company: initialData.company || '',
        id: initialData.id // Preserve ID if present
      });
    } else {
      // Reset form for 'add' mode
      setFormData({
        name: '', email: '', phone: '', status: '', leadCategory: '', company: '',
      });
    }
  }, [initialData]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>) => {
    const { name, value } = event.target;
    setFormData(prev => ({ ...prev, [name as string]: value })); // Added 'as string' for name key
  };

  // This local handleSubmit is not strictly needed if the Modal handles the form submission trigger.
  // However, it's good practice for form components to be submittable on their own.
  // The Modal's submit button will call the onSubmit passed in props.
  const handleFormSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onSubmit(formData); // Call the prop onSubmit
  };

  const leadCategories = ["Product Inquiry", "Demo Request", "Referral", "Website Signup", "Other"];
  const leadStatuses: LeadFormData['status'][] = ["New", "Contacted", "Qualified", "Lost", "Won"];

  return (
    // The Modal will provide its own submit button, so this form doesn't need to include one.
    // The Modal's submit button will call the `onSubmit` prop passed to `LeadForm`.
    // For this reason, we don't need a <form> tag here if the Modal's button triggers submission.
    // However, using a <form> tag is good for accessibility and allows Enter key submission in some cases.
    // The Modal's `onSubmit` will call the `onSubmit` prop of this form.
    <Box component="div" sx={{ mt: 1 }}> {/* Changed from form to div, submission handled by Modal */}
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            fullWidth
            id="lead-form-name" // Unique ID
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
            id="lead-form-email" // Unique ID
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
            id="lead-form-phone" // Unique ID
            label="Phone Number"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            id="lead-form-company" // Unique ID
            label="Company"
            name="company"
            value={formData.company || ''} // Ensure controlled component
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth required>
            <InputLabel id="lead-form-status-label">Status</InputLabel>
            <Select
              labelId="lead-form-status-label"
              id="lead-form-status" // Unique ID
              name="status"
              value={formData.status}
              label="Status"
              onChange={handleChange}
            >
              <MenuItem value=""><em>Select Status</em></MenuItem> {/* Added empty option */}
              {leadStatuses.filter(s => s !== '').map((status) => ( // Filter out empty string for display
                <MenuItem key={status} value={status}>{status}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth required>
            <InputLabel id="lead-form-leadCategory-label">Lead Category</InputLabel>
            <Select
              labelId="lead-form-leadCategory-label"
              id="lead-form-leadCategory" // Unique ID
              name="leadCategory"
              value={formData.leadCategory}
              label="Lead Category"
              onChange={handleChange}
            >
               <MenuItem value=""><em>Select Category</em></MenuItem> {/* Added empty option */}
              {leadCategories.map((category) => (
                <MenuItem key={category} value={category}>{category}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>
    </Box>
  );
};

export default LeadForm;
