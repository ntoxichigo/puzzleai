import { CellType, GridCell, Point } from "./types";

// Create an empty grid of given size
export const createEmptyGrid = (size: number): GridCell[] => {
  const cells: GridCell[] = [];
  
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      cells.push({
        x,
        y,
        type: CellType.Empty
      });
    }
  }
  
  return cells;
};

// Get cell at specific coordinates
export const getCellAt = (grid: GridCell[], x: number, y: number, size: number): GridCell | undefined => {
  return grid.find(cell => cell.x === x && cell.y === y);
};

// Update a cell in the grid
export const updateCell = (grid: GridCell[], x: number, y: number, type: CellType): GridCell[] => {
  return grid.map(cell => {
    if (cell.x === x && cell.y === y) {
      return { ...cell, type };
    }
    return cell;
  });
};

// Find cells of a specific type in the grid
export const findCellsByType = (grid: GridCell[], type: CellType): GridCell[] => {
  return grid.filter(cell => cell.type === type);
};

// Convert grid to 2D array format for algorithms
export const gridTo2DArray = (grid: GridCell[], size: number): GridCell[][] => {
  const array: GridCell[][] = [];
  
  for (let y = 0; y < size; y++) {
    const row: GridCell[] = [];
    for (let x = 0; x < size; x++) {
      const cell = grid.find(c => c.x === x && c.y === y);
      if (cell) {
        row.push(cell);
      } else {
        // Fallback if cell is not found (shouldn't happen)
        row.push({ x, y, type: CellType.Empty });
      }
    }
    array.push(row);
  }
  
  return array;
};

// Reset visited and path properties in the grid
export const resetGridPathState = (grid: GridCell[]): GridCell[] => {
  return grid.map(cell => ({
    ...cell,
    visited: false,
    path: false
  }));
};

// Find start and end points in the grid
export const findStartAndEnd = (grid: GridCell[]): { start?: Point; end?: Point } => {
  let start: Point | undefined;
  let end: Point | undefined;
  
  for (const cell of grid) {
    if (cell.type === CellType.Start) {
      start = { x: cell.x, y: cell.y };
    } else if (cell.type === CellType.Exit) {
      end = { x: cell.x, y: cell.y };
    }
    
    if (start && end) break;
  }
  
  return { start, end };
};

// Mark cells as visited
export const markCellVisited = (grid: GridCell[], x: number, y: number): GridCell[] => {
  return grid.map(cell => {
    if (cell.x === x && cell.y === y) {
      return { ...cell, visited: true };
    }
    return cell;
  });
};

// Mark cells as part of path
export const markCellPath = (grid: GridCell[], path: Point[]): GridCell[] => {
  return grid.map(cell => {
    const isInPath = path.some(p => p.x === cell.x && p.y === cell.y);
    return {
      ...cell,
      path: isInPath || cell.path
    };
  });
};

// Clear grid of all obstacles
export const clearGrid = (grid: GridCell[]): GridCell[] => {
  return grid.map(cell => ({
    ...cell,
    type: CellType.Empty,
    visited: false,
    path: false
  }));
};

// Generate a cell color based on its type and state
export const getCellColor = (cell: GridCell): string => {
  if (cell.path) return "bg-blue-500";
  if (cell.visited) return "bg-blue-200";
  
  switch (cell.type) {
    case CellType.Start:
      return "bg-green-500";
    case CellType.Exit:
      return "bg-red-500";
    case CellType.Wall:
      return "bg-gray-800";
    case CellType.Door:
      return "bg-orange-500";
    case CellType.Key:
      return "bg-yellow-300";
    default:
      return "";
  }
};
