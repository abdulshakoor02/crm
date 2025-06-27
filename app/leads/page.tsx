// app/leads/page.tsx
"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { GridColDef } from '@mui/x-data-grid';

import DatagridTable from '@/components/Datagrid';
import Model from '@/components/Model/Model';
import LeadForm, { LeadFormData } from '@/components/leads/LeadForm';

export interface Lead extends LeadFormData {
  id: string;
  createdAt: string;
}

// This local mock data source is now only for initial state if API fails, or can be removed.
// The API route will be the source of truth.
// let allMockLeadsDataSource = [...initialMockLeads]; // Will be replaced by API calls

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 70 },
  { field: 'name', headerName: 'Name', flex: 1, minWidth: 150 },
  { field: 'email', headerName: 'Email', flex: 1, minWidth: 200 },
  { field: 'phone', headerName: 'Phone', flex: 0.5, minWidth: 120 },
  { field: 'company', headerName: 'Company', flex: 1, minWidth: 150 },
  { field: 'status', headerName: 'Status', flex: 0.5, minWidth: 100 },
  { field: 'leadCategory', headerName: 'Category', flex: 1, minWidth: 130 },
  {
    field: 'createdAt',
    headerName: 'Created At',
    flex: 0.5,
    minWidth: 150,
    valueFormatter: (params) => params.value ? new Date(params.value).toLocaleDateString() : '',
  },
];

