import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(
  request: NextRequest,
  { params }: { params: { slug: string[] | undefined } } // slug can be undefined if route is /api/backend
) {
  try {
    const { slug } = params;
    let path = '';
    if (slug && Array.isArray(slug)) {
      path = '/' + slug.join('/');
    } else if (slug) { // Should not happen with [[...slug]] but good for robustness
        path = '/' + slug;
    }
    // If slug is undefined, path remains '', targeting process.env.baseUrl itself if intended
    // Or handle as an error if /api/backend direct POST is not expected.
    // Assuming for now that if slug is undefined, it means POST to /api/backend, which might not map to a valid backend URL without a path.
    // The original code implies slug will always be present. If /api/backend is hit, slug would be undefined.
    // Let's assume slug must exist based on original logic.
    if (!path && !(slug === undefined && request.nextUrl.pathname === '/api/backend')) { // Allow if path is /api/backend explicitly
        return NextResponse.json({ error: "Missing path segments for backend route." }, { status: 400 });
    }


    const body = await request.json();
    const token = request.headers.get('token');
    const headers: Record<string, string> = {};
    if (token) {
      headers['token'] = token;
    }

    const { data } = await axios.post(`${process.env.baseUrl!}${path}`, body, {
      headers: headers
    });
    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    console.error(error.response?.data, error.response?.status);
    const status = error.response?.status || 500;
    // Ensure error.response.data is serializable, or provide a generic message.
    let message: any = 'Internal Server Error'; // Changed to any to accept object
    if (typeof error.response?.data === 'string' || typeof error.response?.data === 'object') {
        message = error.response.data;
    } else if (error.message) {
        message = error.message;
    }
    return NextResponse.json({ error: message }, { status });
  }
}
