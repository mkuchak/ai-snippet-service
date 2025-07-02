import dedent from "dedent";
import { LLMFactory } from "llm-factory";
import { env } from "../../config/env";
import type {
  AIGateway,
  StreamingCallbacks,
} from "../../core/ports/ai-gateway";

export class GeminiGateway implements AIGateway {
  private llmFactory: LLMFactory = new LLMFactory({
    googleApiKey: env.GEMINI_API_KEY,
  });

  private generateSummaryPrompt = (text: string) => dedent`
  <task>
    - Summarize the following content in under 30 words
    - Focus on key points only
    - Use the same language as the content
    - Return only the summary
  </task>
  
  <content>
    ${text}
  </content>`;

  async generateSummary(text: string): Promise<string> {
    const response = await this.llmFactory.generate({
      model: "gemini-2.0-flash",
      prompt: this.generateSummaryPrompt(text),
      temperature: 0.3,
    });

    return response.text;
  }

  async generateSummaryWithStream(
    text: string,
    callbacks: StreamingCallbacks,
  ): Promise<void> {
    try {
      const { stream } = this.llmFactory.generateStream({
        model: "gemini-2.0-flash",
        prompt: this.generateSummaryPrompt(text),
        temperature: 0.3,
      });

      for await (const chunk of stream) {
        if (chunk) {
          callbacks.onChunk(chunk);
        }
      }

      callbacks.onComplete?.();
    } catch (error) {
      if (callbacks.onError) {
        callbacks.onError(error as Error);
      } else {
        throw error;
      }
    }
  }
}
