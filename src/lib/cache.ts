import { unstable_cache } from "next/cache";
import { cache } from "react";

export const cached = <T extends (...args: unknown[]) => unknown>(
  fn: T,
  key: string,
) => unstable_cache(fn as never, [key], { tags: [key] }) as unknown as T;

export const requestCached = cache;

export const CACHE_TAGS = [
  "profile",
  "portfolios",
  "experiences",
  "certificates",
] as const;
