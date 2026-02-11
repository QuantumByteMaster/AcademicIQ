import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

const apiUrl = process.env.API_URL || 'http://localhost:5000';
const internalSecret = process.env.INTERNAL_API_SECRET || '';

export async function POST(
  request: NextRequest,
  { params }: { params: { documentId: string } }
) {
  try {
    // Use getToken to authenticate instead of reading x-user-id from headers
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token || !token.id) {
      return NextResponse.json(
        { error: 'Unauthorized - Please sign in' },
        { status: 401 }
      );
    }

    const userId = token.id as string;
    const { documentId } = params;
    const body = await request.json();

    const response = await fetch(`${apiUrl}/pdf/${documentId}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-user-id': userId,
        'x-internal-secret': internalSecret,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(
        { error: error.message || 'Failed to process chat request' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in PDF chat:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}