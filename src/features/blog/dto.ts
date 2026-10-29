export interface BlogPost {
  slug: string;
  title: string;
  categories: string[];
  publishedDate: string;
  author: string;
  cover: string | null;
  source: "local" | "external";
  externalUrl?: string;
  platform?: string;
}

export interface BlogPostDetail extends BlogPost {
  content: string;
}
