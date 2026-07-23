import { createHash, randomBytes } from 'node:crypto';

import { getAuth } from 'firebase-admin/auth';
import { initializeApp } from 'firebase-admin/app';
import { FieldValue, getFirestore, Timestamp } from 'firebase-admin/firestore';
import { onDocumentUpdated } from 'firebase-functions/v2/firestore';
import { onRequest } from 'firebase-functions/v2/https';

initializeApp();

const db = getFirestore();
const auth = getAuth();
const RESET_TOKEN_TTL_MS = 5 * 60 * 1000;
const RESET_COLLECTION = 'passwordResetRequests';

function getEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required env var: ${name}`);
  return value;
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

async function sendResetEmail(to: string, resetLink: string) {
  const apiKey = getEnv('RESEND_API_KEY');
  const from = getEnv('PASSWORD_RESET_FROM_EMAIL');
  const appName = process.env.PASSWORD_RESET_APP_NAME || 'Zone Garden';

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to: [to],
      subject: `${appName} password reset link`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #111;">
          <h2 style="margin: 0 0 12px;">Reset your ${appName} password</h2>
          <p>Use the link below within 5 minutes to set a new password.</p>
          <p><a href="${resetLink}" style="color: #138A36; font-weight: 700;">Reset password</a></p>
          <p>If the button does not work, copy this link into your browser:</p>
          <p style="word-break: break-all;">${resetLink}</p>
          <p>If you did not request this reset, you can ignore this email.</p>
        </div>
      `,
      text: [
        `Reset your ${appName} password`,
        'Use the link below within 5 minutes to set a new password:',
        resetLink,
        '',
        'If you did not request this reset, you can ignore this email.',
      ].join('\n'),
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Email provider error: ${response.status} ${body}`);
  }
}

/**
 * The only place users/{uid}.points is ever incremented. The app itself
 * only ever writes an order's `status` field (see markDelivered in
 * src/context/orders-context.tsx) — it never touches `points` directly, and
 * firestore.rules rejects any client write that tries to change that field.
 * This function uses the Admin SDK, which bypasses those rules, so it's the
 * one trusted path that can move the number.
 */
export const awardPointsOnDelivery = onDocumentUpdated('orders/{orderId}', async (event) => {
  const before = event.data?.before.data();
  const after = event.data?.after.data();
  if (!before || !after) return;

  // Only fire on the transition INTO "delivered" — any other field changing
  // on an order (or a re-write of an already-delivered order) must not
  // re-award points.
  if (before.status === 'delivered' || after.status !== 'delivered') return;

  const userId = after.userId;
  if (typeof userId !== 'string' || !userId) return;

  const earned = Math.round(Number(after.total) || 0);
  if (earned <= 0) return;

  await db.doc(`users/${userId}`).update({
    points: FieldValue.increment(earned),
  });
});

export const requestPasswordReset = onRequest({ cors: true }, async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const email = normalizeEmail(String(body?.email || ''));

    if (!email) {
      res.status(400).json({ error: 'Email is required' });
      return;
    }

    const token = randomBytes(32).toString('base64url');
    const tokenHash = hashToken(token);
    const expiresAt = Date.now() + RESET_TOKEN_TTL_MS;
    const existingUser = await auth.getUserByEmail(email).catch(() => null);
    const resetScheme = getEnv('PASSWORD_RESET_APP_SCHEME');
    const resetLink = `${resetScheme}://reset-password?token=${encodeURIComponent(token)}`;

    await db.doc(`${RESET_COLLECTION}/${tokenHash}`).set({
      email,
      uid: existingUser?.uid || null,
      tokenHash,
      expiresAt,
      usedAt: null,
      createdAt: Timestamp.now(),
    });

    if (existingUser) {
      await sendResetEmail(email, resetLink);
    }

    res.status(200).json({ ok: true });
  } catch (error) {
    console.error('requestPasswordReset failed', error);
    res.status(500).json({ error: 'Unable to send reset email' });
  }
});

export const completePasswordReset = onRequest({ cors: true }, async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const token = String(body?.token || '').trim();
    const password = String(body?.password || '');

    if (!token || !password) {
      res.status(400).json({ error: 'Token and password are required' });
      return;
    }

    if (password.length < 6) {
      res.status(400).json({ error: 'Password must be at least 6 characters' });
      return;
    }

    const tokenHash = hashToken(token);
    const tokenRef = db.doc(`${RESET_COLLECTION}/${tokenHash}`);
    const tokenSnap = await tokenRef.get();

    if (!tokenSnap.exists) {
      res.status(400).json({ error: 'Reset link is invalid or expired' });
      return;
    }

    const tokenData = tokenSnap.data();
    if (!tokenData || tokenData.usedAt) {
      res.status(400).json({ error: 'Reset link is invalid or expired' });
      return;
    }

    if (typeof tokenData.expiresAt !== 'number' || tokenData.expiresAt < Date.now()) {
      await tokenRef.delete().catch(() => null);
      res.status(400).json({ error: 'Reset link is invalid or expired' });
      return;
    }

    const uid = typeof tokenData.uid === 'string' && tokenData.uid ? tokenData.uid : null;
    const email = typeof tokenData.email === 'string' ? tokenData.email : '';

    const userRecord = uid ? await auth.getUser(uid) : await auth.getUserByEmail(email);
    await auth.updateUser(userRecord.uid, { password });

    await tokenRef.update({
      usedAt: Timestamp.now(),
    });

    res.status(200).json({ ok: true });
  } catch (error) {
    console.error('completePasswordReset failed', error);
    res.status(500).json({ error: 'Unable to complete password reset' });
  }
});