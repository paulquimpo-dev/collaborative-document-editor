import type { Editor } from "@tiptap/react";

interface EditorToolbarProps {
  editor: Editor | null;
}

interface ToolButtonProps {
  label: string;
  active: boolean;
  disabled: boolean;
  onClick: () => void;
  children: string;
}

function ToolButton({ label, active, disabled, onClick, children }: ToolButtonProps) {
  return (
    <button
      type="button"
      className="toolbar-button"
      aria-label={label}
      aria-pressed={active}
      title={label}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export function EditorToolbar({ editor }: EditorToolbarProps) {
  const disabled = !editor;
  return (
    <div className="editor-toolbar" role="toolbar" aria-label="Text formatting">
      <div className="toolbar-group">
        <ToolButton label="Bold" active={editor?.isActive("bold") ?? false} disabled={disabled} onClick={() => editor?.chain().focus().toggleBold().run()}>B</ToolButton>
        <ToolButton label="Italic" active={editor?.isActive("italic") ?? false} disabled={disabled} onClick={() => editor?.chain().focus().toggleItalic().run()}>I</ToolButton>
        <ToolButton label="Underline" active={editor?.isActive("underline") ?? false} disabled={disabled} onClick={() => editor?.chain().focus().toggleUnderline().run()}>U</ToolButton>
      </div>
      <div className="toolbar-separator" aria-hidden="true" />
      <div className="toolbar-group">
        <ToolButton label="Heading 1" active={editor?.isActive("heading", { level: 1 }) ?? false} disabled={disabled} onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()}>H1</ToolButton>
        <ToolButton label="Heading 2" active={editor?.isActive("heading", { level: 2 }) ?? false} disabled={disabled} onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}>H2</ToolButton>
      </div>
      <div className="toolbar-separator" aria-hidden="true" />
      <div className="toolbar-group">
        <ToolButton label="Bullet list" active={editor?.isActive("bulletList") ?? false} disabled={disabled} onClick={() => editor?.chain().focus().toggleBulletList().run()}>• List</ToolButton>
        <ToolButton label="Numbered list" active={editor?.isActive("orderedList") ?? false} disabled={disabled} onClick={() => editor?.chain().focus().toggleOrderedList().run()}>1. List</ToolButton>
      </div>
    </div>
  );
}
