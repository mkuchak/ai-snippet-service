import type {
  CreateSnippetData,
  Snippet,
  UpdateSnippetData,
} from "../types/snippet";

export interface SnippetDAO {
  create(data: CreateSnippetData): Promise<Snippet>;
  findById(id: string): Promise<Snippet | null>;
  findAll(): Promise<Snippet[]>;
  update(id: string, data: UpdateSnippetData): Promise<Snippet | null>;
  delete(id: string): Promise<boolean>;
}
