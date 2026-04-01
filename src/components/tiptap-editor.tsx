import "katex/dist/katex.min.css";
import { EditorContent, useEditor } from "@tiptap/react";
import { Mathematics } from "@tiptap/extension-mathematics";
import Placeholder from "@tiptap/extension-placeholder";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Heading from "@tiptap/extension-heading";
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import Code from "@tiptap/extension-code";
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  BoldIcon,
  CaseSensitive,
  Code2,
  Heading1,
  Heading2,
  Heading3,
  ItalicIcon,
  List,
  ListOrdered,
  Radical,
  StrikethroughIcon,
  UnderlineIcon,
} from "lucide-react";

export default function TiptapInput({
  value,
  placeholder,
  onChange,
}: {
  value?: string;
  placeholder?: string;
  onChange: (richText: string) => void;
}) {
  const editor = useEditor({
    shouldRerenderOnTransaction: true,
    extensions: [
      StarterKit,
      Heading.configure({
        levels: [1, 2, 3],
      }),
      Bold,
      Italic,
      Underline,
      Code,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Mathematics,
      Placeholder.configure({ placeholder }),
    ],
    content: value,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "rounded-md border min-h-[150px] border-input bg-white focus:ring-offset-2 disabled:cursor-not-allows disabled:opacity-50 p-2",
      },
    },
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
  });

  if (!editor) {
    return null;
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <ToggleGroup
          type="multiple"
          variant="outline"
          className="bg-white"
          value={[
            editor.isActive("bold") ? "bold" : "",
            editor.isActive("italic") ? "italic" : "",
            editor.isActive("underline") ? "underline" : "",
            editor.isActive("strikethrough") ? "strikethrough" : "",
          ]}
        >
          <ToggleGroupItem
            value="bold"
            aria-label="Toggle bold"
            onClick={() => editor.chain().focus().toggleBold().run()}
          >
            <BoldIcon className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem
            value="italic"
            aria-label="Toggle italic"
            onClick={() => editor.chain().focus().toggleItalic().run()}
          >
            <ItalicIcon />
          </ToggleGroupItem>
          <ToggleGroupItem
            value="underline"
            aria-label="Toggle underline"
            onClick={() => editor.chain().focus().toggleUnderline().run()}
          >
            <UnderlineIcon />
          </ToggleGroupItem>
          <ToggleGroupItem
            value="strikethrough"
            aria-label="Toggle strikethrough"
            onClick={() => editor.chain().focus().toggleStrike().run()}
          >
            <StrikethroughIcon />
          </ToggleGroupItem>
        </ToggleGroup>

        <ToggleGroup
          type="multiple"
          variant="outline"
          className="bg-white"
          value={[
            editor.isActive("heading", { level: 1 }) ? "heading1" : "",
            editor.isActive("heading", { level: 2 }) ? "heading2" : "",
            editor.isActive("heading", { level: 3 }) ? "heading3" : "",
            editor.isActive("paragraph") ? "paragraph" : "",
          ]}
        >
          <ToggleGroupItem
            value="heading1"
            aria-label="Toggle heading 1"
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 1 }).run()
            }
          >
            <Heading1 />
          </ToggleGroupItem>
          <ToggleGroupItem
            value="heading2"
            aria-label="Toggle heading 2"
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
          >
            <Heading2 />
          </ToggleGroupItem>
          <ToggleGroupItem
            value="heading3"
            aria-label="Toggle heading 3"
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 3 }).run()
            }
          >
            <Heading3 />
          </ToggleGroupItem>
          <ToggleGroupItem
            value="paragraph"
            aria-label="Toggle paragraph"
            onClick={() => editor.chain().focus().setParagraph().run()}
          >
            <CaseSensitive />
          </ToggleGroupItem>
        </ToggleGroup>

        <ToggleGroup
          type="multiple"
          variant="outline"
          className="bg-white"
          value={[
            editor.isActive({ textAlign: "left" }) ? "align-left" : "",
            editor.isActive({ textAlign: "center" }) ? "align-center" : "",
            editor.isActive({ textAlign: "right" }) ? "align-right" : "",
          ]}
        >
          <ToggleGroupItem
            value="align-left"
            aria-label="Toggle align left"
            onClick={() => editor.chain().focus().toggleTextAlign("left").run()}
          >
            <AlignLeft />
          </ToggleGroupItem>
          <ToggleGroupItem
            value="align-center"
            aria-label="Toggle align center"
            onClick={() =>
              editor.chain().focus().toggleTextAlign("center").run()
            }
          >
            <AlignCenter />
          </ToggleGroupItem>
          <ToggleGroupItem
            value="align-right"
            aria-label="Toggle align right"
            onClick={() =>
              editor.chain().focus().toggleTextAlign("right").run()
            }
          >
            <AlignRight />
          </ToggleGroupItem>
        </ToggleGroup>

        <ToggleGroup
          type="multiple"
          variant="outline"
          className="bg-white"
          value={[]}
        >
          <ToggleGroupItem
            value="ordered-list"
            aria-label="Toggle ordered list"
            onClick={() => editor.chain().toggleOrderedList().focus().run()}
          >
            <ListOrdered />
          </ToggleGroupItem>
          <ToggleGroupItem
            value="unordered-list"
            aria-label="Toggle unordered list"
            onClick={() => editor.chain().toggleBulletList().focus().run()}
          >
            <List />
          </ToggleGroupItem>
          <ToggleGroupItem
            value="math"
            aria-label="Toggle math"
            onClick={() => editor.chain().insertContent("$x$ ").focus().run()}
          >
            <Radical />
          </ToggleGroupItem>
          <ToggleGroupItem
            value="code"
            aria-label="Toggle code"
            onClick={() => editor.chain().focus().toggleCode().run()}
          >
            <Code2 />
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
