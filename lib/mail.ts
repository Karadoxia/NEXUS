// simple wrapper around the Resend REST API for sending email

export interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
}

const RESEND_API_BASE = 'https://api.resend.com';
const key = process.env.RESEND_API_KEY;

if (!key) {
  // we don't throw immediately because some parts of the app may not need mail
  console.warn('RESEND_API_KEY is not set – email sending will be disabled');
}

export async function sendEmail(opts: SendEmailOptions) {
  if (!key) {
    throw new Error('RESEND_API_KEY not configured');
  }

  const res = await fetch(`${RESEND_API_BASE}/emails`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({
      to: opts.to,
      subject: opts.subject,
      html: opts.html,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    const err = new Error(`failed to send email: ${res.status} ${res.statusText} - ${text}`);
    // attach response for inspection
    (err as any).response = res;
    throw err;
  }
  return res.json();
}
