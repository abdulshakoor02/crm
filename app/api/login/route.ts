import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    // Note: Original login.ts didn't forward any specific headers like token.
    const { data } = await axios.post(`${process.env.baseUrl!}/login`, body);
    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    console.error(error);
    const status = error.response?.status || 500;
    const message = error.response?.data || error.message || 'Internal Server Error';
    return NextResponse.json({ error: message }, { status });
  }
}
