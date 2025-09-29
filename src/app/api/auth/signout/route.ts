import { NextResponse } from 'next/server';
import { destroySession } from '@/lib/jwt';

export async function POST() {
  try {
    await destroySession();

    return NextResponse.json({
      success: true,
      message: 'Signed out successfully',
    });
  } catch (error) {
    console.error('Sign out error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'An error occurred during sign out',
      },
      { status: 500 }
    );
  }
}
