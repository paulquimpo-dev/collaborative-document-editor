import { useEffect, useRef } from "react";

interface DeleteDocumentDialogProps { title: string; isDeleting: boolean; error: string | null; onCancel: () => void; onDelete: () => void; }

export function DeleteDocumentDialog({ title, isDeleting, error, onCancel, onDelete }: DeleteDocumentDialogProps) {
  const cancelRef = useRef<HTMLButtonElement>(null);
  useEffect(() => { cancelRef.current?.focus(); }, []);
  return <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget && !isDeleting) onCancel(); }}><section className="confirmation-dialog" role="dialog" aria-modal="true" aria-labelledby="delete-title"><div className="dialog-icon dialog-icon-danger" aria-hidden="true">×</div><div className="dialog-copy"><h2 id="delete-title">Delete document?</h2><p><strong>{title}</strong> will be permanently deleted for everyone with access.</p>{error && <p className="dialog-error" role="alert">{error}</p>}</div><div className="dialog-actions"><button ref={cancelRef} type="button" className="button button-secondary" disabled={isDeleting} onClick={onCancel}>Cancel</button><button type="button" className="button button-danger" disabled={isDeleting} onClick={onDelete}>{isDeleting ? "Deleting…" : "Delete document"}</button></div></section></div>;
}
