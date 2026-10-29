import {
  getCertificatesCached,
  getExperiencesCached,
  getPortfoliosCached,
  getProfileCached,
} from "@/features/landing/actions";
import { getAllPosts } from "@/features/blog/source";
import { SITE_URL } from "@/features/landing/metadata";

export const revalidate = 3600;

function mdEscape(s: string) {
  return s
    .replace(/[\[\]]/g, "")
    .replace(/\r?\n/g, " ")
    .trim();
}

export async function GET() {
  const base = SITE_URL.replace(/\/$/, "");

  // sequential to avoid Prisma pool timeout (limit 1) — ponytail: sequential is simpler than pool tuning
  const profile = await getProfileCached().catch(() => null);
  const portfolios = await getPortfoliosCached().catch(() => []);
  const experiences = await getExperiencesCached().catch(() => []);
  const certificates = await getCertificatesCached().catch(() => []);

  const blogs = await getAllPosts();

  const title = "Anjar Hariadi – Software Engineer";
  const summary = profile?.descTitle
    ? `${profile.descTitle} — ${profile.greeting ?? ""}`.trim()
    : "Personal portfolio and blog — software engineer, portfolios, experience, certificates, and articles.";

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
  lines.push(`- [Blog](${base}/blog): Articles and cross-posted links`);
  if (profile?.email)
    lines.push(
      `- [Contact](mailto:${profile.email}): ${mdEscape(profile.email)}`,
    );
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
      lines.push(
        `- [${mdEscape(p.title)}](${base}/portfolio/${p.id}): ${desc}${tags}`,
      );
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
      lines.push(
        `- [${title} — ${issuer}](${base}/#certificates): ${mdEscape(c.period)}${validation}`,
      );
    }
  }
  lines.push("");

  // Blog
  lines.push("## Blog");
  lines.push("");
  if (blogs.length === 0) {
    lines.push("- No blog posts yet.");
  } else {
    for (const b of blogs) {
      const cats = b.categories.length ? ` — ${b.categories.join(", ")}` : "";
      const date = b.publishedDate ? ` (${b.publishedDate.slice(0, 10)})` : "";
      const href =
        b.source === "external" ? b.externalUrl : `${base}/blog/${b.slug}`;
      const platform = b.platform ? ` — via ${b.platform}` : "";
      lines.push(`- [${mdEscape(b.title)}](${href}):${cats}${date}${platform}`);
    }
  }
  lines.push("");

  lines.push("## Optional");
  lines.push("");
  lines.push(`- [Sitemap](${base}/sitemap.xml): All indexable URLs`);
  lines.push(`- [Robots](${base}/robots.txt): Crawl rules`);
  lines.push(
    `- [Blog RSS — via sitemap](${base}/sitemap.xml): Blog discovery via sitemap`,
  );
  lines.push("");

  const body = lines.join("\n");

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
