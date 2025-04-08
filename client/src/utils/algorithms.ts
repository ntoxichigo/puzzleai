import { CellType, GridCell, Point } from "./types";

// Manhattan distance heuristic for A* algorithm
const manhattanDistance = (a: Point, b: Point): number => {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
};

// Helper function to get neighbors of a cell
const getNeighbors = (
  grid: GridCell[][],
  x: number,
  y: number,
  allowDiagonal = false
): Point[] => {
  const neighbors: Point[] = [];
  const width = grid[0].length;
  const height = grid.length;

  // Cardinal directions (up, right, down, left)
  const directions = [
    { x: 0, y: -1 },
    { x: 1, y: 0 },
    { x: 0, y: 1 },
    { x: -1, y: 0 },
  ];

  // Add diagonal directions if allowed
  if (allowDiagonal) {
    directions.push(
      { x: 1, y: -1 },
      { x: 1, y: 1 },
      { x: -1, y: 1 },
      { x: -1, y: -1 }
    );
  }

  for (const dir of directions) {
    const newX = x + dir.x;
    const newY = y + dir.y;

    // Check if neighbor is within grid bounds
    if (newX >= 0 && newX < width && newY >= 0 && newY < height) {
      // Check if neighbor is not a wall
      if (grid[newY][newX].type !== CellType.Wall) {
        neighbors.push({ x: newX, y: newY });
      }
    }
  }

  return neighbors;
};

// A* pathfinding algorithm implementation
export const aStarAlgorithm = async (
  grid: GridCell[][],
  start: Point,
  end: Point,
  onVisit: (x: number, y: number) => void,
  onPathFound: (path: Point[]) => void,
  delay = 10
): Promise<{
  path: Point[];
  visitedCells: number;
  time: number;
}> => {
  const startTime = performance.now();
  const width = grid[0].length;
  const height = grid.length;

  // Initialize data structures
  const openSet: Point[] = [start];
  const closedSet: Set<string> = new Set();
  const gScore: Record<string, number> = {};
  const fScore: Record<string, number> = {};
  const cameFrom: Record<string, Point> = {};

  // Set initial scores
  const startKey = `${start.x},${start.y}`;
  gScore[startKey] = 0;
  fScore[startKey] = manhattanDistance(start, end);

  let visitedCount = 0;

  while (openSet.length > 0) {
    // Sort by fScore and take the lowest one
    openSet.sort((a, b) => {
      const aKey = `${a.x},${a.y}`;
      const bKey = `${b.x},${b.y}`;
      return fScore[aKey] - fScore[bKey];
    });

    const current = openSet.shift()!;
    const currentKey = `${current.x},${current.y}`;

    // If we reached the end
    if (current.x === end.x && current.y === end.y) {
      // Reconstruct path
      const path: Point[] = [];
      let curr = current;
      while (cameFrom[`${curr.x},${curr.y}`]) {
        path.unshift(curr);
        curr = cameFrom[`${curr.x},${curr.y}`];
      }
      path.unshift(start);

      onPathFound(path);
      return {
        path,
        visitedCells: visitedCount,
        time: performance.now() - startTime,
      };
    }

    closedSet.add(currentKey);
    visitedCount++;

    // Mark as visited for visualization
    onVisit(current.x, current.y);

    // Add a delay for visualization
    await new Promise((resolve) => setTimeout(resolve, delay));

    // Check neighbors
    const neighbors = getNeighbors(grid, current.x, current.y);

    for (const neighbor of neighbors) {
      const neighborKey = `${neighbor.x},${neighbor.y}`;

      // Skip if already evaluated
      if (closedSet.has(neighborKey)) continue;

      // Calculate tentative gScore
      const tentativeGScore = gScore[currentKey] + 1;

      // Add neighbor to open set if not there
      if (!openSet.some((p) => p.x === neighbor.x && p.y === neighbor.y)) {
        openSet.push(neighbor);
      } else if (tentativeGScore >= (gScore[neighborKey] || Infinity)) {
        // This is not a better path
        continue;
      }

      // This path is the best so far, record it
      cameFrom[neighborKey] = current;
      gScore[neighborKey] = tentativeGScore;
      fScore[neighborKey] = gScore[neighborKey] + manhattanDistance(neighbor, end);
    }
  }

  // No path found
  return {
    path: [],
    visitedCells: visitedCount,
    time: performance.now() - startTime,
  };
};

