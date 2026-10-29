![Web Screenshoot](./ss.png)

# Anjar Hariadi Portfolio Website

This is my personal website built using [Next.js](https://nextjs.org), [Prisma](https://prisma.io), [Tailwind CSS](https://tailwindcss.com), [tRPC](https://trpc.io), and [Supabase](https://supabase.com/)

## Features

- Next.Js with typescript
- Shadcn Component
- Prisma ORM (PostgreSql via Supabase)
- Personal dashboard.
  I can manage all my information including profile, portfolio, experience, and certificate from dashboard page, so whenever i want to update some information i don't have to change the code, all protected with Supabase Auth.
- Blog
  Place where i post article of my interest. Posts are Markdown files in `content/blog/<slug>/index.md` (Obsidian-friendly), plus cross-posted links from other platforms in `content/blog/external.json`. LaTeX via `$inline$` and `$$block$$` is rendered with KaTeX.

  ```yaml
  ---
  title: "My Post"
  publishedDate: "2026-10-29"
  categories: ["Go"]
  author: "Anjar Hariadi" # optional
  cover: "cover.png" # optional, relative to the post folder
  ---
  ```

  Images live in the same folder and are referenced with `![alt](./image.png)`. They are copied to `public/blog/` on `dev`/`build`.

  Obsidian callouts are supported (border color only, no collapse):

  ```markdown
  > [!NOTE] Title
  > Callout body, including **markdown**, lists, and math like $x^2$.
  ```

  Known types: `NOTE`, `TIP`, `WARNING`, `IMPORTANT`, `CAUTION`, `DANGER`; other types fall back to a neutral style.
