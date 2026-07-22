import { initializeApp } from 'firebase-admin/app';
import { FieldValue, getFirestore } from 'firebase-admin/firestore';
import { onDocumentUpdated } from 'firebase-functions/v2/firestore';

initializeApp();

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

  await getFirestore().doc(`users/${userId}`).update({
    points: FieldValue.increment(earned),
  });
});
