import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import {
  CONTACT_FROM_EMAIL,
  CONTACT_TO_EMAIL,
  RESEND_API_KEY,
} from "astro:env/server";
import { REGIONS } from "@/data/families.ts";

export const prerender = false;

const MIN_FILL_SECONDS = 3;
const LIMITS = { name: 80, company: 120, email: 200, message: 4000 };

const escapeHtml = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

const field = (data: FormData, key: string, max: number) =>
  String(data.get(key) ?? "")
    .trim()
    .slice(0, max);

const wantsJson = (request: Request) =>
  (request.headers.get("accept") ?? "").includes("application/json");

const reply = (
  request: Request,
  status: number,
  body: Record<string, unknown>,
) =>
  wantsJson(request)
    ? new Response(JSON.stringify(body), {
        status,
        headers: { "Content-Type": "application/json" },
      })
    : status < 400
      ? new Response(null, {
          status: 303,
          headers: { Location: "/contact/#sent" },
        })
      : new Response(String(body.error ?? "Something went wrong."), { status });

export const POST: APIRoute = async ({ request }) => {
  const data = await request.formData();

  /* Bots fill the hidden field or submit faster than a person can type. They
     are told it worked so they have nothing to learn from. */
  const started = Number(data.get("started"));
  const tooFast = started > 0 && Date.now() - started < MIN_FILL_SECONDS * 1000;
  if (field(data, "website", 200) || tooFast) {
    return reply(request, 200, { ok: true });
  }

  const firstName = field(data, "first_name", LIMITS.name);
  const lastName = field(data, "last_name", LIMITS.name);
  const company = field(data, "company", LIMITS.company);
  const region = field(data, "region", 40);
  const email = field(data, "email", LIMITS.email);
  const message = field(data, "message", LIMITS.message);

  const catalogue = new Map<string, string>();
  for (const product of await getCollection("products")) {
    catalogue.set(product.id, product.data.name);
  }
  for (const item of await getCollection("frozen")) {
    catalogue.set(item.id, item.data.name);
  }
  const chosen = [...new Set(data.getAll("products").map(String))];
  const products = chosen.filter((id) => catalogue.has(id));

  const problems: string[] = [];
  if (!firstName) problems.push("first name");
  if (!lastName) problems.push("surname");
  if (!company) problems.push("company name");
  if (!(REGIONS as readonly string[]).includes(region)) problems.push("region");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) problems.push("a valid email");
  if (products.length === 0) problems.push("at least one product");

  if (problems.length) {
    return reply(request, 400, {
      ok: false,
      error: `Please check: ${problems.join(", ")}.`,
    });
  }

  if (!RESEND_API_KEY) {
    console.error("[contact] RESEND_API_KEY is not set; enquiry was not sent.");
    return reply(request, 503, {
      ok: false,
      error: "Email is not set up yet.",
    });
  }

  const productNames = products.map((id) => catalogue.get(id) as string);
  const fullName = `${firstName} ${lastName}`;

  const rows: [string, string][] = [
    ["Name", fullName],
    ["Company", company],
    ["Region", region],
    ["Email", email],
    ["Products", productNames.join(", ")],
    ["Message", message || "(none)"],
  ];

  const text = rows.map(([label, value]) => `${label}: ${value}`).join("\n");
  const html = `<table cellpadding="8" style="border-collapse:collapse;font-family:system-ui,sans-serif;font-size:15px">${rows
    .map(
      ([label, value]) =>
        `<tr><th align="left" valign="top" style="border-bottom:1px solid #eee">${escapeHtml(label)}</th><td style="border-bottom:1px solid #eee;white-space:pre-wrap">${escapeHtml(value)}</td></tr>`,
    )
    .join("")}</table>`;

  const sent = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: CONTACT_FROM_EMAIL,
      to: [CONTACT_TO_EMAIL],
      reply_to: email,
      subject: `Website enquiry: ${company} (${region})`,
      text,
      html,
    }),
  });

  if (!sent.ok) {
    console.error(
      "[contact] Resend rejected the enquiry:",
      sent.status,
      await sent.text(),
    );
    return reply(request, 502, {
      ok: false,
      error: "We could not send that. Please try again.",
    });
  }

  return reply(request, 200, { ok: true });
};
