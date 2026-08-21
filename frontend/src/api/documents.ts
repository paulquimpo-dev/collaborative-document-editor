import type { DocumentLists, User } from "../types";
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
