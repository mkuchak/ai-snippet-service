import type { AIService } from "../ports/ai-service";
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

  async getSnippet(id: string) {
    return await this.dao.findById(id);
  }

  async getAllSnippets() {
    return await this.dao.findAll();
  }
}
