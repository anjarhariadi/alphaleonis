import { env } from "@/env";
import {
  getCertificatesCached,
  getExperiencesCached,
  getPortfoliosCached,
  getProfileCached,
} from "@/features/landing/actions";
import { getAllPost, getAllPostCached } from "@/features/blog/actions";

export const revalidate = 3600;

function mdEscape(s: string) {
  return s.replace(/[\[\]]/g, "").replace(/\r?\n/g, " ").trim();
}

export async function GET() {
  const base = env.NEXT_PUBLIC_BASE_URL.replace(/\/$/, "");

  // sequential to avoid Prisma pool timeout (limit 1) — ponytail: sequential is simpler than pool tuning
  const profile = await getProfileCached().catch(() => null);
  const portfolios = await getPortfoliosCached().catch(() => []);
  const experiences = await getExperiencesCached().catch(() => []);
  const certificates = await getCertificatesCached().catch(() => []);

  // paginate all published Notion posts — try cached first, fall back to uncached on error/empty (stale negative cache)
  const blogs: { slug: string; title: string; categories: { name: string }[]; publishedDate: string }[] = [];
  let cursor: string | undefined = undefined;
  let guard = 0;
  do {
    // ponytail: 20 pages x10 = 200 posts guard
    if (guard++ > 20) break;
    let res = (await getAllPostCached(true, cursor).catch(() => null)) as Awaited<ReturnType<typeof getAllPostCached>> | null;
    // fallback to uncached fetch if cached is poisoned (dev incrementalCache empty, notion transient failure)
    if (!res || (res as { error?: string }).error || (!res.blogs?.length && !cursor)) {
      const fresh = await getAllPost(true, cursor).catch(() => null);
      if (fresh && !fresh.error && fresh.blogs) res = fresh as typeof res;
    }
    if (!res) break;
    if (res.blogs) blogs.push(...(res.blogs as typeof blogs));
    cursor = (res as { next_cursor?: string | null }).next_cursor ?? undefined;
    if ((res as { error?: string }).error) break;
  } while (cursor);

  const title = "Anjar Hariadi – Software Engineer";
  const summary = profile?.descTitle
    ? `${profile.descTitle} — ${profile.greeting ?? ""}`.trim()
    : "Personal portfolio and blog — software engineer, portfolios, experience, certificates, and Notion-backed articles.";

  const lines: string[] = [];

  lines.push(`# ${title}`);
  lines.push("");
  lines.push(`> ${mdEscape(summary)}`);
  lines.push("");
  lines.push(
    `Personal website for Anjar Hariadi. Public pages: landing at \`${base}/\`, blog at \`${base}/blog\`, portfolio details at \`${base}/portfolio/{id}\`, individual posts at \`${base}/blog/{slug}\`. Use this file to discover curated LLM-friendly links; follow the links for full detail. Sitemap: ${base}/sitemap.xml. Robots: ${base}/robots.txt.`,
  );
  if (profile?.descContent) {
    lines.push("");
    lines.push(mdEscape(profile.descContent));
  }
  lines.push("");

  // About
  lines.push("## About");
  lines.push("");
  lines.push(`- [Home](${base}/): Landing, tools, contact`);
  lines.push(`- [Blog](${base}/blog): Articles from Notion`);
  if (profile?.email) lines.push(`- [Contact](mailto:${profile.email}): ${mdEscape(profile.email)}`);
  if (profile?.resume) lines.push(`- [Resume](${profile.resume}): PDF resume`);
  lines.push("");

  // Portfolios
  lines.push("## Portfolios");
  lines.push("");
  if (portfolios.length === 0) {
    lines.push("- No public portfolios yet.");
  } else {
    for (const p of portfolios) {
      const tags = p.tag?.length ? ` [${p.tag.join(", ")}]` : "";
      const desc = mdEscape((p.description ?? p.brief ?? "").slice(0, 160));
      lines.push(`- [${mdEscape(p.title)}](${base}/portfolio/${p.id}): ${desc}${tags}`);
    }
  }
  lines.push("");

  // Experience
  lines.push("## Experience");
  lines.push("");
  if (experiences.length === 0) {
    lines.push("- No experience entries.");
  } else {
    for (const e of experiences) {
      const desc = e.description ? mdEscape(e.description.slice(0, 140)) : "";
      lines.push(
        `- [${mdEscape(e.company)} — ${mdEscape(e.title)}](${base}/#experience): ${mdEscape(e.period)}${desc ? ` — ${desc}` : ""}`,
      );
    }
  }
  lines.push("");

  // Certificates
  lines.push("## Certificates");
  lines.push("");
  if (certificates.length === 0) {
    lines.push("- No certificates.");
  } else {
    for (const c of certificates) {
      const title = mdEscape(c.title);
      const issuer = mdEscape(c.issuer);
      const validation = c.validation ? ` — validation: ${c.validation}` : "";
      lines.push(`- [${title} — ${issuer}](${base}/#certificates): ${mdEscape(c.period)}${validation}`);
    }
  }
  lines.push("");

  // Blog
  lines.push("## Blog");
  lines.push("");
  if (blogs.length === 0) {
    lines.push("- No published blog posts yet.");
  } else {
    for (const b of blogs) {
      const cats = b.categories?.length ? ` — ${b.categories.map((x) => x.name).join(", ")}` : "";
      const date = b.publishedDate ? ` (${b.publishedDate.slice(0, 10)})` : "";
      lines.push(`- [${mdEscape(b.title)}](${base}/blog/${b.slug}):${cats}${date}`);
    }
  }
  lines.push("");

  lines.push("## Optional");
  lines.push("");
  lines.push(`- [Sitemap](${base}/sitemap.xml): All indexable URLs`);
  lines.push(`- [Robots](${base}/robots.txt): Crawl rules`);
  lines.push(`- [Blog RSS — via sitemap](${base}/sitemap.xml): Blog discovery via sitemap`);
  lines.push("");

  const body = lines.join("\n");

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
