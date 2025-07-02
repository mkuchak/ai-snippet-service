import axios from "axios";
import type { CreateSnippetData, Snippet } from "./types";

const API_BASE_URL =
  typeof window !== "undefined"
    ? `${import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api"}/v1`
    : `${process.env.API_BASE_URL || "http://backend:3000/api"}/v1`;

const client = axios.create({ baseURL: API_BASE_URL });

class Api {
  async getAllSnippets(): Promise<Snippet[]> {
    try {
      const response = await client.get<Snippet[]>("/snippets");
      return response.data;
    } catch (error) {
      console.error("Failed to get all snippets:", error);
      return [];
    }
  }

  async getSnippet(id: string): Promise<Snippet> {
    const response = await client.get<Snippet>(`/snippets/${id}`);
    return response.data;
  }

  async createSnippet(data: CreateSnippetData): Promise<Snippet> {
    const response = await client.post<Snippet>("/snippets", data);
    return response.data;
  }

  async generateSummaryWithStream(
    snippetId: string,
    onChunk: (chunk: string) => void,
    onComplete: () => void,
    onError: (error: Error) => void,
    signal?: AbortSignal
  ): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const eventSource = new EventSource(
        `${API_BASE_URL}/snippets/${snippetId}/generate-summary`
      );

      const abortHandler = () => {
        eventSource.close();
        resolve();
      };

      if (signal) {
        if (signal.aborted) {
          eventSource.close();
          resolve();
          return;
        }
        signal.addEventListener("abort", abortHandler);
      }

      eventSource.onmessage = (event) => {
        if (event.data) {
          onChunk(event.data);
        }
      };

      eventSource.addEventListener("complete", () => {
        eventSource.close();
        if (signal) {
          signal.removeEventListener("abort", abortHandler);
        }
        onComplete();
        resolve();
      });

      eventSource.addEventListener("error", (event: Event) => {
        const messageEvent = event as MessageEvent;
        if (messageEvent.data) {
          eventSource.close();
          if (signal) {
            signal.removeEventListener("abort", abortHandler);
          }
          onError(new Error(messageEvent.data));
          reject(new Error(messageEvent.data));
        }
      });

      // Handle connection errors
      eventSource.onerror = () => {
        eventSource.close();
        if (signal) {
          signal.removeEventListener("abort", abortHandler);
        }
        onError(new Error("Failed to connect to streaming endpoint"));
        reject(new Error("Failed to connect to streaming endpoint"));
      };
    });
  }
}

export const api = new Api();
