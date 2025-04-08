import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User model
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Maze model
export const mazes = pgTable("mazes", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  isPublic: boolean("is_public").notNull().default(false),
  gridSize: integer("grid_size").notNull(),
  cells: text("cells").notNull(), // JSON string of maze cells
  userId: integer("user_id").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertMazeSchema = createInsertSchema(mazes).pick({
  name: true,
  description: true,
  isPublic: true,
  gridSize: true,
  cells: true,
  userId: true,
});

export type InsertMaze = z.infer<typeof insertMazeSchema>;
export type Maze = typeof mazes.$inferSelect;

// Cell Type Enum
export const CellTypeEnum = z.enum([
  "empty",
  "start",
  "exit",
  "wall",
  "door",
  "key"
]);

export type CellType = z.infer<typeof CellTypeEnum>;

// GridCell Schema
export const GridCellSchema = z.object({
  x: z.number(),
  y: z.number(),
  type: CellTypeEnum,
  visited: z.boolean().optional(),
  path: z.boolean().optional(),
});

export type GridCell = z.infer<typeof GridCellSchema>;

// Maze Data Schema (for API)
export const MazeDataSchema = z.object({
  id: z.number().optional(),
  name: z.string(),
  description: z.string().optional(),
  isPublic: z.boolean(),
  gridSize: z.number(),
  cells: z.array(GridCellSchema),
  userId: z.number().optional(),
  createdAt: z.string().optional(),
});

export type MazeData = z.infer<typeof MazeDataSchema>;
