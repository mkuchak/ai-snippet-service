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
}

export const api = new Api();
