import "server-only";

import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { cache } from "react";
import { z } from "zod";
import type { BlogPost, BlogPostDetail } from "./dto";

const CONTENT_DIR = path.join(process.cwd(), "content", "blog");
const EXTERNAL_FILE = path.join(CONTENT_DIR, "external.json");
const SLUG_RE = /^[a-z0-9][a-z0-9-]*$/i;

const localFrontmatter = z.object({
  title: z.string().min(1),
  publishedDate: z.string().min(1),
  categories: z.array(z.string()).default([]),
  cover: z.string().min(1).nullish(),
  author: z.string().default("Anjar Hariadi"),
});

const externalPost = z.object({
  title: z.string().min(1),
  url: z.string().url(),
  platform: z.string().min(1),
  publishedDate: z.string().min(1),
  categories: z.array(z.string()).default([]),
  cover: z.string().url().nullish(),
  author: z.string().default("Anjar Hariadi"),
});

const externalFile = z.array(externalPost);

function isSafeSlug(slug: string) {
  return SLUG_RE.test(slug);
}

function resolveCover(slug: string, cover?: string | null) {
  if (!cover) return null;
  if (/^https?:\/\//.test(cover)) return cover;
  return `/blog/${slug}/${cover.replace(/^\.?\//, "")}`;
}

async function getPostSlugs() {
  try {
    const entries = await readdir(CONTENT_DIR, { withFileTypes: true });
    return entries
      .filter((entry) => entry.isDirectory() && isSafeSlug(entry.name))
      .map((entry) => entry.name);
  } catch {
    return [];
  }
}

async function readLocalPost(slug: string): Promise<BlogPostDetail | null> {
  if (!isSafeSlug(slug)) return null;
  let raw: string;
  try {
    raw = await readFile(path.join(CONTENT_DIR, slug, "index.md"), "utf8");
  } catch {
    return null;
  }
  const { data, content } = matter(raw);
  const frontmatter = localFrontmatter.parse(data);
  return {
    ...frontmatter,
    slug,
    cover: resolveCover(slug, frontmatter.cover),
    source: "local",
    content,
  };
}

async function getExternalPosts(): Promise<BlogPost[]> {
  let raw: string;
  try {
    raw = await readFile(EXTERNAL_FILE, "utf8");
  } catch {
    return [];
  }
  const posts = externalFile.parse(JSON.parse(raw));
  return posts.map((post, index) => ({
    ...post,
    slug: `external-${index}`,
    cover: post.cover ?? null,
    source: "external",
    externalUrl: post.url,
  }));
}

function byDateDesc(a: BlogPost, b: BlogPost) {
  return b.publishedDate.localeCompare(a.publishedDate);
}

export const getAllPosts = cache(async (): Promise<BlogPost[]> => {
  const slugs = await getPostSlugs();
  const local = (await Promise.all(slugs.map(readLocalPost)))
    .filter((post): post is BlogPostDetail => post !== null)
    .map(({ content: _content, ...post }) => post);
  const posts = [...local, ...(await getExternalPosts())];
  return posts.sort(byDateDesc);
});

export const getPost = cache(
  async (slug: string): Promise<BlogPostDetail | null> => {
    return readLocalPost(slug);
  },
);
