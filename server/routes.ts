import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { MazeDataSchema, GridCellSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // API endpoints for mazes
  
  // Get all mazes
  app.get("/api/mazes", async (req: Request, res: Response) => {
    try {
      const mazes = await storage.getMazes();
      res.json(mazes);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch mazes" });
    }
  });
  
  // Get a specific maze
  app.get("/api/mazes/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid maze ID" });
      }
      
      const maze = await storage.getMaze(id);
      if (!maze) {
        return res.status(404).json({ message: "Maze not found" });
      }
      
      res.json(maze);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch maze" });
    }
  });
  
  // Create a new maze
  app.post("/api/mazes", async (req: Request, res: Response) => {
    try {
      // Validate request body
      const validationResult = MazeDataSchema.safeParse(req.body);
      if (!validationResult.success) {
        return res.status(400).json({ 
          message: "Invalid maze data",
          errors: validationResult.error.errors 
        });
      }
      
      // If we have an ID, try to update existing maze
      if (req.body.id) {
        const existingMaze = await storage.getMaze(req.body.id);
        if (existingMaze) {
          const updatedMaze = await storage.updateMaze(req.body.id, req.body);
          return res.json(updatedMaze);
        }
      }
      
      // Create a new maze
      const maze = await storage.createMaze(req.body);
      res.status(201).json(maze);
    } catch (error) {
      res.status(500).json({ message: "Failed to create maze" });
    }
  });
  
  // Update a maze
  app.put("/api/mazes/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid maze ID" });
      }
      
      // Check if maze exists
      const existingMaze = await storage.getMaze(id);
      if (!existingMaze) {
        return res.status(404).json({ message: "Maze not found" });
      }
      
      // Validate request body
      const validationResult = MazeDataSchema.safeParse(req.body);
      if (!validationResult.success) {
        return res.status(400).json({ 
          message: "Invalid maze data",
          errors: validationResult.error.errors 
        });
      }
      
      const updatedMaze = await storage.updateMaze(id, req.body);
      res.json(updatedMaze);
    } catch (error) {
      res.status(500).json({ message: "Failed to update maze" });
    }
  });
  
  // Delete a maze
  app.delete("/api/mazes/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid maze ID" });
      }
      
      // Check if maze exists
      const existingMaze = await storage.getMaze(id);
      if (!existingMaze) {
        return res.status(404).json({ message: "Maze not found" });
      }
      
      const success = await storage.deleteMaze(id);
      if (success) {
        res.json({ message: "Maze deleted successfully" });
      } else {
        res.status(500).json({ message: "Failed to delete maze" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to delete maze" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
