import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/server-auth';

const N8N_BASE = process.env.N8N_API_BASE ?? 'http://n8n:5678/api/v1';
const N8N_EMAIL = process.env.N8N_EMAIL ?? 'nexus_admin@nexus.local';
const N8N_PASSWORD = process.env.N8N_PASSWORD ?? 'Super_Secure_N8N_2026!';

export async function POST(request: Request) {
  const { session, error } = await requireAdmin();
  if (error) return error;

  try {
    // Authenticate with n8n using username/password
    const authRes = await fetch(`${N8N_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: N8N_EMAIL,
        password: N8N_PASSWORD,
      }),
    });

    if (!authRes.ok) {
      console.error('[n8n-auth] Login failed:', await authRes.text());
      return NextResponse.json(
        { error: 'N8N authentication failed' },
        { status: 401 }
      );
    }

    const authData = await authRes.json();
    
    // The response should include a token or session info
    // Return the necessary auth data to the client
    return NextResponse.json({
      success: true,
      token: authData.data?.access_token || authData.token || '',
      user: {
        id: authData.data?.user?.id || authData.user?.id,
        email: authData.data?.user?.email || authData.user?.email,
      },
      // Include the n8n-api-key for direct API calls
      apiKey: process.env.N8N_API_KEY || '',
      // Use public URL for browser access
      n8nBaseUrl: 'http://nexus-n8n.local:5678',
    });
  } catch (err) {
    console.error('[n8n-auth]', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Authentication failed' },
      { status: 500 }
    );
  }
}
