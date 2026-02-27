/**
 * Newsletter Agent
 *
 * Responsibilities:
 *  1. Fetch top 10 AI news from Hacker News (via Algolia API — free, no key)
 *  2. Fetch featured products from the DB
 *  3. Use LLM to write a compelling newsletter intro
 *  4. Compose HTML email and bulk-send to all subscribers via Resend
 *
 * Env vars needed: GROQ_API_KEY, RESEND_API_KEY
 */

import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { prisma } from "@/src/lib/prisma";
import { sendNewsletterEmail } from "@/lib/email";
import { buildGraph } from "./base";

// ── Tools ─────────────────────────────────────────────────────

const getAiNews = tool(
  async () => {
    try {
      const url =
        "https://hn.algolia.com/api/v1/search?tags=story&query=artificial+intelligence+LLM+machine+learning&numericFilters=num_comments>5&hitsPerPage=20";
      const res = await fetch(url, { next: { revalidate: 3600 } } as any);
      const data: any = await res.json();
      const articles = (data.hits ?? [])
        .filter((h: any) => h.title && h.url)
        .slice(0, 10)
        .map((h: any, i: number) => ({
          rank: i + 1,
          title: h.title,
          url: h.url ?? `https://news.ycombinator.com/item?id=${h.objectID}`,
          points: h.points ?? 0,
          comments: h.num_comments ?? 0,
        }));
      return JSON.stringify(articles);
    } catch (e: any) {
      return `AI news fetch failed: ${e.message}`;
    }
  },
  {
    name: "getAiNews",
    description: "Fetch the top 10 AI/LLM news stories from Hacker News right now",
    schema: z.object({}),
  },
);

const getFeaturedProducts = tool(
  async () => {
    try {
      const products = await prisma.product.findMany({
        where: { featured: true, stock: { gt: 0 } },
        select: { name: true, price: true, comparePrice: true, category: true, description: true, slug: true },
        orderBy: { rating: "desc" },
        take: 5,
      });
      return JSON.stringify(products);
    } catch (e: any) {
      return `Product fetch failed: ${e.message}`;
    }
  },
  {
    name: "getFeaturedProducts",
    description: "Get the top featured in-stock products from the NEXUS store",
    schema: z.object({}),
  },
);

const getStoreStats = tool(
  async () => {
    try {
      const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      const [totalProducts, subscribers, weeklyOrders] = await Promise.all([
        prisma.product.count({ where: { stock: { gt: 0 } } }),
        prisma.subscriber.count(),
        prisma.order.count({ where: { date: { gte: since }, cancelled: false } }),
      ]);
      return JSON.stringify({ totalProducts, subscribers, weeklyOrders });
    } catch (e: any) {
      return `Store stats failed: ${e.message}`;
    }
  },
  {
    name: "getStoreStats",
    description: "Get NEXUS store stats: product count, subscriber count, weekly orders",
    schema: z.object({}),
  },
);

// ── Newsletter HTML builder ────────────────────────────────────

