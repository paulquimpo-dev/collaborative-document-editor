import type { DocumentSummary } from "../types";

interface DocumentListProps {
  documents: DocumentSummary[];
  emptyMessage: string;
  selectedDocumentId: number | null;
  showOwner?: boolean;
  onSelect: (document: DocumentSummary) => void;
}

export function DocumentList({
  documents,
  emptyMessage,
  selectedDocumentId,
  showOwner = false,
  onSelect,
}: DocumentListProps) {
  if (documents.length === 0) {
    return <p className="document-list-empty">{emptyMessage}</p>;
  }

  return (
    <ul className="document-list">
      {documents.map((document) => {
        const isSelected = selectedDocumentId === document.id;
        return (
          <li key={document.id}>
            <button
              type="button"
              className="document-row"
              data-selected={isSelected}
              aria-current={isSelected ? "page" : undefined}
              title={document.title}
              onClick={() => onSelect(document)}
            >
              <span className="document-row-indicator" aria-hidden="true" />
              <span className="document-row-copy">
                <span className="document-row-title">{document.title}</span>
                {showOwner && (
                  <span className="document-row-meta">Shared by {document.owner.name}</span>
                )}
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
