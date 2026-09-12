import { test, expect } from "@playwright/test";
import { POST } from "../app/api/contact/route";
import { getContactDeliveryConfig } from "../lib/contact-delivery";

test("contact delivery reports success only after the mail provider accepts the message", async () => {
  const keys = ["RESEND_API_KEY", "CONTACT_FROM_EMAIL", "CONTACT_TO_EMAIL"] as const;
  const previous = keys.map((key) => process.env[key]);
  const originalFetch = globalThis.fetch;
  const payload = {
    kind: "contact",
    name: "Test visitor",
    email: "visitor@example.com",
    phone: "",
    city: "بغداد",
    topic: "اقتراح",
    message: "رسالة اختبار لا تغادر بيئة الاختبار.",
    consent: true,
    website: "",
  };
  const post = (data = payload) =>
    POST(
      new Request("http://localhost/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }),
    );
  let providerStatus = 200;
  let providerCalls = 0;
  globalThis.fetch = async (input, init) => {
    providerCalls++;
    expect(input).toBe("https://api.resend.com/emails");
    const email = JSON.parse(String(init?.body));
    expect(email.to).toEqual(["inbox@example.com"]);
    expect(email.reply_to).toBe(payload.email);
    expect(email.text).toContain(payload.message);
    return Response.json(
      providerStatus === 200 ? { id: "test-message" } : { error: "test rejection" },
      { status: providerStatus },
    );
  };
  try {
    for (const key of keys) delete process.env[key];
    expect(getContactDeliveryConfig()).toBeNull();
    expect((await post()).status).toBe(503);
    expect(providerCalls).toBe(0);
    process.env.RESEND_API_KEY = "test-key-never-sent";
    process.env.CONTACT_FROM_EMAIL = "sender@example.com";
    expect(getContactDeliveryConfig()).toBeNull();
    process.env.CONTACT_TO_EMAIL = "inbox@example.com";
    expect(getContactDeliveryConfig()).not.toBeNull();
    expect((await post({ ...payload, website: "spam" })).status).toBe(422);
    expect((await post({ ...payload, email: "invalid" })).status).toBe(422);
    expect(providerCalls).toBe(0);
    const sent = await post();
    expect(sent.status).toBe(200);
    expect(await sent.json()).toEqual({ ok: true });
    providerStatus = 500;
    const failed = await post();
    expect(failed.status).toBe(502);
    expect(await failed.json()).not.toHaveProperty("ok", true);
    globalThis.fetch = async () => {
      throw new Error("test network failure");
    };
    expect((await post()).status).toBe(502);
  } finally {
    globalThis.fetch = originalFetch;
    keys.forEach((key, index) => {
      if (previous[index] === undefined) delete process.env[key];
      else process.env[key] = previous[index];
    });
  }
});