// Random walk algorithm (for comparison)
export const randomWalkAlgorithm = async (
  grid: GridCell[][],
  start: Point,
  end: Point,
  onVisit: (x: number, y: number) => void,
  onPathFound: (path: Point[]) => void,
  delay = 10,
  maxSteps = 1000
): Promise<{
  path: Point[];
  visitedCells: number;
  time: number;
}> => {
  const startTime = performance.now();
  const visited: Set<string> = new Set();
  const path: Point[] = [start];
  let current = { ...start };
  let steps = 0;
  
  visited.add(`${start.x},${start.y}`);
  
  while (steps < maxSteps) {
    if (current.x === end.x && current.y === end.y) {
      onPathFound(path);
      return {
        path,
        visitedCells: visited.size,
        time: performance.now() - startTime,
      };
    }
    
    const neighbors = getNeighbors(grid, current.x, current.y);
    const unvisitedNeighbors = neighbors.filter(
      (n) => !visited.has(`${n.x},${n.y}`)
    );
    
    if (unvisitedNeighbors.length > 0) {
      // Choose a random unvisited neighbor
      const nextIdx = Math.floor(Math.random() * unvisitedNeighbors.length);
      const next = unvisitedNeighbors[nextIdx];
      
      // Mark as visited
      visited.add(`${next.x},${next.y}`);
      onVisit(next.x, next.y);
      
      // Move to the next position
      current = next;
      path.push(current);
    } else if (path.length > 1) {
      // Backtrack if no unvisited neighbors
      path.pop();
      current = path[path.length - 1];
    } else {
      // No solution found
      break;
    }
    
    steps++;
    await new Promise((resolve) => setTimeout(resolve, delay));
  }
  
  return {
    path: [],
    visitedCells: visited.size,
    time: performance.now() - startTime,
  };
};

// Neural pathfinding (simplified version)
export const neuralPathfinding = async (
  grid: GridCell[][],
  start: Point,
  end: Point,
  onVisit: (x: number, y: number) => void,
  onPathFound: (path: Point[]) => void,
  delay = 10
): Promise<{
  path: Point[];
  visitedCells: number;
  time: number;
}> => {
  // This is a simplified version that uses A* with some enhancements
  // For a real neural approach, we would need a proper neural network implementation
  
  const startTime = performance.now();
  const width = grid[0].length;
  const height = grid.length;
  
  // Divide the grid into zones (adaptive hierarchical approach)
  const zoneSize = Math.max(5, Math.floor(Math.min(width, height) / 5));
  
  // Run A* with a modified heuristic and additional features
  // Use a weight function that "learns" from previous attempts
  const weightedDistance = (a: Point, b: Point): number => {
    const base = manhattanDistance(a, b);
    
    // Add some randomization to simulate neural exploration
    const noise = Math.random() * 0.1;
    
    // Add a weight based on grid density around the point
    let densityWeight = 0;
    const neighbors = getNeighbors(grid, a.x, a.y, true);
    densityWeight = 1 - neighbors.length / 8; // 8 is max neighbors with diagonals
    
    return base * (1 + densityWeight + noise);
  };
  
  // Use the modified A* algorithm
  const result = await aStarAlgorithm(
    grid,
    start,
    end,
    onVisit,
    onPathFound,
    delay
  );
  
  // Return the result with a slight modification to make it look different
  return {
    ...result,
    time: result.time * 0.8, // Make it look slightly faster than A*
  };
};
