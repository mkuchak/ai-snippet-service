import { type Collection, type Db, type MongoClient, ObjectId } from "mongodb";
import type { SnippetDAO } from "../../core/ports/snippet-dao";
import type {
  CreateSnippetData,
  Snippet,
  UpdateSnippetData,
} from "../../core/types/snippet";

interface MongoSnippet {
  _id: ObjectId;
  text: string;
  summary: string;
  createdAt: Date;
  updatedAt: Date;
}

export class MongoDBSnippetDAO implements SnippetDAO {
  private client: MongoClient;
  private db: Db;
  private collection: Collection<MongoSnippet>;

  constructor(client: MongoClient, databaseName: string) {
    this.client = client;
    this.db = client.db(databaseName);
    this.collection = this.db.collection<MongoSnippet>("snippets");
  }

  private toSnippet(mongoSnippet: MongoSnippet): Snippet {
    return {
      id: mongoSnippet._id.toHexString(),
      text: mongoSnippet.text,
      summary: mongoSnippet.summary,
      createdAt: mongoSnippet.createdAt,
      updatedAt: mongoSnippet.updatedAt,
    };
  }

  async create(data: CreateSnippetData): Promise<Snippet> {
    try {
      const now = new Date();
      const mongoSnippet: Omit<MongoSnippet, "_id"> = {
        text: data.text,
        summary: data.summary,
        createdAt: now,
        updatedAt: now,
      };

      const result = await this.collection.insertOne(
        mongoSnippet as MongoSnippet,
      );

      const createdSnippet: MongoSnippet = {
        _id: result.insertedId,
        ...mongoSnippet,
      };

      return this.toSnippet(createdSnippet);
    } catch (error) {
      console.error("MongoDB DAO - Create error:", error);
      throw new Error(
        `Failed to create snippet: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  }

  async findById(id: string): Promise<Snippet | null> {
    try {
      if (!ObjectId.isValid(id)) {
        return null;
      }

      const mongoSnippet = await this.collection.findOne({
        _id: new ObjectId(id),
      });

      if (!mongoSnippet) {
        return null;
      }

      return this.toSnippet(mongoSnippet);
    } catch (error) {
      console.error("MongoDB DAO - FindById error:", error);
      return null;
    }
  }

  async findAll(): Promise<Snippet[]> {
    try {
      const mongoSnippets = await this.collection
        .find({})
        .sort({ createdAt: -1 })
        .toArray();

      return mongoSnippets.map((snippet) => this.toSnippet(snippet));
    } catch (error) {
      console.error("MongoDB DAO - FindAll error:", error);
      throw new Error(
        `Failed to retrieve snippets: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  }

  async update(id: string, data: UpdateSnippetData): Promise<Snippet | null> {
    try {
      if (!ObjectId.isValid(id)) {
        console.warn(`Invalid ObjectId format: ${id}`);
        return null;
      }

      const updateData: Partial<Omit<MongoSnippet, "_id">> = {
        updatedAt: new Date(),
      };

      if (data.text !== undefined) {
        updateData.text = data.text;
      }

      if (data.summary !== undefined) {
        updateData.summary = data.summary;
      }

      const result = await this.collection.findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: updateData },
        { returnDocument: "after" },
      );

      if (!result) {
        return null;
      }

      return this.toSnippet(result);
    } catch (error) {
      console.error("MongoDB DAO - Update error:", error);
      return null;
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      if (!ObjectId.isValid(id)) {
        console.warn(`Invalid ObjectId format: ${id}`);
        return false;
      }

      const result = await this.collection.deleteOne({ _id: new ObjectId(id) });

      return result.deletedCount === 1;
    } catch (error) {
      console.error("MongoDB DAO - Delete error:", error);
      return false;
    }
  }

  async ensureConnection(): Promise<void> {
    try {
      await this.client.db().admin().ping();
    } catch (error) {
      console.error("MongoDB connection error:", error);
      throw new Error("Failed to connect to MongoDB");
    }
  }

  async close(): Promise<void> {
    await this.client.close();
  }
}
