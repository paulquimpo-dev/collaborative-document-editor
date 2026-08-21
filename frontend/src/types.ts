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

export interface TipTapNode {
  type: string;
  attrs?: Record<string, unknown>;
  content?: TipTapNode[];
  marks?: Array<{ type: string; attrs?: Record<string, unknown> }>;
  text?: string;
}

export interface DocumentDetail extends DocumentSummary {
  content: TipTapNode;
  shared_users: User[];
  created_at: string;
}
