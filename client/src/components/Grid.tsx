import { useRef, useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CellType, GridCell, Point, GameDifficulty } from "@/utils/types";
import { getCellColor } from "@/utils/gridHelpers";
import { 
  Home, 
  Flag, 
  Lock, 
  Key as KeyIcon, 
  X, 
  Circle, 
  User,
  ChevronRight, 
  ArrowRight, 
  Footprints,
  Eye,
  EyeOff
} from "lucide-react";

interface GridProps {
  cells: GridCell[];
  gridSize: number;
  cellSize: number;
  selectedTool: CellType;
  onCellUpdate: (x: number, y: number, type: CellType) => void;
  onMouseDown?: () => void;
  onMouseUp?: () => void;
  mode?: "build" | "play";
  difficulty?: GameDifficulty;
  visibilityRadius?: number;
}

export default function Grid({
  cells,
  gridSize,
  cellSize,
  selectedTool,
  onCellUpdate,
  onMouseDown,
  onMouseUp,
  mode = "build",
  difficulty = GameDifficulty.Normal,
  visibilityRadius = 4,
}: GridProps) {
  const [isDrawing, setIsDrawing] = useState(false);
  const gridRef = useRef<HTMLDivElement>(null);
  const [playerPosition, setPlayerPosition] = useState<Point | null>(null);
  const [collectedKeys, setCollectedKeys] = useState<number>(0);
  const [showPathAnimation, setShowPathAnimation] = useState<boolean>(false);
  const [discoveredCells, setDiscoveredCells] = useState<Set<string>>(new Set());

  // Calculate visible cells based on player position in hard mode
  const getVisibleCellKeys = useMemo(() => {
    if (!playerPosition || mode !== "play" || difficulty !== GameDifficulty.Hard) {
      return new Set<string>();
    }
    
    const visible = new Set<string>();
    
    // Add cells in visibility radius to visible set
    for (let y = 0; y < gridSize; y++) {
      for (let x = 0; x < gridSize; x++) {
        const distance = Math.sqrt(
          Math.pow(x - playerPosition.x, 2) + Math.pow(y - playerPosition.y, 2)
        );
        
        if (distance <= visibilityRadius) {
          visible.add(`${x},${y}`);
        }
      }
    }
    
    return visible;
  }, [playerPosition, gridSize, visibilityRadius, mode, difficulty]);

  // Initialize player position at the start point when mode changes to "play"
  useEffect(() => {
    if (mode === "play") {
      const startCell = cells.find(cell => cell.type === CellType.Start);
      if (startCell) {
        setPlayerPosition({ x: startCell.x, y: startCell.y });
        
        // Reset discovered cells when starting a new game
        if (difficulty === GameDifficulty.Hard) {
          setDiscoveredCells(new Set([`${startCell.x},${startCell.y}`]));
        }
      }
    } else {
      setPlayerPosition(null);
      setCollectedKeys(0);
      setDiscoveredCells(new Set());
    }
  }, [mode, cells, difficulty]);

  const handleMouseDown = (x: number, y: number) => {
    if (mode === "build") {
      setIsDrawing(true);
      onCellUpdate(x, y, selectedTool);
      if (onMouseDown) onMouseDown();
    } else if (mode === "play" && playerPosition) {
      // Handle player movement in play mode
      handlePlayerMove(x, y);
    }
  };

  const handlePlayerMove = (x: number, y: number) => {
    if (!playerPosition) return;
    
    // Check if the move is valid (adjacent and not a wall)
    const isAdjacent = (
      (Math.abs(x - playerPosition.x) === 1 && y === playerPosition.y) ||
      (Math.abs(y - playerPosition.y) === 1 && x === playerPosition.x)
    );
    
    if (!isAdjacent) return;
    
    // Get the cell at the new position
    const targetCell = cells.find(c => c.x === x && c.y === y);
    if (!targetCell) return;
    
    // Can't move through walls
    if (targetCell.type === CellType.Wall) return;
    
    // Collect keys
    if (targetCell.type === CellType.Key) {
      setCollectedKeys(prevKeys => prevKeys + 1);
    }
    
    // Can't pass through doors without a key
    if (targetCell.type === CellType.Door && collectedKeys === 0) return;
    
    // Move the player
    setPlayerPosition({ x, y });
    
    // For fog-of-war: update discovered cells manually
    if (difficulty === GameDifficulty.Hard) {
      // Calculate newly visible cells based on the new position
      const newVisibleCells = new Set<string>();
      for (let cy = 0; cy < gridSize; cy++) {
        for (let cx = 0; cx < gridSize; cx++) {
          const distance = Math.sqrt(Math.pow(cx - x, 2) + Math.pow(cy - y, 2));
          if (distance <= visibilityRadius) {
            newVisibleCells.add(`${cx},${cy}`);
          }
        }
      }
      
      // Update discovered cells
      setDiscoveredCells(prevDiscovered => {
        const newDiscovered = new Set(prevDiscovered);
        newVisibleCells.forEach(key => newDiscovered.add(key));
        return newDiscovered;
      });
    }
    
    // Check if player reached the exit
    if (targetCell.type === CellType.Exit) {
      // Player wins!
      setTimeout(() => {
        alert("Congratulations! You've escaped the maze!");
        setPlayerPosition(null);
        setCollectedKeys(0);
      }, 500);
    }
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
    if (onMouseUp) onMouseUp();
  };

  const handleMouseEnter = (x: number, y: number) => {
    if (mode === "build" && isDrawing) {
      onCellUpdate(x, y, selectedTool);
    }
  };

  // Add event listener for keyboard control in play mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (mode !== "play" || !playerPosition) return;
      
      let newX = playerPosition.x;
      let newY = playerPosition.y;
      
      switch (e.key) {
        case "ArrowUp":
        case "w":
          newY -= 1;
          break;
        case "ArrowDown":
        case "s":
          newY += 1;
          break;
        case "ArrowLeft":
        case "a":
          newX -= 1;
          break;
        case "ArrowRight":
        case "d":
          newX += 1;
          break;
      }
      
      // Check if the new position is valid
      if (newX >= 0 && newX < gridSize && newY >= 0 && newY < gridSize) {
        handlePlayerMove(newX, newY);
      }
    };
    
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [mode, playerPosition, gridSize, cells, collectedKeys]);

  // Add event listener for mouse up on window
  useEffect(() => {
    const handleGlobalMouseUp = () => {
      setIsDrawing(false);
      if (onMouseUp) onMouseUp();
    };

    window.addEventListener("mouseup", handleGlobalMouseUp);
    return () => {
      window.removeEventListener("mouseup", handleGlobalMouseUp);
    };
  }, [onMouseUp]);

  const renderCellContent = (cell: GridCell) => {
    // Show player if this is the player position
    if (playerPosition && cell.x === playerPosition.x && cell.y === playerPosition.y) {
      return (
        <motion.div
          initial={{ scale: 0.5 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", bounce: 0.5 }}
          className="player-token"
        >
          <User className="h-5 w-5 text-white drop-shadow-lg" />
        </motion.div>
      );
    }
    
    // Otherwise, show cell content based on type
    switch (cell.type) {
      case CellType.Start:
        return (
          <motion.div
            initial={{ y: -5, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Home className="h-5 w-5 text-green-800" />
          </motion.div>
        );
      
      case CellType.Exit:
        return (
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ repeat: Infinity, repeatType: "reverse", duration: 1.5 }}
          >
            <Flag className="h-5 w-5 text-red-600" />
          </motion.div>
        );
      
      case CellType.Door:
        return (
          <motion.div
            whileHover={{ rotate: [0, -5, 5, -5, 5, 0] }}
            className="door-icon"
          >
            <Lock className="h-5 w-5 text-yellow-200 drop-shadow-md" />
          </motion.div>
        );
      
      case CellType.Key:
        return (
          <motion.div
            animate={{ rotate: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="key-icon"
          >
            <KeyIcon className="h-5 w-5 text-yellow-400 drop-shadow-md" />
          </motion.div>
        );
      
      case CellType.Wall:
        // No icon for walls, they're styled with background color
        return null;
      
      default:
        return null;
    }
  };

  // For path animation when algorithm runs
  const animatePath = (cell: GridCell) => {
    if (cell.path && showPathAnimation) {
      // During algorithm animation, always show paths (ignoring fog of war)
      return (
        <motion.div
          className="absolute inset-0 flex items-center justify-center overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ 
            delay: cell.animationDelay || 0, 
            duration: 0.5 
          }}
        >
          <Footprints className="h-4 w-4 text-blue-600 drop-shadow" />
        </motion.div>
      );
    }
    
    if (cell.visited && !cell.path) {
      // During algorithm testing, always show visited cells (ignoring fog of war)
      return (
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 0.4, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Circle className="h-2 w-2 text-blue-400/40" />
        </motion.div>
      );
    }
    
    return null;
  };

  // Group cells by row for efficient rendering
  const rows: GridCell[][] = [];
  for (let y = 0; y < gridSize; y++) {
    const row: GridCell[] = [];
    for (let x = 0; x < gridSize; x++) {
      const cell = cells.find((c) => c.x === x && c.y === y);
      if (cell) {
        row.push(cell);
      }
    }
    rows.push(row);
  }

  // Toggle path animation when cells change and paths are generated
  useEffect(() => {
    const hasPath = cells.some(cell => cell.path);
    if (hasPath) {
      setShowPathAnimation(true);
    }
  }, [cells]);

  return (
    <div className="overflow-auto grid-container relative" ref={gridRef}>
      {mode === "play" && (
        <div className="absolute top-2 right-2 bg-slate-800/80 text-white px-3 py-1 rounded-md z-10 flex items-center gap-2">
          <KeyIcon className="h-4 w-4 text-yellow-400" />
          <span className="font-mono">{collectedKeys}</span>
        </div>
      )}
      
      <div className="grid-inner">
        {rows.map((row, rowIndex) => (
          <div key={`row-${rowIndex}`} className="grid-row flex">
            {row.map((cell) => {
              // Check visibility for Hard Mode with fog-of-war
              const cellKey = `${cell.x},${cell.y}`;
              const isCurrentlyVisible = getVisibleCellKeys.has(cellKey);
              const wasDiscovered = discoveredCells.has(cellKey);
              
              // In Hard Mode, determine if the cell should be visible at all
              const isHidden = mode === "play" && 
                              difficulty === GameDifficulty.Hard && 
                              !isCurrentlyVisible && 
                              !wasDiscovered;
                              
              const isDimmed = mode === "play" && 
                              difficulty === GameDifficulty.Hard && 
                              !isCurrentlyVisible && 
                              wasDiscovered;
              
              return (
                <motion.div
                  key={`cell-${cell.x}-${cell.y}`}
                  className={`grid-cell relative border border-gray-200 cursor-pointer flex items-center justify-center 
                    ${getCellColor(cell)} 
                    ${cell.path ? "cell-path" : ""} 
                    ${mode === "play" && playerPosition && 
                      Math.abs(cell.x - playerPosition.x) + Math.abs(cell.y - playerPosition.y) === 1 &&
                      cell.type !== CellType.Wall ? "possible-move" : ""}
                    ${isHidden ? "fog-hidden" : ""}
                    ${isDimmed ? "fog-dim" : ""}
                  `}
                  style={{
                    width: `${cellSize}px`,
                    height: `${cellSize}px`,
                  }}
                  initial={{ opacity: 0.8 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                  onMouseDown={() => handleMouseDown(cell.x, cell.y)}
                  onMouseEnter={() => handleMouseEnter(cell.x, cell.y)}
                  whileHover={mode === "play" && !isHidden ? { scale: 1.05 } : {}}
                >
                  {/* Path visualization - always shown during algorithm runs */}
                  {((!isHidden) || (cell.path || cell.visited)) && animatePath(cell)}
                  
                  {/* Cell content (icons) */}
                  {(!isHidden) && renderCellContent(cell)}
                  
                  {/* Fog of war overlay */}
                  {isHidden && (
                    <div className="absolute inset-0 bg-slate-900 flex items-center justify-center">
                      <EyeOff className="h-3 w-3 text-slate-700" />
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
