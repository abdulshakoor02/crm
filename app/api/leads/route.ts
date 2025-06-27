// app/api/leads/route.ts
import { NextResponse } from 'next/server';

// Define Lead type directly here or import from a shared location
// For this API route, it's better to have the type definition self-contained or from a shared types file.
export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: 'New' | 'Contacted' | 'Qualified' | 'Lost' | 'Won' | '';
  leadCategory: string;
  company?: string;
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

let leadsDB = [...initialMockLeads]; // In-memory "database"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  // Ensure page and size are numbers and have defaults
  const page = parseInt(searchParams.get('page') || '0', 10);
  const size = parseInt(searchParams.get('size') || '5', 10);
  const term = searchParams.get('term') || '';

  // Basic validation for page and size
  const validPage = Math.max(0, page);
  const validSize = Math.max(1, Math.min(100, size)); // Min 1, Max 100 per page

  let filteredLeads = leadsDB;
  if (term) {
    filteredLeads = leadsDB.filter(lead =>
      lead.name.toLowerCase().includes(term.toLowerCase()) ||
      lead.email.toLowerCase().includes(term.toLowerCase()) ||
      (lead.company && lead.company.toLowerCase().includes(term.toLowerCase()))
    );
  }

  const total = filteredLeads.length;
  const data = filteredLeads.slice(validPage * validSize, (validPage * validSize) + validSize);

  return NextResponse.json({ data, total });
}

export async function POST(request: Request) {
  try {
    const newLeadData: Partial<Lead> = await request.json(); // Use Partial as ID and createdAt are generated

    if (!newLeadData.name || !newLeadData.email) { // Basic validation
        return NextResponse.json({ message: 'Name and email are required' }, { status: 400 });
    }

    const newLead: Lead = {
      id: String(Date.now()), // Generate new ID
      name: newLeadData.name,
      email: newLeadData.email,
      phone: newLeadData.phone || '',
      status: newLeadData.status || 'New',
      leadCategory: newLeadData.leadCategory || 'Unknown',
      company: newLeadData.company || '',
      createdAt: new Date().toISOString(),
    };
    leadsDB.unshift(newLead);
    return NextResponse.json(newLead, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ message: 'Error creating lead', error: message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const updatedLeadData: Partial<Lead> & { id: string } = await request.json(); // ID is required for update

    if (!updatedLeadData.id) {
        return NextResponse.json({ message: 'Lead ID is required for update' }, { status: 400 });
    }

    const index = leadsDB.findIndex(lead => lead.id === updatedLeadData.id);
    if (index !== -1) {
      leadsDB[index] = { ...leadsDB[index], ...updatedLeadData };
      return NextResponse.json(leadsDB[index]);
    } else {
      return NextResponse.json({ message: 'Lead not found' }, { status: 404 });
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ message: 'Error updating lead', error: message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
   try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ message: 'Lead ID is required for delete' }, { status: 400 });
    }
    const initialLength = leadsDB.length;
    leadsDB = leadsDB.filter(lead => lead.id !== id);
    if (leadsDB.length < initialLength) {
      return NextResponse.json({ message: 'Lead deleted successfully' });
    } else {
      return NextResponse.json({ message: 'Lead not found' }, { status: 404 });
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ message: 'Error deleting lead', error: message }, { status: 500 });
  }
}
