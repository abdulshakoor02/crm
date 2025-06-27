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

const initialMockLeads: Lead[] = [
  { id: '1', name: 'John Doe', email: 'john.doe@example.com', phone: '123-456-7890', status: 'New', leadCategory: 'Product Inquiry', company: 'Acme Corp', createdAt: new Date(2023, 0, 15).toISOString() },
  { id: '2', name: 'Jane Smith', email: 'jane.smith@example.com', phone: '987-654-3210', status: 'Contacted', leadCategory: 'Demo Request', company: 'Beta LLC', createdAt: new Date(2023, 1, 20).toISOString() },
  { id: '3', name: 'Alice Brown', email: 'alice.brown@example.com', phone: '555-123-4567', status: 'Qualified', leadCategory: 'Referral', company: 'Gamma Inc', createdAt: new Date(2023, 2, 10).toISOString() },
  { id: '4', name: 'Bob Green', email: 'bob.green@example.com', phone: '555-987-6543', status: 'New', leadCategory: 'Website Signup', company: 'Delta Co', createdAt: new Date(2023, 3, 5).toISOString() },
  { id: '5', name: 'Charlie White', email: 'charlie.white@example.com', phone: '555-456-7890', status: 'Lost', leadCategory: 'Product Inquiry', company: 'Epsilon Ltd', createdAt: new Date(2023, 4, 1).toISOString() },
  { id: '6', name: 'Diana Prince', email: 'diana.prince@example.com', phone: '555-234-5678', status: 'New', leadCategory: 'Demo Request', company: 'Wonder Corp', createdAt: new Date(2023, 5, 12).toISOString() },
  { id: '7', name: 'Clark Kent', email: 'clark.kent@example.com', phone: '555-345-6789', status: 'Qualified', leadCategory: 'Website Signup', company: 'Daily Planet', createdAt: new Date(2023, 6, 22).toISOString() },
  { id: '8', name: 'Bruce Wayne', email: 'bruce.wayne@example.com', phone: '555-876-5432', status: 'Contacted', leadCategory: 'Referral', company: 'Wayne Enterprises', createdAt: new Date(2023, 7, 30).toISOString() },
  { id: '9', name: 'Peter Parker', email: 'peter.parker@example.com', phone: '555-765-4321', status: 'New', leadCategory: 'Product Inquiry', company: 'Daily Bugle', createdAt: new Date(2023, 8, 18).toISOString() },
  { id: '10', name: 'Tony Stark', email: 'tony.stark@example.com', phone: '555-654-3210', status: 'Won', leadCategory: 'Demo Request', company: 'Stark Industries', createdAt: new Date(2023, 9, 25).toISOString() },
];
let allMockLeadsDataSource = [...initialMockLeads];

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

  const leadFormId = "lead-capture-form"; // Define formId once

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
      setLeads(result.data || []);
      setTotalLeads(result.total || 0);
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
    setLoading(true);
    // This assumes GET /api/leads can filter by a single ID if id param is present
    // or that it returns all and we filter client-side.
    // For a real app, a dedicated /api/leads/[id] GET endpoint is better.
    const queryParams = new URLSearchParams({ id: id }).toString();
    const response = await fetch(`/api/leads?${queryParams}`);
    if(response.ok) {
        const result = await response.json();
        // Assuming API returns { data: [lead], total: 1 } or similar if ID is queried
        const foundLead = result.data.find((l: Lead) => l.id === id); // Ensure we find the exact lead
        if(foundLead) {
             setCurrentLead(foundLead);
             setModalMode('edit');
             setIsModalOpen(true);
        } else {
            console.error("Lead not found for edit via API with id:", id);
        }
    } else {
        console.error("Failed to fetch lead for edit");
    }
    setLoading(false);
  };

  const handleViewLeadModal = async (id: string) => {
    setLoading(true);
    const queryParams = new URLSearchParams({ id: id }).toString();
    const response = await fetch(`/api/leads?${queryParams}`);
    if(response.ok){
        const result = await response.json();
        const foundLead = result.data.find((l: Lead) => l.id === id);
        if(foundLead){
            setCurrentLead(foundLead);
            setModalMode('view');
            setIsModalOpen(true);
        } else {
             console.error("Lead not found for view with id:", id);
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
      fetchLeads(currentPage, pageSize, searchTerm);
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
    // For PUT, the ID is usually part of the URL or ensured in the body.
    // The current API for PUT expects ID in the body.
    const url = `/api/leads`;

    try {
      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data), // For PUT, ensure data includes id
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      fetchLeads(currentPage, pageSize, searchTerm);
      handleModalClose();
    } catch (error) {
      console.error("Failed to save lead:", error);
    } finally {
      setLoading(false);
    }
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
        onEdit={handleEditLeadModal}
        view={true}
        onView={handleViewLeadModal}
        del={true}
        onDelete={handleDeleteLead}
      />

      {isModalOpen && (
        <Model
          isOpen={isModalOpen}
          onClose={handleModalClose}
          // onSubmit prop of Model is no longer needed for form submission itself,
          // as the form's submit button (`type="submit" form={leadFormId}`) handles it.
          // It could be used for an action *after* the modal's primary action if needed.
          // For now, we can omit it or pass a no-op if the Model component requires it.
          // onSubmit={modalMode !== 'view' ? () => console.log("Modal default submit action (if any)") : undefined}
          title={modalMode === 'add' ? 'Add New Lead' : modalMode === 'edit' ? 'Edit Lead' : 'View Lead'}
          mode={modalMode}
          width={600}
          formId={leadFormId} // Pass the formId to the Model
        >
          <LeadForm
            formId={leadFormId} // Pass the formId to the LeadForm
            initialData={currentLead || undefined}
            onSubmit={handleFormSubmit}
          />
        </Model>
      )}
    </Box>
  );
};

export default LeadsPage;
