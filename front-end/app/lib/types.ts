export interface Snippet {
  id: string;
  text: string;
  summary: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateSnippetData {
  text: string;
}

export interface ApiError {
  error: string;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
}
