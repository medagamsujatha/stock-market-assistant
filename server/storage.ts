import { db } from "./db";
import {
  positions,
  type Position,
  type InsertPosition,
} from "@shared/schema";
import { eq } from "drizzle-orm";

export interface IStorage {
  getPositions(): Promise<Position[]>;
  getPosition(id: number): Promise<Position | undefined>;
  createPosition(position: InsertPosition): Promise<Position>;
  deletePosition(id: number): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getPositions(): Promise<Position[]> {
    return await db.select().from(positions);
  }

  async getPosition(id: number): Promise<Position | undefined> {
    const [position] = await db.select().from(positions).where(eq(positions.id, id));
    return position;
  }

  async createPosition(insertPosition: InsertPosition): Promise<Position> {
    const [position] = await db.insert(positions).values(insertPosition).returning();
    return position;
  }

  async deletePosition(id: number): Promise<void> {
    await db.delete(positions).where(eq(positions.id, id));
  }
}

export const storage = new DatabaseStorage();