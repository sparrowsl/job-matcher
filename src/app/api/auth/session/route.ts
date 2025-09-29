import { NextResponse } from 'next/server';
import { getSession } from '@/lib/jwt';

export async function GET() {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json({
        user: null,
      });
    }

    return NextResponse.json({
      user: {
        id: session.userId,
        email: session.email,
        name: session.name,
      },
    });
  } catch (error) {
    console.error('Session retrieval error:', error);
    return NextResponse.json(
      {
        user: null,
        error: 'Failed to retrieve session',
      },
      { status: 500 }
    );
  }
}
