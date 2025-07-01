import { AIService } from "../../core/ports/ai-service";

export class MockAIGateway implements AIService {
  async generateSummary(text: string): Promise<string> {
    return `Summary: ${text.substring(0, 30)}${text.length > 30 ? "..." : ""}`;
  }
}
