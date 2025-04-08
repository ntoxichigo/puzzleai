export enum CellType {
  Empty = "empty",
  Start = "start",
  Exit = "exit",
  Wall = "wall",
  Door = "door",
  Key = "key"
}

export type GridCell = {
  x: number;
  y: number;
  type: CellType;
  visited?: boolean;
  path?: boolean;
  playerPosition?: boolean; // Add player position flag
  animationDelay?: number; // For animation sequencing
  revealed?: boolean; // For fog-of-war: cell is currently visible
  discovered?: boolean; // For fog-of-war: cell has been seen before
};

export type MazeData = {
  id?: number;
  name: string;
  description?: string;
  isPublic: boolean;
  gridSize: number;
  cells: GridCell[];
  userId?: number;
  createdAt?: string;
};

export type MazeListItem = {
  id: number;
  name: string;
  description?: string;
  isPublic: boolean;
  gridSize: number;
  userId?: number;
  createdAt?: string;
};

export enum AlgorithmType {
  AStar = "A* Algorithm",
  Neural = "Neural Pathfinding",
  Random = "Random Walk"
}

export enum GameDifficulty {
  Normal = "Normal",
  Hard = "Hard Mode (Fog-of-War)"
}

export type AlgorithmMetrics = {
  computationTime: number;
  cellsEvaluated: number;
  pathLength: number;
  status: "Running" | "Solution Found" | "No Solution" | "Ready";
};

export type Point = {
  x: number;
  y: number;
};

export type RandomMazeOptions = {
  mazeType: "Labyrinth" | "Puzzle Challenge" | "Open Space" | "Maze with Loops";
  difficulty: number;
  width: number;
  height: number;
  ensureSolvable: boolean;
};
