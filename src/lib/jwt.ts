import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

// Secret key for JWT signing
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-min-32-characters-long';

const SESSION_COOKIE_NAME = 'session';
const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

export interface SessionData {
  userId: string;
  email: string;
  name?: string;
}

export interface JWTPayload extends SessionData {
  exp: number;
  iat: number;
}

/**
 * Create a JWT token for the user
 */
export function createToken(data: SessionData): string {
  const token = jwt.sign(
    data,
    JWT_SECRET,
    {
      expiresIn: '7d',
      algorithm: 'HS256',
    }
  );

  return token;
}

/**
 * Verify and decode a JWT token
 */
export function verifyToken(token: string): JWTPayload | null {
  try {
    const payload = jwt.verify(token, JWT_SECRET, {
      algorithms: ['HS256'],
    }) as JWTPayload;

    return payload;
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
}

/**
 * Set session cookie (server-side only)
 */
export async function setSessionCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_DURATION / 1000, // convert to seconds
    path: '/',
  });
}

/**
 * Get session cookie (server-side only)
 */
export async function getSessionCookie(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(SESSION_COOKIE_NAME)?.value;
}

/**
 * Delete session cookie (server-side only)
 */
export async function deleteSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

/**
 * Get current session from cookie
 */
export async function getSession(): Promise<SessionData | null> {
  const token = await getSessionCookie();

  if (!token) {
    return null;
  }

  const payload = await verifyToken(token);

  if (!payload) {
    return null;
  }

  return {
    userId: payload.userId,
    email: payload.email,
    name: payload.name,
  };
}

/**
 * Create a new session
 */
export async function createSession(userData: SessionData): Promise<void> {
  const token = await createToken(userData);
  await setSessionCookie(token);
}

/**
 * Destroy the current session
 */
export async function destroySession(): Promise<void> {
  await deleteSessionCookie();
}
