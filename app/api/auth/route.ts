import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const token = request.headers.get('token');
    const headers: Record<string, string> = {};
    if (token) {
      headers['token'] = token;
    }

    const { data } = await axios.post(`${process.env.baseUrl!}/auth`, body, {
      headers: headers
    });
    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    console.error(error);
    const status = error.response?.status || 500;
    const message = error.response?.data || error.message || 'Internal Server Error';
    return NextResponse.json({ error: message }, { status });
  }
}
