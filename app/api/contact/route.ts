import { contactSchema, fieldErrors } from "@/lib/validation";
import { site } from "@/lib/site";

export const runtime = "nodejs";
const json = (body: object, status = 200) =>
  Response.json(body, { status, headers: { "Cache-Control": "no-store" } });
export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  const requestUrl = new URL(request.url);
  // Next's request URL can use the server bind address (0.0.0.0). Compare
  // against the browser's actual request host as well as the canonical site.
  const requestOrigin = `${requestUrl.protocol}//${request.headers.get("host") || requestUrl.host}`;
  if (origin && origin !== requestOrigin && origin !== site.origin)
    return json({ error: "طلب غير مسموح." }, 403);
  if (!request.headers.get("content-type")?.toLowerCase().startsWith("application/json"))
    return json({ error: "صيغة الطلب غير صحيحة." }, 415);
  if (Number(request.headers.get("content-length") || 0) > 16000)
    return json({ error: "الرسالة طويلة جداً." }, 413);
  let payload: unknown;
  try {
    // Bound the stream, including requests without Content-Length.
    const reader = request.body?.getReader();
    if (!reader) return json({ error: "الرسالة فارغة." }, 400);
    const chunks: Uint8Array[] = [];
    let length = 0;
    while (true) {
      const chunk = await reader.read();
      if (chunk.done) break;
      length += chunk.value.byteLength;
      if (length > 16000) {
        await reader.cancel();
        return json({ error: "الرسالة طويلة جداً." }, 413);
      }
      chunks.push(chunk.value);
    }
    const bytes = new Uint8Array(length);
    let offset = 0;
    for (const chunk of chunks) {
      bytes.set(chunk, offset);
      offset += chunk.byteLength;
    }
    payload = JSON.parse(new TextDecoder().decode(bytes));
  } catch {
    return json({ error: "تعذّر قراءة الرسالة." }, 400);
  }
  const result = contactSchema.safeParse(payload);
  if (!result.success)
    return json(
      { error: "راجع الحقول المطلوبة وحاول ثانية.", fields: fieldErrors(result.error) },
      422,
    );
  if (site.demo || result.data.website) return json({ ok: true, demo: true });
  const apiKey = process.env.RESEND_API_KEY,
    from = process.env.CONTACT_FROM_EMAIL,
    to = process.env.CONTACT_TO_EMAIL;
  if (!apiKey || !from || !to)
    return json({ error: "الإرسال غير متاح حالياً. تواصل ويانا عبر إنستغرام." }, 503);
  const data = result.data;
  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      signal: AbortSignal.timeout(10000),
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: data.email,
        subject: `[Super Sauce] ${data.kind === "careers" ? "اهتمام بالعمل" : "رسالة موقع"} — ${data.topic}`,
        text: [
          `الاسم: ${data.name}`,
          `البريد: ${data.email}`,
          `الموبايل: ${data.phone || "غير مرفق"}`,
          `المحافظة: ${data.city}`,
          `الموضوع: ${data.topic}`,
          data.portfolio ? `السيرة: ${data.portfolio}` : "",
          "",
          data.message,
        ].join("\n"),
      }),
    });
    if (!response.ok)
      return json({ error: "تعذّر الإرسال الآن. حاول لاحقاً أو تواصل عبر إنستغرام." }, 502);
    return json({ ok: true, demo: false });
  } catch {
    return json({ error: "انتهت مهلة الاتصال. حاول لاحقاً." }, 502);
  }
}
