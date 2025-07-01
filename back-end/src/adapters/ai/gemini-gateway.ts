import dedent from "dedent";
import { LLMFactory } from "llm-factory";
import { AIService } from "../../core/ports/ai-service";

export class GeminiGateway implements AIService {
  private llmFactory: LLMFactory = new LLMFactory();

  async generateSummary(text: string): Promise<string> {
    const prompt = dedent`
      <task>
        - Summarize the following content in under 30 words
        - Focus on key points only
        - Return only the summary
      </task>

      <content>
        ${text}
      </content>`;

    const response = await this.llmFactory.generate({
      model: "gemini-2.0-flash",
      prompt,
      temperature: 0.3,
    });

    return response.text;
  }
}
