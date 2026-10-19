import { NextResponse } from 'next/server';
import { OAuth2Client } from 'google-auth-library';

const client = new OAuth2Client(process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID);

export async function POST(req: Request) {
  try {
    const { credential } = await req.json();
    if (!credential) {
      return NextResponse.json({ error: 'Missing token' }, { status: 400 });
    }

    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

    // Verifikasi JWT ke server Google
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: clientId || undefined,
    });

    const payload = ticket.getPayload();
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    // Ekstrak data profil asli dari akun Google
    const userProfile = {
      googleId: payload.sub,
      email: payload.email || '',
      name: payload.name || payload.given_name || 'Pengguna Google',
      picture: payload.picture || '',
      emailVerified: payload.email_verified || false,
    };

    return NextResponse.json({ status: 'success', user: userProfile });
  } catch (error: any) {
    console.error('Google token verification error:', error);
    return NextResponse.json(
      { error: error?.message || 'Authentication failed' },
      { status: 500 }
    );
  }
}
