import { randomUUID } from "node:crypto";
import type { SnippetDAO } from "../../core/ports/snippet-dao";
import type {
  CreateSnippetData,
  Snippet,
  UpdateSnippetData,
} from "../../core/types/snippet";

export class InMemorySnippetDAO implements SnippetDAO {
  private snippets: Snippet[] = [];

  async create(data: CreateSnippetData): Promise<Snippet> {
    const id = randomUUID();
    const now = new Date();

    const snippet: Snippet = {
      id,
      text: data.text,
      summary: data.summary || "",
      createdAt: now,
      updatedAt: now,
    };

    this.snippets.push(snippet);
    return snippet;
  }

  async findById(id: string): Promise<Snippet | null> {
    return this.snippets.find((snippet) => snippet.id === id) || null;
  }

  async findAll(): Promise<Snippet[]> {
    return [...this.snippets].sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
    );
  }

  async update(id: string, data: UpdateSnippetData): Promise<Snippet | null> {
    const index = this.snippets.findIndex((snippet) => snippet.id === id);
    if (index === -1) return null;

    const updated: Snippet = {
      ...this.snippets[index],
      ...data,
      updatedAt: new Date(),
    };

    this.snippets[index] = updated;
    return updated;
  }

  async delete(id: string): Promise<boolean> {
    const index = this.snippets.findIndex((snippet) => snippet.id === id);
    if (index === -1) return false;

    this.snippets.splice(index, 1);
    return true;
  }

  clear(): void {
    this.snippets = [];
  }

  count(): number {
    return this.snippets.length;
  }
}