const LeadsPage = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [totalLeads, setTotalLeads] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [currentPage, setCurrentPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit' | 'view'>('add');
  const [currentLead, setCurrentLead] = useState<Partial<LeadFormData> | null>(null);

  const fetchLeads = useCallback(async (page: number, size: number, term: string) => {
    setLoading(true);
    const queryParams = new URLSearchParams({
      page: String(page),
      size: String(size),
      term: term,
    }).toString();

    try {
      const response = await fetch(`/api/leads?${queryParams}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      setLeads(result.data || []); // Ensure result.data is an array
      setTotalLeads(result.total || 0); // Ensure result.total is a number
    } catch (error) {
      console.error("Failed to fetch leads:", error);
      setLeads([]);
      setTotalLeads(0);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLeads(currentPage, pageSize, searchTerm);
  }, [currentPage, pageSize, searchTerm, fetchLeads]);

  const handlePageChange = (newPage: number) => setCurrentPage(newPage);
  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(0);
  };
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setSearchTerm(event.target.value);
  const handleSearch = () => {
    setCurrentPage(0);
    // fetchLeads is already called by useEffect when searchTerm changes
  };
  const handleClearSearch = () => {
    setSearchTerm('');
    setCurrentPage(0);
  };

  const handleAddLeadModal = () => {
    setModalMode('add');
    setCurrentLead({});
    setIsModalOpen(true);
  };

  const handleEditLeadModal = async (id: string) => {
    // For edit, we might need to fetch the specific lead by ID if not already in list
    // Or assume the list has the latest data for simplicity now
    setLoading(true);
    const response = await fetch(`/api/leads?id=${id}`); // Assuming API can fetch by ID
    if(response.ok) {
        const result = await response.json();
        // Assuming the API returns a single lead object in result.data if id is provided,
        // or the API needs a specific endpoint like /api/leads/[id]
        // For now, let's assume the API GET /api/leads?id=X returns { data: [lead], total: 1 }
        if(result.data && result.data.length > 0) {
             setCurrentLead(result.data[0]);
             setModalMode('edit');
             setIsModalOpen(true);
        } else {
            console.error("Lead not found for edit via API");
        }
    } else {
        console.error("Failed to fetch lead for edit");
    }
    setLoading(false);
  };

  const handleViewLeadModal = async (id: string) => {
    setLoading(true);
    // Similar to edit, fetch the specific lead for viewing
    // This part depends on how your API is structured to fetch a single lead
    // For now, using a simplified approach, assuming GET /api/leads?id=X or similar
    const response = await fetch(`/api/leads?id=${id}`); // Placeholder: API needs to support fetching single lead
    if(response.ok){
        const result = await response.json();
        if(result.data && result.data.length > 0){ // Adjust based on actual API single item response
            setCurrentLead(result.data[0]);
            setModalMode('view');
            setIsModalOpen(true);
        } else {
             console.error("Lead not found for view");
        }
    } else {
        console.error("Failed to fetch lead for view");
    }
    setLoading(false);
  };

  const handleDeleteLead = async (id: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/leads?id=${id}`, { method: 'DELETE' });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      // const result = await response.json(); // Optional: check result message
      // console.log(result.message);
      fetchLeads(currentPage, pageSize, searchTerm); // Refresh data
    } catch (error) {
      console.error("Failed to delete lead:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setCurrentLead(null);
  };

  const handleFormSubmit = async (data: LeadFormData) => {
    setLoading(true);
    const method = data.id ? 'PUT' : 'POST';
    const url = data.id ? `/api/leads` : '/api/leads'; // For PUT, ID is in body

    try {
      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      // const savedLead = await response.json();
      // console.log(modalMode === 'add' ? 'Added lead:' : 'Edited lead:', savedLead);
      fetchLeads(currentPage, pageSize, searchTerm);
      handleModalClose();
    } catch (error) {
      console.error("Failed to save lead:", error);
      // Handle error display to user
    } finally {
      setLoading(false);
    }
  };

  const handleModalPrimaryAction = () => {
    // This function is called when the Modal's own "Submit" button is clicked.
    // It should trigger the submission of the LeadForm.
    // This requires LeadForm to expose a submit method via a ref, or for LeadForm to be a <form>
    // and this button to be type="submit" and associated with that form.
    // For now, this is a placeholder. The actual data submission is handled by LeadForm's onSubmit.
    // To make this work without a ref for now:
    // We can assume that if the user clicks "Submit" on the modal, they intend to submit the form.
    // However, the form data is within LeadForm.
    // The `handleFormSubmit` is already passed to `LeadForm`.
    // The `Model.tsx`'s `onSubmit` prop is this `handleModalPrimaryAction`.
    // This path is still a bit tangled.
    // The cleanest is for LeadForm to be a self-submitting <form> triggered by Model's button.
    // If `LeadForm.tsx` is updated to `<form onSubmit={internalHandlerThatCallsPropsOnSubmit}>`
    // and `Model.tsx`'s button is `type="submit" form="the-form-id"`, then this
    // `handleModalPrimaryAction` might not be needed, or would be for post-action.
    console.log("Modal's primary submit button clicked. Ideally, this triggers LeadForm submission.");
    // If using a ref to LeadForm:
    // if (leadFormRef.current) {
    //   leadFormRef.current.submit(); // Assuming LeadForm exposes a submit method
    // }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom component="h1">
        Leads Management
      </Typography>

      <DatagridTable
        rows={leads}
        columns={columns}
        total={totalLeads}
        loading={loading}
        pageSize={pageSize}
        changePageSize={handlePageSizeChange}
        changePage={handlePageChange}
        searchValue={searchTerm}
        onSearchChange={handleSearchChange}
        onSearch={handleSearch}
        onClearSearch={handleClearSearch}
        add={true}
        onAddRow={handleAddLeadModal}
        edit={true}
        onEdit={handleEditLeadModal} // Updated to use API for fetching data for edit
        view={true}
        onView={handleViewLeadModal} // Updated to use API for fetching data for view
        del={true}
        onDelete={handleDeleteLead} // Updated to use API
      />

      {isModalOpen && (
        <Model
          isOpen={isModalOpen}
          onClose={handleModalClose}
          onSubmit={modalMode !== 'view' ? handleModalPrimaryAction : undefined}
          title={modalMode === 'add' ? 'Add New Lead' : modalMode === 'edit' ? 'Edit Lead' : 'View Lead'}
          mode={modalMode}
          width={600}
        >
          <LeadForm
            // ref={leadFormRef} // If using ref for programmatic submission
            initialData={currentLead || undefined}
            onSubmit={handleFormSubmit}
          />
        </Model>
      )}
    </Box>
  );
};

export default LeadsPage;
