import { cn } from "@/lib/utils";

type Annotations = {
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strikethrough?: boolean;
  code?: boolean;
  color?: string;
};

export function annotationClasses(a: Annotations) {
  return cn(
    a.bold && "font-bold",
    a.italic && "italic",
    a.underline && "underline",
    a.strikethrough && "line-through",
  );
}

type RichTextItem = {
  plain_text: string;
  annotations: Annotations;
  href: string | null;
  text?: { link?: { url: string } | null };
};

export function RichText({ rich_text }: { rich_text: RichTextItem[] }) {
  return (
    <>
      {rich_text.map((rt, i) => {
        const content = rt.href ? (
          <a
            key={i}
            href={rt.href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline"
          >
            {rt.plain_text}
          </a>
        ) : (
          rt.plain_text
        );
        return (
          <span key={i} className={annotationClasses(rt.annotations)}>
            {content}
          </span>
        );
      })}
    </>
  );
}
