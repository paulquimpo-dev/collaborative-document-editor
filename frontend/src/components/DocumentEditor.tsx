import Underline from "@tiptap/extension-underline";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import type { DocumentDetail, TipTapNode } from "../types";
import { EditorToolbar } from "./EditorToolbar";

export type SaveStatus = "saved" | "unsaved" | "saving" | "error";

interface DocumentEditorProps {
  document: DocumentDetail;
  saveStatus: SaveStatus;
  errorMessage: string | null;
  onTitleChange: (title: string) => void;
  onContentChange: (content: TipTapNode) => void;
  onSave: () => void;
  onShare: () => void;
  onDelete: () => void;
}

const STATUS_LABELS: Record<SaveStatus, string> = {
  saved: "Saved",
  unsaved: "Unsaved changes",
  saving: "Saving…",
  error: "Save failed",
};

export function DocumentEditor({
  document,
  saveStatus,
  errorMessage,
  onTitleChange,
  onContentChange,
  onSave,
  onShare,
  onDelete,
}: DocumentEditorProps) {
  const editor = useEditor({
    extensions: [StarterKit, Underline],
    content: document.content,
    editorProps: { attributes: { class: "tiptap-content", "aria-label": "Document content" } },
    onUpdate: ({ editor: updatedEditor }) => onContentChange(updatedEditor.getJSON() as TipTapNode),
  });

  return (
    <article className="document-editor" aria-label={`Editing ${document.title}`}>
      <div className="document-editor-header">
        <div className="document-title-area">
          <label className="sr-only" htmlFor="document-title">Document title</label>
          <input
            id="document-title"
            className="document-title-input"
            value={document.title}
            onChange={(event) => onTitleChange(event.target.value)}
          />
          <span className="ownership-label">
            {document.is_owner ? "Owned by you" : `Shared by ${document.owner.name}`}
          </span>
        </div>
        <div className="document-save-area">
          <span className={`save-indicator save-${saveStatus}`} aria-live="polite">{STATUS_LABELS[saveStatus]}</span>
          {document.is_owner && <button type="button" className="button button-secondary" onClick={onShare}>Share</button>}
          {document.is_owner && <button type="button" className="button button-danger-secondary" onClick={onDelete}>Delete</button>}
          <button type="button" className="button button-primary" disabled={saveStatus === "saving" || saveStatus === "saved"} onClick={onSave}>Save</button>
        </div>
      </div>
      {errorMessage && <div className="inline-error" role="alert">{errorMessage}</div>}
      <EditorToolbar editor={editor} />
      <div className="editor-page">
        <EditorContent editor={editor} />
      </div>
    </article>
  );
}
