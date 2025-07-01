import { AIService } from "../ports/ai-service";
import { SnippetRepository } from "../ports/snippet-repository";

export class SnippetService {
  constructor(private repository: SnippetRepository, private aiService: AIService) {}

  async createSnippet(text: string) {
    const summary = await this.aiService.generateSummary(text);
    return await this.repository.create({ text, summary });
  }

  async getSnippet(id: string) {
    return await this.repository.findById(id);
  }

  async getAllSnippets() {
    return await this.repository.findAll();
  }
}
