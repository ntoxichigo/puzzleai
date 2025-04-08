import { CellType, GridCell, RandomMazeOptions, Point } from "./types";

// Create an empty grid of given dimensions
export const createEmptyGrid = (width: number, height: number): GridCell[][] => {
  const grid: GridCell[][] = [];
  
  for (let y = 0; y < height; y++) {
    const row: GridCell[] = [];
    for (let x = 0; x < width; x++) {
      row.push({
        x,
        y,
        type: CellType.Empty,
      });
    }
    grid.push(row);
  }
  
  return grid;
};

// Recursive backtracking maze generation algorithm
// Check if a maze is solvable using a simplified version of A*
const isMazeSolvable = (grid: GridCell[][], startPoint: Point, endPoint: Point): boolean => {
  const width = grid[0].length;
  const height = grid.length;
  
  // Use a queue for BFS
  const queue: Point[] = [startPoint];
  const visited: Set<string> = new Set([`${startPoint.x},${startPoint.y}`]);
  
  // Directions: right, down, left, up
  const directions = [
    [1, 0],
    [0, 1],
    [-1, 0],
    [0, -1]
  ];
  
  // Helper to check if a point is in bounds
  const isInBounds = (x: number, y: number) => 
    x >= 0 && x < width && y >= 0 && y < height;
  
  while (queue.length > 0) {
    const current = queue.shift()!;
    
    // Check if we reached the end
    if (current.x === endPoint.x && current.y === endPoint.y) {
      return true;
    }
    
    // Check all four directions
    for (const [dx, dy] of directions) {
      const nx = current.x + dx;
      const ny = current.y + dy;
      const key = `${nx},${ny}`;
      
      if (isInBounds(nx, ny) && 
          !visited.has(key) && 
          grid[ny][nx].type !== CellType.Wall) {
        
        // For doors, we'd need to check if we have a key, but for this simplified version,
        // we'll treat doors as passable
        queue.push({ x: nx, y: ny });
        visited.add(key);
      }
    }
  }
  
  // If we've exhausted all possible paths and haven't found the exit
  return false;
};

// Find a valid path between two points in a grid
const findPath = (grid: GridCell[][], start: Point, end: Point): Point[] => {
  const width = grid[0].length;
  const height = grid.length;
  
  // Create a BFS queue with path tracking
  const queue: { point: Point; path: Point[] }[] = [{ point: start, path: [start] }];
  const visited: Set<string> = new Set([`${start.x},${start.y}`]);
  
  // Directions
  const directions = [
    [1, 0],
    [0, 1],
    [-1, 0],
    [0, -1]
  ];
  
  // Helper to check if a point is in bounds
  const isInBounds = (x: number, y: number) => 
    x >= 0 && x < width && y >= 0 && y < height;
  
  while (queue.length > 0) {
    const { point, path } = queue.shift()!;
    
    // Check if we reached the end
    if (point.x === end.x && point.y === end.y) {
      return path;
    }
    
    // Check all four directions
    for (const [dx, dy] of directions) {
      const nx = point.x + dx;
      const ny = point.y + dy;
      const key = `${nx},${ny}`;
      
      if (isInBounds(nx, ny) && 
          !visited.has(key) && 
          grid[ny][nx].type !== CellType.Wall) {
        
        const newPoint = { x: nx, y: ny };
        const newPath = [...path, newPoint];
        queue.push({ point: newPoint, path: newPath });
        visited.add(key);
      }
    }
  }
  
  return [];
};

