"use client";

import React, { useEffect } from 'react';
import useLeadStore from '@/stores/leadStore'; // Assuming stores are in @/stores

export default function LeadList() {
  const { leads, isLoading, error, fetchLeads, addLead, deleteLead } = useLeadStore();

  useEffect(() => {
    // Fetch leads when the component mounts
    fetchLeads();
  }, [fetchLeads]);

  const handleAddDummyLead = () => {
    const dummyLeadData = {
      companyName: `Dummy Corp ${Date.now()}`,
      contactPerson: "Dummy Contact",
      email: `dummy${Date.now()}@example.com`,
      status: 'new' as const,
    };
    addLead(dummyLeadData);
  };

  if (isLoading && leads.length === 0) { // Show loading only on initial load or if explicitly set
    return <p>Loading leads...</p>;
  }

  if (error) {
    return <p>Error fetching leads: {error}</p>;
  }

  return (
    <div>
      <h2>Leads</h2>
      <button onClick={handleAddDummyLead} disabled={isLoading}>
        {isLoading ? 'Adding...' : 'Add Dummy Lead'}
      </button>
      <button onClick={() => fetchLeads()} disabled={isLoading} style={{ marginLeft: '10px' }}>
        {isLoading ? 'Refreshing...' : 'Refresh Leads'}
      </button>
      {leads.length === 0 && !isLoading && <p>No leads found.</p>}
      <ul>
        {leads.map((lead) => (
          <li key={lead.id} style={{ margin: '10px 0', padding: '10px', border: '1px solid #eee' }}>
            <strong>{lead.companyName}</strong> ({lead.status})<br />
            {lead.contactPerson} - {lead.email}<br />
            <small>Created: {new Date(lead.createdAt).toLocaleDateString()}</small><br/>
            <button onClick={() => deleteLead(lead.id)} disabled={isLoading} style={{color: 'red', marginTop: '5px'}}>
              Delete
            </button>
          </li>
        ))}
      </ul>
      {isLoading && <p>Updating...</p>}
    </div>
  );
}
