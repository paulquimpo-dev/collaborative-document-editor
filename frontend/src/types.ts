export interface User {
  id: number;
  name: string;
  email: string;
}

export interface DocumentSummary {
  id: number;
  title: string;
  owner: User;
  is_owner: boolean;
  updated_at: string;
}

export interface DocumentLists {
  owned: DocumentSummary[];
  shared: DocumentSummary[];
}