// Generate different maze levels based on difficulty
export const generateMaze = (options: RandomMazeOptions): GridCell[][] => {
  // Always ensure maze is solvable regardless of user choice
  const { width, height, difficulty, mazeType } = options;
  const ensureSolvable = true; // Force this to be true for better user experience
  
  // Create a grid filled with walls
  const grid = createEmptyGrid(width, height);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      grid[y][x].type = CellType.Wall;
    }
  }
  
  // Helper function to check if cell is in bounds
  const isInBounds = (x: number, y: number) => 
    x >= 0 && x < width && y >= 0 && y < height;
  
  // Generate maze using recursive backtracking
  const carve = (x: number, y: number) => {
    // Mark this cell as empty
    grid[y][x].type = CellType.Empty;
    
    // Directions: [right, down, left, up]
    const directions = [
      [2, 0],
      [0, 2],
      [-2, 0],
      [0, -2]
    ];
    
    // Shuffle directions
    for (let i = directions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [directions[i], directions[j]] = [directions[j], directions[i]];
    }
    
    // Try each direction
    for (const [dx, dy] of directions) {
      const nx = x + dx;
      const ny = y + dy;
      
      if (isInBounds(nx, ny) && grid[ny][nx].type === CellType.Wall) {
        // Carve passage through the wall between cells
        grid[y + dy/2][x + dx/2].type = CellType.Empty;
        carve(nx, ny);
      }
    }
  };
  
  // Start carving from a random position
  const startX = Math.floor(Math.random() * Math.floor(width / 2)) * 2 + 1;
  const startY = Math.floor(Math.random() * Math.floor(height / 2)) * 2 + 1;
  carve(startX, startY);
  
  // Add variation based on maze type
  switch (mazeType) {
    case "Open Space":
      // Add some random open areas
      for (let i = 0; i < width * height * 0.1; i++) {
        const x = Math.floor(Math.random() * width);
        const y = Math.floor(Math.random() * height);
        if (grid[y][x].type === CellType.Wall) {
          grid[y][x].type = CellType.Empty;
        }
      }
      break;
      
    case "Maze with Loops":
      // Add some random connections to create loops
      for (let i = 0; i < width * height * 0.05; i++) {
        const x = Math.floor(Math.random() * (width - 2)) + 1;
        const y = Math.floor(Math.random() * (height - 2)) + 1;
        if (grid[y][x].type === CellType.Wall) {
          grid[y][x].type = CellType.Empty;
        }
      }
      break;
      
    case "Puzzle Challenge":
      // Add some obstacles (doors and keys)
      const keyCount = Math.floor(difficulty * 0.7);
      for (let i = 0; i < keyCount; i++) {
        // Place keys in random empty cells
        let keyPlaced = false;
        while (!keyPlaced) {
          const x = Math.floor(Math.random() * width);
          const y = Math.floor(Math.random() * height);
          if (grid[y][x].type === CellType.Empty) {
            grid[y][x].type = CellType.Key;
            keyPlaced = true;
          }
        }
        
        // Place doors in random empty cells
        let doorPlaced = false;
        while (!doorPlaced) {
          const x = Math.floor(Math.random() * width);
          const y = Math.floor(Math.random() * height);
          if (grid[y][x].type === CellType.Empty) {
            grid[y][x].type = CellType.Door;
            doorPlaced = true;
          }
        }
      }
      break;
  }
  
  // Add start and exit points at opposite corners
  // Find suitable positions
  let startPositionFound = false;
  let endPositionFound = false;
  let startPoint: Point = { x: 0, y: 0 };
  let endPoint: Point = { x: 0, y: 0 };
  
  // Try corners first
  const corners = [
    [1, 1], // top-left
    [width - 2, 1], // top-right
    [1, height - 2], // bottom-left
    [width - 2, height - 2] // bottom-right
  ];
  
  for (const [x, y] of corners) {
    if (isInBounds(x, y) && grid[y][x].type === CellType.Empty && !startPositionFound) {
      grid[y][x].type = CellType.Start;
      startPoint = { x, y };
      startPositionFound = true;
      continue;
    }
    
    if (isInBounds(x, y) && grid[y][x].type === CellType.Empty && !endPositionFound) {
      grid[y][x].type = CellType.Exit;
      endPoint = { x, y };
      endPositionFound = true;
    }
    
    if (startPositionFound && endPositionFound) break;
  }
  
  // If corners don't work, try random positions
  if (!startPositionFound) {
    while (!startPositionFound) {
      const x = Math.floor(Math.random() * width);
      const y = Math.floor(Math.random() * height);
      if (grid[y][x].type === CellType.Empty) {
        grid[y][x].type = CellType.Start;
        startPoint = { x, y };
        startPositionFound = true;
      }
    }
  }
  
  if (!endPositionFound) {
    while (!endPositionFound) {
      const x = Math.floor(Math.random() * width);
      const y = Math.floor(Math.random() * height);
      if (grid[y][x].type === CellType.Empty && 
          (Math.abs(x - startPoint.x) + Math.abs(y - startPoint.y)) > Math.min(width, height) / 2) {
        grid[y][x].type = CellType.Exit;
        endPoint = { x, y };
        endPositionFound = true;
      }
    }
  }
  
  // Adjust difficulty by adding or removing walls
  const difficultyScale = difficulty / 5; // Normalize to 0-1
  const wallsToAdjust = Math.floor(width * height * 0.1 * difficultyScale);
  
  if (difficultyScale > 0.5) {
    // Add more walls for higher difficulty
    for (let i = 0; i < wallsToAdjust; i++) {
      const x = Math.floor(Math.random() * width);
      const y = Math.floor(Math.random() * height);
      if (grid[y][x].type === CellType.Empty) {
        // Temporarily add a wall
        const originalType = grid[y][x].type;
        grid[y][x].type = CellType.Wall;
        
        // Check if the maze is still solvable
        if (ensureSolvable && !isMazeSolvable(grid, startPoint, endPoint)) {
          // If not solvable, revert the wall
          grid[y][x].type = originalType;
        }
      }
    }
  } else {
    // Remove walls for lower difficulty
    for (let i = 0; i < wallsToAdjust; i++) {
      const x = Math.floor(Math.random() * width);
      const y = Math.floor(Math.random() * height);
      if (grid[y][x].type === CellType.Wall) {
        grid[y][x].type = CellType.Empty;
      }
    }
  }
  
  // Final solvability check
  if (ensureSolvable && !isMazeSolvable(grid, startPoint, endPoint)) {
    // Create a clear path from start to end if the maze is not solvable
    const path = findPath({ ...grid }, startPoint, endPoint);
    if (path.length === 0) {
      // If no path is found, create a direct path by clearing walls
      const dx = endPoint.x > startPoint.x ? 1 : -1;
      const dy = endPoint.y > startPoint.y ? 1 : -1;
      
      // Clear horizontal path
      for (let x = startPoint.x; x !== endPoint.x; x += dx) {
        if (grid[startPoint.y][x].type === CellType.Wall) {
          grid[startPoint.y][x].type = CellType.Empty;
        }
      }
      
      // Clear vertical path
      for (let y = startPoint.y; y !== endPoint.y; y += dy) {
        if (grid[y][endPoint.x].type === CellType.Wall) {
          grid[y][endPoint.x].type = CellType.Empty;
        }
      }
    }
  }
  
  return grid;
};

// Convert the grid (2D array) to a flat array of cells
export const flattenGrid = (grid: GridCell[][]): GridCell[] => {
  return grid.flat();
};

// Convert flat array of cells back to 2D grid
export const unflattenGrid = (cells: GridCell[], width: number, height: number): GridCell[][] => {
  const grid: GridCell[][] = [];
  
  for (let y = 0; y < height; y++) {
    const row: GridCell[] = [];
    for (let x = 0; x < width; x++) {
      const cell = cells.find(c => c.x === x && c.y === y);
      if (cell) {
        row.push(cell);
      } else {
        // Fallback if cell is not found (shouldn't happen)
        row.push({ x, y, type: CellType.Empty });
      }
    }
    grid.push(row);
  }
  
  return grid;
};
