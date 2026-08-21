import { useEffect, useMemo, useState } from "react";
import {
  createDocument,
  getDocument,
  getDocuments,
  getUsers,
  updateDocument,
} from "./api/documents";
import { AppLayout } from "./components/AppLayout";
import { DocumentEditor, type SaveStatus } from "./components/DocumentEditor";
import { Sidebar } from "./components/Sidebar";
import { UserSwitcher } from "./components/UserSwitcher";
import { UnsavedChangesDialog } from "./components/UnsavedChangesDialog";
import type {
  DocumentDetail,
  DocumentLists,
  DocumentSummary,
  TipTapNode,
  User,
} from "./types";

const ACTIVE_USER_STORAGE_KEY = "collaborative-document-editor.active-user";
const EMPTY_DOCUMENTS: DocumentLists = { owned: [], shared: [] };

function App() {
  const [users, setUsers] = useState<User[]>([]);
  const [activeUserId, setActiveUserId] = useState<number | null>(null);
  const [documents, setDocuments] = useState<DocumentLists>(EMPTY_DOCUMENTS);
  const [selectedDocument, setSelectedDocument] = useState<DocumentDetail | null>(null);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);
  const [isLoadingDocuments, setIsLoadingDocuments] = useState(false);
  const [isLoadingDocument, setIsLoadingDocument] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("saved");
  const [error, setError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [pendingNavigation, setPendingNavigation] = useState<(() => void) | null>(null);

  const isDirty = saveStatus === "unsaved" || saveStatus === "error";

  useEffect(() => {
    const controller = new AbortController();
    getUsers(controller.signal)
      .then((loadedUsers) => {
        setUsers(loadedUsers);
        const storedId = Number(localStorage.getItem(ACTIVE_USER_STORAGE_KEY));
        const storedUser = loadedUsers.find((user) => user.id === storedId);
        setActiveUserId(storedUser?.id ?? loadedUsers[0]?.id ?? null);
        setError(null);
      })
      .catch((requestError: unknown) => {
        if (!controller.signal.aborted) setError(errorMessage(requestError, "Unable to load users."));
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
          setError(errorMessage(requestError, "Unable to load documents."));
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsLoadingDocuments(false);
      });
    return () => controller.abort();
  }, [activeUserId]);

  useEffect(() => {
    function warnBeforeUnload(event: BeforeUnloadEvent) {
      if (!isDirty) return;
      event.preventDefault();
    }
    window.addEventListener("beforeunload", warnBeforeUnload);
    return () => window.removeEventListener("beforeunload", warnBeforeUnload);
  }, [isDirty]);

  const activeUser = useMemo(
    () => users.find((user) => user.id === activeUserId) ?? null,
    [users, activeUserId],
  );

  function runWithUnsavedGuard(action: () => void) {
    if (isDirty) {
      setPendingNavigation(() => action);
      return;
    }
    action();
  }

  async function openDocument(summary: DocumentSummary) {
    if (summary.id === selectedDocument?.id || activeUserId === null) return;
    setIsLoadingDocument(true);
    setSaveError(null);
    try {
      const detail = await getDocument(activeUserId, summary.id);
      setSelectedDocument(detail);
      setSaveStatus("saved");
      setError(null);
    } catch (requestError) {
      setError(errorMessage(requestError, "Unable to open the document."));
    } finally {
      setIsLoadingDocument(false);
    }
  }

  function handleSelectDocument(summary: DocumentSummary) {
    if (summary.id === selectedDocument?.id) return;
    runWithUnsavedGuard(() => void openDocument(summary));
  }

  async function createNewDocument() {
    if (activeUserId === null) return;
    setIsCreating(true);
    try {
      const created = await createDocument(activeUserId);
      setSelectedDocument(created);
      setSaveStatus("saved");
      setSaveError(null);
      setDocuments((current) => ({
        ...current,
        owned: [toSummary(created), ...current.owned],
      }));
    } catch (requestError) {
      setError(errorMessage(requestError, "Unable to create a document."));
    } finally {
      setIsCreating(false);
    }
  }

  function handleNewDocument() {
    runWithUnsavedGuard(() => void createNewDocument());
  }

  function handleUserChange(userId: number) {
    if (userId === activeUserId) return;
    runWithUnsavedGuard(() => {
      setActiveUserId(userId);
      setSelectedDocument(null);
      setDocuments(EMPTY_DOCUMENTS);
      setSaveStatus("saved");
      setSaveError(null);
      localStorage.setItem(ACTIVE_USER_STORAGE_KEY, String(userId));
    });
  }

  function cancelPendingNavigation() {
    setPendingNavigation(null);
  }

  function discardAndContinue() {
    const action = pendingNavigation;
    setPendingNavigation(null);
    action?.();
  }

  function updateSelectedDocument(values: Partial<DocumentDetail>) {
    setSelectedDocument((current) => (current ? { ...current, ...values } : current));
    setSaveStatus("unsaved");
    setSaveError(null);
  }

  async function handleSave() {
    if (!selectedDocument || activeUserId === null) return;
    setSaveStatus("saving");
    setSaveError(null);
    try {
      const saved = await updateDocument(activeUserId, selectedDocument.id, {
        title: selectedDocument.title,
        content: selectedDocument.content,
      });
      setSelectedDocument(saved);
      setSaveStatus("saved");
      setDocuments((current) => updateSummaryInLists(current, saved));
    } catch (requestError) {
      setSaveStatus("error");
      setSaveError(errorMessage(requestError, "Unable to save the document."));
    }
  }

  return (
    <>
    <AppLayout
      sidebar={
        <Sidebar
          documents={documents}
          selectedDocumentId={selectedDocument?.id ?? null}
          isLoading={isLoadingDocuments}
          isCreating={isCreating}
          onNewDocument={handleNewDocument}
          onSelect={handleSelectDocument}
        />
      }
      header={
        <>
          <div>
            <p className="workspace-eyebrow">Document workspace</p>
            <h1>{selectedDocument?.title || "Your documents"}</h1>
          </div>
          <UserSwitcher users={users} activeUserId={activeUserId} disabled={isLoadingUsers || isCreating} onChange={handleUserChange} />
        </>
      }
    >
      {error ? (
        <div className="state-card state-card-error" role="alert">
          <span className="state-icon" aria-hidden="true">!</span>
          <div><h2>Unable to load the workspace</h2><p>{error}</p><button type="button" className="button button-secondary" onClick={() => window.location.reload()}>Try again</button></div>
        </div>
      ) : isLoadingDocument ? (
        <div className="state-card" role="status"><span className="spinner" aria-hidden="true" /><div><h2>Opening document…</h2><p>Loading its latest saved content.</p></div></div>
      ) : selectedDocument ? (
        <DocumentEditor
          key={selectedDocument.id}
          document={selectedDocument}
          saveStatus={saveStatus}
          errorMessage={saveError}
          onTitleChange={(title) => updateSelectedDocument({ title })}
          onContentChange={(content: TipTapNode) => updateSelectedDocument({ content })}
          onSave={handleSave}
        />
      ) : (
        <div className="state-card state-card-empty">
          <span className="state-icon state-icon-document" aria-hidden="true">▤</span>
          <div><h2>{activeUser ? `${activeUser.name}'s workspace` : "Your workspace"}</h2><p>Select a document from the sidebar or create a new one to begin writing.</p></div>
        </div>
      )}
    </AppLayout>
    {pendingNavigation && (
      <UnsavedChangesDialog
        onCancel={cancelPendingNavigation}
        onDiscard={discardAndContinue}
      />
    )}
    </>
  );
}

function errorMessage(error: unknown, fallback: string): string {
  return error instanceof Error ? error.message : fallback;
}

function toSummary(document: DocumentDetail): DocumentSummary {
  const { id, title, owner, is_owner, updated_at } = document;
  return { id, title, owner, is_owner, updated_at };
}

function updateSummaryInLists(lists: DocumentLists, document: DocumentDetail): DocumentLists {
  const update = (item: DocumentSummary) => item.id === document.id ? toSummary(document) : item;
  return { owned: lists.owned.map(update), shared: lists.shared.map(update) };
}

export default App;
