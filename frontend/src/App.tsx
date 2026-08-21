import { useEffect, useMemo, useState } from "react";
import { getDocuments, getUsers } from "./api/documents";
import { AppLayout } from "./components/AppLayout";
import { Sidebar } from "./components/Sidebar";
import { UserSwitcher } from "./components/UserSwitcher";
import type { DocumentLists, DocumentSummary, User } from "./types";

const ACTIVE_USER_STORAGE_KEY = "collaborative-document-editor.active-user";
const EMPTY_DOCUMENTS: DocumentLists = { owned: [], shared: [] };

function App() {
  const [users, setUsers] = useState<User[]>([]);
  const [activeUserId, setActiveUserId] = useState<number | null>(null);
  const [documents, setDocuments] = useState<DocumentLists>(EMPTY_DOCUMENTS);
  const [selectedDocument, setSelectedDocument] = useState<DocumentSummary | null>(null);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);
  const [isLoadingDocuments, setIsLoadingDocuments] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    setIsLoadingUsers(true);
    getUsers(controller.signal)
      .then((loadedUsers) => {
        setUsers(loadedUsers);
        const storedId = Number(localStorage.getItem(ACTIVE_USER_STORAGE_KEY));
        const storedUser = loadedUsers.find((user) => user.id === storedId);
        setActiveUserId(storedUser?.id ?? loadedUsers[0]?.id ?? null);
        setError(null);
      })
      .catch((requestError: unknown) => {
        if (!controller.signal.aborted) {
          setError(requestError instanceof Error ? requestError.message : "Unable to load users.");
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsLoadingUsers(false);
      });
    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (activeUserId === null) {
      setDocuments(EMPTY_DOCUMENTS);
      return;
    }
    const controller = new AbortController();
    setIsLoadingDocuments(true);
    getDocuments(activeUserId, controller.signal)
      .then((loadedDocuments) => {
        setDocuments(loadedDocuments);
        setError(null);
      })
      .catch((requestError: unknown) => {
        if (!controller.signal.aborted) {
          setDocuments(EMPTY_DOCUMENTS);
          setError(requestError instanceof Error ? requestError.message : "Unable to load documents.");
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsLoadingDocuments(false);
      });
    return () => controller.abort();
  }, [activeUserId]);

  const activeUser = useMemo(
    () => users.find((user) => user.id === activeUserId) ?? null,
    [users, activeUserId],
  );

  function handleUserChange(userId: number) {
    setActiveUserId(userId);
    setSelectedDocument(null);
    setDocuments(EMPTY_DOCUMENTS);
    localStorage.setItem(ACTIVE_USER_STORAGE_KEY, String(userId));
  }

  return (
    <AppLayout
      sidebar={<Sidebar documents={documents} selectedDocumentId={selectedDocument?.id ?? null} isLoading={isLoadingDocuments} onSelect={setSelectedDocument} />}
      header={
        <>
          <div>
            <p className="workspace-eyebrow">Document workspace</p>
            <h1>{selectedDocument?.title ?? "Your documents"}</h1>
          </div>
          <UserSwitcher users={users} activeUserId={activeUserId} disabled={isLoadingUsers} onChange={handleUserChange} />
        </>
      }
    >
      {error ? (
        <div className="state-card state-card-error" role="alert">
          <span className="state-icon" aria-hidden="true">!</span>
          <div>
            <h2>Unable to load the workspace</h2>
            <p>{error}</p>
            <button type="button" className="button button-secondary" onClick={() => window.location.reload()}>Try again</button>
          </div>
        </div>
      ) : selectedDocument ? (
        <article className="document-preview" aria-labelledby="selected-title">
          <div className="document-preview-header">
            <div>
              <span className="ownership-badge">{selectedDocument.is_owner ? "Owned by you" : `Shared by ${selectedDocument.owner.name}`}</span>
              <h2 id="selected-title">{selectedDocument.title}</h2>
            </div>
            <span className="save-status save-status-neutral">Ready to open</span>
          </div>
          <div className="editor-placeholder">
            <span className="placeholder-document-icon" aria-hidden="true">▤</span>
            <h3>Document selected</h3>
            <p>Open this document in the editor to view and update its content.</p>
          </div>
        </article>
      ) : (
        <div className="state-card state-card-empty">
          <span className="state-icon state-icon-document" aria-hidden="true">▤</span>
          <div>
            <h2>{activeUser ? `${activeUser.name}'s workspace` : "Your workspace"}</h2>
            <p>Select a document from the sidebar to view its details.</p>
          </div>
        </div>
      )}
    </AppLayout>
  );
}


export default App;
