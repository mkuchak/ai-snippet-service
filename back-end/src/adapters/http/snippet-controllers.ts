import type { Request, Response } from "express";
import type { SnippetService } from "../../core/services/snippet-service";

export class SnippetControllers {
  constructor(private snippetService: SnippetService) {}

  createSnippet = async (req: Request, res: Response) => {
    try {
      const { text } = req.body;
      if (!text) {
        res.status(400).json({ error: "text is required" });
        return;
      }
      const snippet = await this.snippetService.createSnippet(text);
      res.status(201).json({
        id: snippet.id,
        text: snippet.text,
        summary: snippet.summary,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to create snippet" });
    }
  };

  getSnippet = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const snippet = await this.snippetService.getSnippet(id);
      if (!snippet) {
        res.status(404).json({ error: "Snippet not found" });
        return;
      }
      res.json({
        id: snippet.id,
        text: snippet.text,
        summary: snippet.summary,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to get snippet" });
    }
  };

  getAllSnippets = async (_req: Request, res: Response) => {
    try {
      const snippets = await this.snippetService.getAllSnippets();
      res.json(
        snippets.map((snippet) => ({
          id: snippet.id,
          text: snippet.text,
          summary: snippet.summary,
        }))
      );
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to get snippets" });
    }
  };
}
