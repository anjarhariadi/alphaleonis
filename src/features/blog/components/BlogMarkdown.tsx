import "katex/dist/katex.min.css";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import { cn } from "@/lib/utils";
import { remarkCallout } from "../remark-callout";

const CALLOUT_CLASS: Record<string, string> = {
  note: "border-blue-500 bg-blue-500/10",
  tip: "border-emerald-500 bg-emerald-500/10",
  warning: "border-amber-500 bg-amber-500/10",
  important: "border-violet-500 bg-violet-500/10",
  caution: "border-red-500 bg-red-500/10",
  danger: "border-red-500 bg-red-500/10",
};

const CALLOUT_FALLBACK = "border-border bg-muted";

type Props = {
  content: string;
  slug: string;
};

function resolveSrc(slug: string, src?: string) {
  if (!src) return "";
  if (/^(https?:)?\/\//.test(src) || src.startsWith("/")) return src;
  return `/blog/${slug}/${src.replace(/^\.\//, "")}`;
}

export function BlogMarkdown({ content, slug }: Props) {
  return (
    <div className="space-y-4 leading-relaxed">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath, remarkCallout]}
        rehypePlugins={[rehypeKatex]}
        components={{
          h1: ({ children }) => (
            <h1 className="mt-8 text-2xl font-bold">{children}</h1>
          ),
          h2: ({ children }) => (
            <h2 className="mt-8 text-xl font-semibold">{children}</h2>
          ),
          h3: ({ children }) => (
            <h3 className="mt-6 text-lg font-medium">{children}</h3>
          ),
          p: ({ children }) => <p className="my-4">{children}</p>,
          ul: ({ children }) => (
            <ul className="my-2 ml-6 list-disc space-y-1">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="my-2 ml-6 list-decimal space-y-1">{children}</ol>
          ),
          li: ({ children }) => <li className="leading-relaxed">{children}</li>,
          blockquote: ({ node, children }) => {
            const classes = node?.properties?.className?.map(String) ?? [];
            const callout = classes.find((name) => name.startsWith("callout-"));

            if (!callout) {
              return (
                <blockquote className="my-4 border-l-4 border-gray-300 pl-4 text-gray-700 italic dark:text-gray-200">
                  {children}
                </blockquote>
              );
            }

            const type = callout.slice("callout-".length);
            return (
              <div
                className={cn(
                  "my-4 rounded-r-md border-l-4 px-4 py-3 [&>p]:my-1 [&>p:first-child]:mt-0 [&>p:last-child]:mb-0",
                  CALLOUT_CLASS[type] ?? CALLOUT_FALLBACK,
                )}
              >
                {children}
              </div>
            );
          },
          hr: () => <hr className="my-6" />,
          pre: ({ children }) => (
            <pre className="bg-sidebar my-4 overflow-x-auto rounded-md px-4 py-3 font-mono text-sm">
              {children}
            </pre>
          ),
          code: ({ className, children }) => (
            <code
              className={cn(
                "font-mono text-sm",
                className ? className : "bg-sidebar rounded px-1.5 py-0.5",
              )}
            >
              {children}
            </code>
          ),
          table: ({ children }) => (
            <div className="my-4 overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                {children}
              </table>
            </div>
          ),
          th: ({ children }) => (
            <th className="bg-sidebar border px-3 py-2 text-left font-semibold">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="border px-3 py-2">{children}</td>
          ),
          a: ({ href, children }) => {
            const external = !!href && /^https?:\/\//.test(href);
            return (
              <a
                href={href}
                {...(external
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
                className="text-primary underline"
              >
                {children}
              </a>
            );
          },
          img: ({ src, alt }) => {
            const url = resolveSrc(
              slug,
              typeof src === "string" ? src : undefined,
            );
            if (!url) return null;
            if (/^https?:\/\//.test(url)) {
              return (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={url}
                  alt={alt ?? ""}
                  loading="lazy"
                  className="mx-auto my-4 h-auto w-full max-w-xl rounded-md"
                />
              );
            }
            return (
              <Image
                src={url}
                alt={alt ?? ""}
                width={0}
                height={0}
                sizes="(max-width:768px) 100vw, 700px"
                className="mx-auto my-4 h-auto w-full max-w-xl rounded-md"
              />
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
