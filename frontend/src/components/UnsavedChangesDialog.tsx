import { useEffect, useRef } from "react";

interface UnsavedChangesDialogProps {
  onCancel: () => void;
  onDiscard: () => void;
}

export function UnsavedChangesDialog({ onCancel, onDiscard }: UnsavedChangesDialogProps) {
  const cancelButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    cancelButtonRef.current?.focus();
  }, []);

  return (
    <div
      className="modal-backdrop"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onCancel();
      }}
      onKeyDown={(event) => {
        if (event.key === "Escape") onCancel();
      }}
    >
      <section
        className="confirmation-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="unsaved-title"
        aria-describedby="unsaved-description"
      >
        <div className="dialog-icon" aria-hidden="true">!</div>
        <div className="dialog-copy">
          <h2 id="unsaved-title">Discard unsaved changes?</h2>
          <p id="unsaved-description">
            Your latest edits have not been saved. Discarding will permanently lose those changes.
          </p>
        </div>
        <div className="dialog-actions">
          <button ref={cancelButtonRef} type="button" className="button button-secondary" onClick={onCancel}>
            Keep editing
          </button>
          <button type="button" className="button button-danger" onClick={onDiscard}>
            Discard changes
          </button>
        </div>
      </section>
    </div>
  );
}
