export interface AIService {
  generateSummary(text: string): Promise<string>;
}
