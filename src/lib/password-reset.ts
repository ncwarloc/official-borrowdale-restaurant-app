const RESET_API_BASE_URL = process.env.EXPO_PUBLIC_PASSWORD_RESET_API_BASE_URL;

export type PasswordResetResult = {
  ok: boolean;
  message?: string;
};

function endpoint(path: string): string {
  if (!RESET_API_BASE_URL) {
    throw new Error('Password reset service is not configured.');
  }

  return `${RESET_API_BASE_URL.replace(/\/$/, '')}${path}`;
}

async function readResponseError(response: Response): Promise<string> {
  try {
    const data = (await response.json()) as { error?: string };
    return data.error || 'Request failed.';
  } catch {
    return 'Request failed.';
  }
}

export async function requestPasswordReset(email: string): Promise<PasswordResetResult> {
  const response = await fetch(endpoint('/requestPasswordReset'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });

  if (!response.ok) {
    throw new Error(await readResponseError(response));
  }

  return { ok: true };
}

export async function completePasswordReset(token: string, password: string): Promise<PasswordResetResult> {
  const response = await fetch(endpoint('/completePasswordReset'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token, password }),
  });

  if (!response.ok) {
    throw new Error(await readResponseError(response));
  }

  return { ok: true };
}
