import { unstable_cache } from "next/cache";
import { cache } from "react";

export const cached = <T extends (...args: any[]) => any>(
  fn: T,
  key: string,
  opts?: { revalidate?: number; tags?: string[] },
) =>
  unstable_cache(fn as never, [key], {
    tags: opts?.tags ?? [key],
    revalidate: opts?.revalidate ?? 3600,
  }) as unknown as T;

export const requestCached = cache;

export const CACHE_TAGS = [
  "profile",
  "portfolios",
  "experiences",
  "certificates",
] as const;