function buildNewsletterHtml({
  intro,
  products,
  news,
  appUrl,
}: {
  intro: string;
  products: any[];
  news: any[];
  appUrl: string;
}) {
  const productRows = products
    .map(
      (p) => `
    <tr>
      <td style="padding:16px 0;border-bottom:1px solid #1a1a1a;">
        <strong style="color:#fff;font-size:14px;">${p.name}</strong>
        <span style="color:#6b7280;font-size:12px;"> — ${p.category}</span><br/>
        <span style="color:#06b6d4;font-weight:700;">€${p.price.toFixed(2)}</span>
        ${p.comparePrice ? `<span style="color:#6b7280;font-size:12px;text-decoration:line-through;margin-left:8px;">€${p.comparePrice.toFixed(2)}</span>` : ""}
        <br/><a href="${appUrl}/store/${p.slug}" style="color:#9333ea;font-size:12px;">View product →</a>
      </td>
    </tr>`,
    )
    .join("");

  const newsRows = news
    .map(
      (n, i) => `
    <tr>
      <td style="padding:12px 0;border-bottom:1px solid #111;">
        <span style="color:#06b6d4;font-size:11px;font-weight:700;">#${i + 1}</span>
        <a href="${n.url}" style="color:#e5e7eb;font-size:13px;font-weight:600;text-decoration:none;display:block;margin:4px 0;">
          ${n.title}
        </a>
        <span style="color:#6b7280;font-size:11px;">⬆ ${n.points} · 💬 ${n.comments}</span>
      </td>
    </tr>`,
    )
    .join("");

  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:40px 20px;background:#000;font-family:Helvetica,Arial,sans-serif;">
  <table width="600" style="max-width:600px;margin:0 auto;">

    <!-- Header -->
    <tr><td style="text-align:center;padding-bottom:32px;">
      <table cellpadding="0" cellspacing="0" style="display:inline-table;">
        <tr>
          <td style="background:linear-gradient(135deg,#06b6d4,#9333ea);border-radius:10px;width:36px;height:36px;text-align:center;vertical-align:middle;">
            <span style="color:#000;font-weight:800;font-size:18px;">N</span>
          </td>
          <td style="padding-left:10px;">
            <span style="color:#fff;font-weight:800;font-size:22px;letter-spacing:-1px;">NEXUS</span>
            <span style="color:#6b7280;font-size:12px;display:block;">Weekly Intelligence</span>
          </td>
        </tr>
      </table>
    </td></tr>

    <!-- Intro -->
    <tr><td style="background:#0a0a0a;border:1px solid #1a1a1a;border-radius:16px;padding:32px;margin-bottom:24px;">
      <p style="color:#e5e7eb;font-size:15px;line-height:1.8;margin:0;">${intro.replace(/\n/g, "<br/>")}</p>
    </td></tr>

    <tr><td style="height:24px;"></td></tr>

    <!-- Featured Products -->
    <tr><td style="background:#0a0a0a;border:1px solid #1a1a1a;border-radius:16px;padding:32px;">
      <h2 style="color:#fff;font-size:16px;font-weight:700;margin:0 0 8px;">🛍️ Featured This Week</h2>
      <table width="100%">${productRows}</table>
      <div style="text-align:center;margin-top:20px;">
        <a href="${appUrl}/store" style="background:linear-gradient(135deg,#06b6d4,#9333ea);color:#fff;font-weight:700;font-size:13px;padding:12px 28px;border-radius:10px;text-decoration:none;">
          Browse All Products →
        </a>
      </div>
    </td></tr>

    <tr><td style="height:24px;"></td></tr>

    <!-- AI News -->
    <tr><td style="background:#0a0a0a;border:1px solid #1a1a1a;border-radius:16px;padding:32px;">
      <h2 style="color:#fff;font-size:16px;font-weight:700;margin:0 0 8px;">🤖 Top 10 AI News This Week</h2>
      <p style="color:#6b7280;font-size:12px;margin:0 0 16px;">Curated from Hacker News</p>
      <table width="100%">${newsRows}</table>
    </td></tr>

    <tr><td style="height:32px;"></td></tr>

    <!-- Footer -->
    <tr><td style="text-align:center;border-top:1px solid #1a1a1a;padding-top:24px;">
      <p style="color:#374151;font-size:12px;margin:0 0 8px;">
        Questions? <a href="mailto:hello@nexus-store.io" style="color:#06b6d4;">hello@nexus-store.io</a>
      </p>
      <p style="color:#374151;font-size:12px;margin:0;">© 2026 NEXUS Technologies · Boulogne-Billancourt, France</p>
      <p style="margin:12px 0 0;">
        <a href="${appUrl}/unsubscribe" style="color:#374151;font-size:11px;">Unsubscribe</a>
      </p>
    </td></tr>

  </table>
</body>
</html>`;
}

// ── Main run function ──────────────────────────────────────────

export async function runNewsletterAgent(triggeredBy = "admin") {
  const job = await prisma.agentJob.create({
    data: { agentName: "newsletter-agent", triggeredBy, status: "RUNNING" },
  });
  const start = Date.now();

  try {
    // Step 1: Fetch raw data in parallel
    const [newsRaw, productsRaw, statsRaw, subscriberEmails] = await Promise.all([
      fetch(
        "https://hn.algolia.com/api/v1/search?tags=story&query=artificial+intelligence+LLM&numericFilters=num_comments>5&hitsPerPage=20",
      )
        .then((r) => r.json())
        .then((d) =>
          (d.hits ?? [])
            .filter((h: any) => h.title && h.url)
            .slice(0, 10)
            .map((h: any, i: number) => ({
              rank: i + 1,
              title: h.title,
              url: h.url ?? `https://news.ycombinator.com/item?id=${h.objectID}`,
              points: h.points ?? 0,
              comments: h.num_comments ?? 0,
            })),
        )
        .catch(() => [] as any[]),

      prisma.product.findMany({
        where: { featured: true, stock: { gt: 0 } },
        select: { name: true, price: true, comparePrice: true, category: true, slug: true },
        orderBy: { rating: "desc" },
        take: 5,
      }),

      prisma.$transaction([
        prisma.product.count({ where: { stock: { gt: 0 } } }),
        prisma.subscriber.count(),
        prisma.order.count({
          where: {
            date: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
            cancelled: false,
          },
        }),
      ]),

      prisma.subscriber.findMany({ select: { email: true } }).then((s) => s.map((x) => x.email)),
    ]);

    const [totalProducts, subscriberCount, weeklyOrders] = statsRaw;

    if (subscriberEmails.length === 0) {
      await prisma.agentJob.update({
        where: { id: job.id },
        data: {
          status: "COMPLETED",
          result: { text: "No subscribers found — newsletter not sent." },
          completedAt: new Date(),
          durationMs: Date.now() - start,
        },
      });
      return { jobId: job.id, sent: 0 };
    }

    // Step 2: LLM writes the intro paragraph
    let intro =
      `Welcome to this week's NEXUS Intelligence briefing! We have ${totalProducts} products in stock, ` +
      `${weeklyOrders} orders this week, and ${subscriberCount} community members. ` +
      `Below you'll find our featured picks and the top AI stories making waves right now.`;

    const groqKey = process.env.GROQ_API_KEY ?? process.env.GROK_API_KEY;
    if (groqKey) {
      try {
        const compiled = await buildGraph({
          name: "newsletter-intro-writer",
          description: "Writes newsletter intro",
          systemPrompt:
            "You are a witty tech newsletter writer for NEXUS, a premium AI-powered e-commerce store. " +
            "Write a short, engaging 2-3 sentence intro paragraph for the weekly newsletter. " +
            "Mention the stats provided. Be energetic, professional, and human.",
          tools: [],
          temperature: 0.7,
        });
        const result = await compiled.invoke({
          messages: [
            {
              role: "user",
              content: `Write the intro. Stats: ${totalProducts} products in stock, ${weeklyOrders} orders this week, ${subscriberCount} subscribers.`,
            },
          ],
        });
        const text = result?.messages?.at(-1)?.content;
        if (text) intro = text;
      } catch {
        // fallback to static intro above
      }
    }

    // Step 3: Build and send
    const appUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "https://nexus-store.io";
    const html = buildNewsletterHtml({ intro, products: productsRaw, news: newsRaw, appUrl });
    const subject = `🤖 NEXUS Weekly — Top AI News + ${productsRaw.length} Featured Picks`;

    const sendResult = await sendNewsletterEmail({ subscribers: subscriberEmails, subject, html });

    const summary = `Sent to ${sendResult.sent}/${subscriberEmails.length} subscribers. Failed: ${sendResult.failed}.`;
    await prisma.agentJob.update({
      where: { id: job.id },
      data: {
        status: "COMPLETED",
        result: { text: summary, details: sendResult },
        completedAt: new Date(),
        durationMs: Date.now() - start,
      },
    });

    return { jobId: job.id, ...sendResult };
  } catch (err: any) {
    await prisma.agentJob.update({
      where: { id: job.id },
      data: { status: "FAILED", error: err.message },
    });
    throw err;
  }
}
