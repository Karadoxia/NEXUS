import { describe, it, expect, vi } from 'vitest';
import { sendEmail } from '../lib/mail';

// ensure we clear environment between tests

describe('sendEmail', () => {
  afterEach(() => {
    vi.resetAllMocks();
    delete process.env.RESEND_API_KEY;
  });

  it('throws if the API key is missing', async () => {
    await expect(sendEmail({ to: 'a@b.com', subject: 'x', html: '<p>y</p>' })).rejects.toMatchObject(
      { message: /RESEND_API_KEY not configured/ }
    );
  });

  it('posts correct payload to Resend when key is present', async () => {
    process.env.RESEND_API_KEY = 'test-key';
    const fakeResponse = {
      ok: true,
      json: async () => ({ id: '123' }),
    };
    const fetchSpy = vi.spyOn(global, 'fetch').mockResolvedValue(fakeResponse as unknown as Response);

    const result = await sendEmail({ to: 'user@example.com', subject: 'Hello', html: '<p>hi</p>' });
    expect(fetchSpy).toHaveBeenCalledWith('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer test-key',
      },
      body: JSON.stringify({ to: 'user@example.com', subject: 'Hello', html: '<p>hi</p>' }),
    });
    expect(result).toEqual({ id: '123' });
  });

  it('throws when the remote service responds with an error', async () => {
    process.env.RESEND_API_KEY = 'test-key';
    const fakeResponse = {
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
      text: async () => 'boom',
    };
    vi.spyOn(global, 'fetch').mockResolvedValue(fakeResponse as unknown as Response);

    await expect(sendEmail({ to: 'a@b.com', subject: 'x', html: 'y' })).rejects.toThrow(
      /failed to send email: 500/,
    );
  });
});
