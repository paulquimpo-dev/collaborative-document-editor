import type { DocumentDetail, DocumentLists, TipTapNode, User } from "../types";
import { apiRequest } from "./client";

export function getUsers(signal?: AbortSignal): Promise<User[]> {
  return apiRequest<User[]>("/users/", { signal });
}

export function getDocuments(
  userId: number,
  signal?: AbortSignal,
): Promise<DocumentLists> {
  return apiRequest<DocumentLists>("/documents/", { userId, signal });
}

export function getDocument(userId: number, documentId: number): Promise<DocumentDetail> {
  return apiRequest<DocumentDetail>(`/documents/${documentId}/`, { userId });
}

export function createDocument(userId: number): Promise<DocumentDetail> {
  return apiRequest<DocumentDetail>("/documents/", {
    userId,
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title: "Untitled Document" }),
  });
}

export function updateDocument(
  userId: number,
  documentId: number,
  values: { title: string; content: TipTapNode },
): Promise<DocumentDetail> {
  return apiRequest<DocumentDetail>(`/documents/${documentId}/`, {
    userId,
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(values),
  });
}
