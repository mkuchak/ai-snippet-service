import type { AIService, StreamingCallbacks } from "../ports/ai-service";
import type { SnippetDAO } from "../ports/snippet-dao";

export class SnippetService {
  constructor(
    private dao: SnippetDAO,
    private aiService: AIService,
  ) {}

  async createSnippet(text: string) {
    const summary = await this.aiService.generateSummary(text);
    return await this.dao.create({ text, summary });
  }

  async createSnippetWithoutSummary(text: string) {
    return await this.dao.create({ text });
  }

  async generateAndSaveSummaryWithStreaming(
    snippetId: string,
    callbacks: StreamingCallbacks,
  ): Promise<void> {
    const snippet = await this.dao.findById(snippetId);
    if (!snippet) {
      throw new Error(`Snippet with id ${snippetId} not found`);
    }

    if (snippet.summary && snippet.summary.trim() !== "") {
      callbacks.onComplete?.();
      return;
    }

    const summaryAccumulator = { content: "" };

    const enhancedCallbacks: StreamingCallbacks = {
      onChunk: (chunk) => {
        summaryAccumulator.content += chunk;
        callbacks.onChunk(chunk);
      },
      onComplete: async () => {
        await this.dao.update(snippetId, {
          summary: summaryAccumulator.content,
        });
        callbacks.onComplete?.();
      },
      onError: callbacks.onError,
    };

    await this.aiService.generateSummaryWithStream(
      snippet.text,
      enhancedCallbacks,
    );
  }

  async getSnippet(id: string) {
    return await this.dao.findById(id);
  }

  async getAllSnippets() {
    return await this.dao.findAll();
  }
}
