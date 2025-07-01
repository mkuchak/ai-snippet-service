export interface Snippet {
  id: string;
  text: string;
  summary: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateSnippetData {
  text: string;
  summary: string;
}

export interface UpdateSnippetData {
  text?: string;
  summary?: string;
}
