// Server-side only: callers must never pass these credentials to a client component.
export function getContactDeliveryConfig() {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from = process.env.CONTACT_FROM_EMAIL?.trim();
  const to = process.env.CONTACT_TO_EMAIL?.trim();
  return apiKey && from && to ? { apiKey, from, to } : null;
}
