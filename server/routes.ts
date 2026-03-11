import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { setupMcpServer } from "./mcp";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Add API routes
  app.get(api.positions.list.path, async (req, res) => {
    try {
      const allPositions = await storage.getPositions();
      res.json(allPositions);
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post(api.positions.create.path, async (req, res) => {
    try {
      const input = api.positions.create.input.parse(req.body);
      const position = await storage.createPosition(input);
      res.status(201).json(position);
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
        return;
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.delete(api.positions.delete.path, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        res.status(400).json({ message: "Invalid ID" });
        return;
      }
      await storage.deletePosition(id);
      res.status(204).end();
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Setup MCP
  setupMcpServer(app);

  return httpServer;
}