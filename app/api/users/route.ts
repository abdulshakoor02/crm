// app/api/users/route.ts
import { NextResponse } from 'next/server';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Editor' | 'Viewer' | 'User';
  status: 'Active' | 'Inactive' | 'Pending';
  createdAt: string;
  avatar?: string;
}

const initialMockUsers: User[] = [
  { id: 'u1', name: 'Alice Wonderland', email: 'alice@example.com', role: 'Admin', status: 'Active', createdAt: new Date(2023, 0, 10).toISOString(), avatar: '/images/avatars/1.png' },
  { id: 'u2', name: 'Bob The Builder', email: 'bob@example.com', role: 'Editor', status: 'Active', createdAt: new Date(2023, 1, 15).toISOString(), avatar: '/images/avatars/default.png' },
  { id: 'u3', name: 'Charlie Chaplin', email: 'charlie@example.com', role: 'Viewer', status: 'Inactive', createdAt: new Date(2023, 2, 20).toISOString(), avatar: '/images/avatars/3.png' },
  { id: 'u4', name: 'David Copperfield', email: 'david@example.com', role: 'User', status: 'Pending', createdAt: new Date(2023, 3, 25).toISOString(), avatar: '/images/avatars/4.png' },
  { id: 'u5', name: 'Eve Harrington', email: 'eve@example.com', role: 'Editor', status: 'Active', createdAt: new Date(2023, 4, 30).toISOString(), avatar: '/images/avatars/5.png' },
  { id: 'u6', name: 'Frankenstein Monster', email: 'frank@example.com', role: 'User', status: 'Active', createdAt: new Date(2023, 5, 5).toISOString(), avatar: '/images/avatars/default.png' },
  { id: 'u7', name: 'Grace OMalley', email: 'grace@example.com', role: 'Admin', status: 'Active', createdAt: new Date(2023, 6, 10).toISOString(), avatar: '/images/avatars/1.png' },
  { id: 'u8', name: 'Harry Potter', email: 'harry@example.com', role: 'Viewer', status: 'Inactive', createdAt: new Date(2023, 7, 15).toISOString(), avatar: '/images/avatars/3.png' },
  { id: 'u9', name: 'Irene Adler', email: 'irene@example.com', role: 'Editor', status: 'Pending', createdAt: new Date(2023, 8, 20).toISOString(), avatar: '/images/avatars/4.png' },
  { id: 'u10', name: 'James Bond', email: 'james@example.com', role: 'User', status: 'Active', createdAt: new Date(2023, 9, 25).toISOString(), avatar: '/images/avatars/5.png' },
];

let usersDB = [...initialMockUsers];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '0', 10);
  const size = parseInt(searchParams.get('size') || '5', 10);
  const term = searchParams.get('term') || '';
  const id = searchParams.get('id'); // For fetching a single user by ID

  const validPage = Math.max(0, page);
  const validSize = Math.max(1, Math.min(100, size));

  let results = usersDB;

  if (id) {
    results = usersDB.filter(user => user.id === id);
  } else if (term) {
    results = usersDB.filter(user =>
      user.name.toLowerCase().includes(term.toLowerCase()) ||
      user.email.toLowerCase().includes(term.toLowerCase()) ||
      user.role.toLowerCase().includes(term.toLowerCase())
    );
  }

  const total = results.length;
  // If fetching by ID, pagination is not applied to the single result
  const data = id ? results : results.slice(validPage * validSize, (validPage * validSize) + validSize);

  return NextResponse.json({ data, total });
}

export async function POST(request: Request) {
  try {
    const newUserData: Omit<User, 'id' | 'createdAt'> = await request.json();
    if (!newUserData.name || !newUserData.email || !newUserData.role) {
        return NextResponse.json({ message: 'Name, email, and role are required' }, { status: 400 });
    }
    const newUser: User = {
      id: `u${Date.now()}`, // Simple unique ID
      name: newUserData.name,
      email: newUserData.email,
      role: newUserData.role,
      status: newUserData.status || 'Pending',
      createdAt: new Date().toISOString(),
      avatar: newUserData.avatar || '/images/avatars/default.png',
    };
    usersDB.unshift(newUser);
    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ message: 'Error creating user', error: message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
   try {
    const updatedUserData: Partial<User> & { id: string } = await request.json();
    if (!updatedUserData.id) {
        return NextResponse.json({ message: 'User ID is required for update' }, { status: 400 });
    }
    const index = usersDB.findIndex(user => user.id === updatedUserData.id);
    if (index !== -1) {
      usersDB[index] = { ...usersDB[index], ...updatedUserData };
      return NextResponse.json(usersDB[index]);
    } else {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ message: 'Error updating user', error: message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
   try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ message: 'User ID is required for delete' }, { status: 400 });
    }
    const initialLength = usersDB.length;
    usersDB = usersDB.filter(user => user.id !== id);
    if (usersDB.length < initialLength) {
      return NextResponse.json({ message: 'User deleted successfully' });
    } else {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ message: 'Error deleting user', error: message }, { status: 500 });
  }
}
