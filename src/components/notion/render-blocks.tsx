import { renderKatexFromHtml } from "@/lib/katex-util";
import type {
  BlockObjectResponse,
  PartialBlockObjectResponse,
  ParagraphBlockObjectResponse,
  Heading1BlockObjectResponse,
  Heading2BlockObjectResponse,
  Heading3BlockObjectResponse,
  ImageBlockObjectResponse,
  EquationBlockObjectResponse,
} from "@notionhq/client/build/src/api-endpoints";
import Image from "next/image";
import { RichText } from "./rich-text";

type Block = PartialBlockObjectResponse | BlockObjectResponse;

interface RenderBlocksProps {
  blocks: Block[];
  fromRichText?: boolean;
  parentId?: string;
}

export function renderBlocks({
  blocks,
  fromRichText = false,
  parentId,
}: RenderBlocksProps) {
  const grouped: (Block | Block[])[] = [];

  let i = 0;
  while (i < blocks.length) {
    const current = blocks[i];
    if (!current || !("type" in current)) {
      i++;
      continue;
    }

    const t = current.type;
    if (t === "bulleted_list_item" || t === "numbered_list_item") {
      const group: Block[] = [current];
      let j = i + 1;
      while (j < blocks.length) {
        const next = blocks[j];
        if (!next || !("type" in next)) break;
        if (next.type === t) {
          group.push(next);
          j++;
        } else {
          break;
        }
      }
      grouped.push(group);
      i = j;
    } else {
      grouped.push(current);
      i++;
    }
  }

  return grouped.map((item, idx) => {
    const key = `${parentId ?? "root"}-${idx}`;

    if (Array.isArray(item)) {
      const first = item[0];
      if (!first || !("type" in first)) return null;
      const type = first.type;
      const listItems = item.map((blk, liIdx) => {
        const text = (
          (
            blk as unknown as Record<
              string,
              { rich_text: { plain_text: string }[] }
            >
          )[type]?.rich_text ?? []
        )
          .map((t) => t.plain_text)
          .join("");
        return (
          <li key={`${key}-li-${liIdx}`} className="leading-relaxed">
            {text}
          </li>
        );
      });

      if (type === "numbered_list_item") {
        return (
          <ol key={key} className="my-2 ml-6 list-decimal space-y-1">
            {listItems}
          </ol>
        );
      } else {
        return (
          <ul key={key} className="my-2 ml-6 list-disc space-y-1">
            {listItems}
          </ul>
        );
      }
    }

    const block = item as Block;
    if (!("type" in block)) return null;

    const { type } = block;
    type allTypes = typeof type | "text";
    const detailedType = type as allTypes;

    switch (detailedType) {
      case "paragraph": {
        const paragraph = (block as ParagraphBlockObjectResponse).paragraph;
        return (
          <p key={key}>
            {renderBlocks({
              blocks: paragraph.rich_text as unknown as Block[],
              fromRichText: true,
              parentId: block.id,
            })}
          </p>
        );
      }

      case "text": {
        return (
          <span key={key}>
            <RichText
              rich_text={[
                block as unknown as {
                  plain_text: string;
                  annotations: {
                    bold?: boolean;
                    italic?: boolean;
                    underline?: boolean;
                    strikethrough?: boolean;
                  };
                  href: string | null;
                },
              ]}
            />
          </span>
        );
      }

      case "heading_1": {
        const text = (block as Heading1BlockObjectResponse).heading_1.rich_text;
        return (
          <h1 key={key} className="text-2xl font-bold">
            <RichText rich_text={text as never} />
          </h1>
        );
      }

      case "heading_2": {
        const text = (block as Heading2BlockObjectResponse).heading_2.rich_text;
        return (
          <h2 key={key} className="text-xl font-semibold">
            <RichText rich_text={text as never} />
          </h2>
        );
      }

      case "heading_3": {
        const text = (block as Heading3BlockObjectResponse).heading_3.rich_text;
        return (
          <h3 key={key} className="text-lg font-medium">
            <RichText rich_text={text as never} />
          </h3>
        );
      }

      case "image": {
        const image = (block as ImageBlockObjectResponse).image;
        const src = image.type === "file" ? image.file.url : image.external.url;
        return (
          <Image
            key={key}
            src={src}
            alt={`notion-image-${block.id}`}
            width={700}
            height={700}
            sizes="(max-width:768px) 100vw, 700px"
            className="mx-auto h-auto w-full max-w-xl"
          />
        );
      }

      case "code": {
        const code = (
          block as unknown as {
            code: { rich_text: { plain_text: string }[] };
          }
        ).code.rich_text
          .map((rt) => rt.plain_text)
          .join("");
        return (
          <pre
            key={key}
            className="bg-sidebar my-4 overflow-x-auto rounded-md px-4 py-3 font-mono text-sm"
          >
            <code>{code}</code>
          </pre>
        );
      }

      case "quote": {
        const quote = (
          block as unknown as {
            quote: { rich_text: { plain_text: string }[] };
          }
        ).quote.rich_text
          .map((rt) => rt.plain_text)
          .join("");
        return (
          <blockquote
            key={key}
            className="my-4 border-l-4 border-gray-300 pl-4 text-gray-700 italic dark:text-gray-200"
          >
            {quote}
          </blockquote>
        );
      }

      case "equation": {
        const expr = (block as EquationBlockObjectResponse).equation.expression;
        const html = renderKatexFromHtml(
          fromRichText ? `$${expr}$` : `$$${expr}$$`,
        );
        return fromRichText ? (
          <span key={key} dangerouslySetInnerHTML={{ __html: html }} />
        ) : (
          <div key={key} className="w-full overflow-x-auto">
            <span dangerouslySetInnerHTML={{ __html: html }} />
          </div>
        );
      }

      case "divider": {
        return <hr key={key} />;
      }

      default:
        return null;
    }
  });
}
