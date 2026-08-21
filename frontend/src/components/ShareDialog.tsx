import { useEffect, useRef, useState } from "react";
import type { User } from "../types";

interface ShareDialogProps {
  users: User[];
  isSubmitting: boolean;
  error: string | null;
  onCancel: () => void;
  onShare: (userId: number) => void;
}

export function ShareDialog({ users, isSubmitting, error, onCancel, onShare }: ShareDialogProps) {
  const [userId, setUserId] = useState(users[0]?.id ?? 0);
  const selectRef = useRef<HTMLSelectElement>(null);
  useEffect(() => { selectRef.current?.focus(); }, []);

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget && !isSubmitting) onCancel(); }}>
      <section className="confirmation-dialog" role="dialog" aria-modal="true" aria-labelledby="share-title">
        <div className="dialog-icon dialog-icon-primary" aria-hidden="true">↗</div>
        <div className="dialog-copy">
          <h2 id="share-title">Share document</h2>
          {users.length ? <><p>Select a user. Shared users can open and edit this document.</p><label className="field-label" htmlFor="share-user">Share with</label><select ref={selectRef} id="share-user" className="dialog-select" value={userId} onChange={(event) => setUserId(Number(event.target.value))}>{users.map((user) => <option key={user.id} value={user.id}>{user.name} ({user.email})</option>)}</select></> : <p>Every available user already has access to this document.</p>}
          {error && <p className="dialog-error" role="alert">{error}</p>}
        </div>
        <div className="dialog-actions"><button type="button" className="button button-secondary" disabled={isSubmitting} onClick={onCancel}>Cancel</button>{users.length > 0 && <button type="button" className="button button-primary" disabled={isSubmitting} onClick={() => onShare(userId)}>{isSubmitting ? "Sharing…" : "Share"}</button>}</div>
      </section>
    </div>
  );
}
