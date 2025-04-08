import {
  User,
  InsertUser,
  GridCell,
  MazeData,
  InsertMaze,
  Maze,
  users,
  mazes
} from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

// Modify the interface with any CRUD methods needed
export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Maze methods
  getMaze(id: number): Promise<MazeData | undefined>;
  getMazes(): Promise<MazeData[]>;
  getUserMazes(userId: number): Promise<MazeData[]>;
  createMaze(maze: MazeData): Promise<MazeData>;
  updateMaze(id: number, maze: MazeData): Promise<MazeData>;
  deleteMaze(id: number): Promise<boolean>;
}

// Database Storage Implementation
export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    try {
      const [user] = await db.select().from(users).where(eq(users.id, id));
      return user;
    } catch (error) {
      console.error('Error fetching user:', error);
      return undefined;
    }
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    try {
      const [user] = await db.select().from(users).where(eq(users.username, username));
      return user;
    } catch (error) {
      console.error('Error fetching user by username:', error);
      return undefined;
    }
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }
  
  async getMaze(id: number): Promise<MazeData | undefined> {
    try {
      const [maze] = await db.select().from(mazes).where(eq(mazes.id, id));
      
      if (!maze) return undefined;
      
      // Parse cells from JSON string
      const cells = JSON.parse(maze.cells) as GridCell[];
      
      return {
        id: maze.id,
        name: maze.name,
        description: maze.description || undefined,
        isPublic: maze.isPublic,
        gridSize: maze.gridSize,
        cells: cells,
        userId: maze.userId || undefined,
        createdAt: maze.createdAt ? maze.createdAt.toISOString() : undefined
      };
    } catch (error) {
      console.error('Error fetching maze:', error);
      return undefined;
    }
  }
  
  async getMazes(): Promise<MazeData[]> {
    try {
      const mazeRows = await db.select().from(mazes);
      
      return mazeRows.map(maze => ({
        id: maze.id,
        name: maze.name,
        description: maze.description || undefined,
        isPublic: maze.isPublic,
        gridSize: maze.gridSize,
        cells: JSON.parse(maze.cells) as GridCell[],
        userId: maze.userId || undefined,
        createdAt: maze.createdAt ? maze.createdAt.toISOString() : undefined
      }));
    } catch (error) {
      console.error('Error fetching mazes:', error);
      return [];
    }
  }
  
  async getUserMazes(userId: number): Promise<MazeData[]> {
    try {
      const userMazes = await db.select().from(mazes).where(eq(mazes.userId, userId));
      
      return userMazes.map(maze => ({
        id: maze.id,
        name: maze.name,
        description: maze.description || undefined,
        isPublic: maze.isPublic,
        gridSize: maze.gridSize,
        cells: JSON.parse(maze.cells) as GridCell[],
        userId: maze.userId || undefined,
        createdAt: maze.createdAt ? maze.createdAt.toISOString() : undefined
      }));
    } catch (error) {
      console.error('Error fetching user mazes:', error);
      return [];
    }
  }
  
  async createMaze(maze: MazeData): Promise<MazeData> {
    try {
      // Convert cells to JSON string
      const cellsJson = JSON.stringify(maze.cells);
      
      const [insertedMaze] = await db.insert(mazes).values({
        name: maze.name,
        description: maze.description || null,
        isPublic: maze.isPublic,
        gridSize: maze.gridSize,
        cells: cellsJson,
        userId: maze.userId || null
      }).returning();
      
      return {
        id: insertedMaze.id,
        name: insertedMaze.name,
        description: insertedMaze.description || undefined,
        isPublic: insertedMaze.isPublic,
        gridSize: insertedMaze.gridSize,
        cells: maze.cells, // Use the original cells array
        userId: insertedMaze.userId || undefined,
        createdAt: insertedMaze.createdAt ? insertedMaze.createdAt.toISOString() : undefined
      };
    } catch (error) {
      console.error('Error creating maze:', error);
      throw error;
    }
  }
  
  async updateMaze(id: number, maze: MazeData): Promise<MazeData> {
    try {
      // Convert cells to JSON string
      const cellsJson = JSON.stringify(maze.cells);
      
      const [updatedMaze] = await db.update(mazes)
        .set({
          name: maze.name,
          description: maze.description || null,
          isPublic: maze.isPublic,
          gridSize: maze.gridSize,
          cells: cellsJson,
          userId: maze.userId || null
        })
        .where(eq(mazes.id, id))
        .returning();
      
      if (!updatedMaze) {
        throw new Error(`Maze with id ${id} not found`);
      }
      
      return {
        id: updatedMaze.id,
        name: updatedMaze.name,
        description: updatedMaze.description || undefined,
        isPublic: updatedMaze.isPublic,
        gridSize: updatedMaze.gridSize,
        cells: maze.cells, // Use the original cells array
        userId: updatedMaze.userId || undefined,
        createdAt: updatedMaze.createdAt ? updatedMaze.createdAt.toISOString() : undefined
      };
    } catch (error) {
      console.error('Error updating maze:', error);
      throw error;
    }
  }
  
  async deleteMaze(id: number): Promise<boolean> {
    try {
      const result = await db.delete(mazes).where(eq(mazes.id, id)).returning();
      return result.length > 0;
    } catch (error) {
      console.error('Error deleting maze:', error);
      return false;
    }
  }
  
  // Helper method to add sample mazes
  async addSampleMazes() {
    // Check if any mazes exist
    const existingMazes = await this.getMazes();
    if (existingMazes.length > 0) {
      return; // Don't add samples if mazes already exist
    }
    
    // Create a simple maze
    const simpleMaze: MazeData = {
      name: "Simple Labyrinth",
      description: "A basic maze with a straightforward path",
      isPublic: true,
      gridSize: 10,
      cells: this.generateSampleMazeCells(10)
    };
    
    await this.createMaze(simpleMaze);
    
    // Create a complex maze
    const complexMaze: MazeData = {
      name: "Complex Challenge",
      description: "A difficult maze with many twists and turns",
      isPublic: true,
      gridSize: 15,
      cells: this.generateSampleMazeCells(15)
    };
    
    await this.createMaze(complexMaze);
  }
  
  // Generate sample maze cells
  private generateSampleMazeCells(size: number): GridCell[] {
    const cells: GridCell[] = [];
    
    // Create empty grid
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        cells.push({
          x,
          y,
          type: "empty"
        });
      }
    }
    
    // Add walls (border)
    for (let i = 0; i < size; i++) {
      // Top and bottom walls
      cells[i].type = "wall";
      cells[(size - 1) * size + i].type = "wall";
      
      // Left and right walls
      cells[i * size].type = "wall";
      cells[i * size + (size - 1)].type = "wall";
    }
    
    // Add some random walls
    for (let i = 0; i < size * size / 4; i++) {
      const x = Math.floor(Math.random() * (size - 2)) + 1;
      const y = Math.floor(Math.random() * (size - 2)) + 1;
      const index = y * size + x;
      cells[index].type = "wall";
    }
    
    // Add start point
    cells[size + 1].type = "start";
    
    // Add exit point
    cells[(size - 2) * size + (size - 2)].type = "exit";
    
    return cells;
  }
}

// Create and export the storage instance
export const storage = new DatabaseStorage();
