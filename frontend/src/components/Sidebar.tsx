import type { DocumentLists, DocumentSummary } from "../types";
import { DocumentList } from "./DocumentList";

interface SidebarProps {
  documents: DocumentLists;
  selectedDocumentId: number | null;
  isLoading: boolean;
  isCreating: boolean;
  onNewDocument: () => void;
  onSelect: (document: DocumentSummary) => void;
}

export function Sidebar({
  documents,
  selectedDocumentId,
  isLoading,
  isCreating,
  onNewDocument,
  onSelect,
}: SidebarProps) {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <span className="brand-mark" aria-hidden="true">C</span>
        <div>
          <p className="brand-name">Collaborative</p>
          <p className="brand-subtitle">Document Editor</p>
        </div>
      </div>

      <div className="sidebar-actions" aria-label="Document actions">
        <button type="button" className="button button-primary button-full" disabled={isCreating} onClick={onNewDocument}>
          <span aria-hidden="true">＋</span> {isCreating ? "Creating…" : "New Document"}
        </button>
        <button type="button" className="button button-secondary button-full" disabled title="File import is not available in this build">
          <span aria-hidden="true">↑</span> Import File
        </button>
        <p className="format-hint">Supports .txt and .md</p>
      </div>

      <nav className="sidebar-navigation" aria-label="Documents">
        {isLoading ? (
          <div className="sidebar-loading" role="status">
            <span className="spinner" aria-hidden="true" /> Loading documents…
          </div>
        ) : (
          <>
            <section className="document-group" aria-labelledby="owned-heading">
              <h2 id="owned-heading" className="document-group-title">
                My Documents <span className="document-count">{documents.owned.length}</span>
              </h2>
              <DocumentList documents={documents.owned} emptyMessage="No documents yet." selectedDocumentId={selectedDocumentId} onSelect={onSelect} />
            </section>
            <section className="document-group" aria-labelledby="shared-heading">
              <h2 id="shared-heading" className="document-group-title">
                Shared With Me <span className="document-count">{documents.shared.length}</span>
              </h2>
              <DocumentList documents={documents.shared} emptyMessage="Nothing has been shared with you yet." selectedDocumentId={selectedDocumentId} showOwner onSelect={onSelect} />
            </section>
          </>
        )}
      </nav>
    </aside>
  );
}
