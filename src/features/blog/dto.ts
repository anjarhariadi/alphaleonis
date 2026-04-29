import type {
  BlockObjectResponse,
  PartialBlockObjectResponse,
} from "@notionhq/client";

export interface BlogPostContent {
  post: BlogPost | null;
  content: (PartialBlockObjectResponse | BlockObjectResponse)[];
  success: boolean;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  categories: BlogCategory[];
  published: boolean;
  publishedDate: string;
  author: string;
  cover: string | null;
}

export interface BlogCategory {
  id: string;
  name: string;
  color: string;
}
