import type { Blockquote, Nodes, Parent, PhrasingContent, Root } from "mdast";
import type { Plugin } from "unified";

const CALLOUT_RE = /^\[!([a-zA-Z]+)\][+-]?\s*(.*)$/;

function transformCallout(node: Blockquote) {
  const first = node.children[0];
  if (first?.type !== "paragraph") return;
  const text = first.children[0];
  if (text?.type !== "text") return;

  const newline = text.value.indexOf("\n");
  const markerLine = newline === -1 ? text.value : text.value.slice(0, newline);
  const match = markerLine.match(CALLOUT_RE);
  if (!match) return;

  const type = (match[1] ?? "note").toLowerCase();
  const title = match[2]?.trim() || type;
  const remainder = newline === -1 ? "" : text.value.slice(newline + 1);
  const tail = first.children.slice(1);

  const children: PhrasingContent[] = [
    { type: "strong", children: [{ type: "text", value: title }] },
  ];
  if (remainder || tail.length) children.push({ type: "break" });
  if (remainder) children.push({ type: "text", value: remainder });
  children.push(...tail);
  first.children = children;

  node.data = {
    ...node.data,
    hProperties: {
      ...node.data?.hProperties,
      className: ["callout", `callout-${type}`],
    },
  };
}

function walk(node: Nodes) {
  if (node.type === "blockquote") transformCallout(node);
  if ("children" in node) (node as Parent).children.forEach(walk);
}

export const remarkCallout: Plugin<[], Root> = () => (tree) => {
  walk(tree);
};
