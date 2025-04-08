import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";

import Layout from "@/components/Layout";
import ToolsSidebar from "@/components/ToolsSidebar";
import WorkspaceArea from "@/components/WorkspaceArea";
import AlgorithmPanel from "@/components/AlgorithmPanel";
import SaveMazeModal from "@/components/modals/SaveMazeModal";
import RandomMazeModal from "@/components/modals/RandomMazeModal";

import {
  AlgorithmMetrics,
  AlgorithmType,
  CellType,
  GridCell,
  MazeData,
  Point,
  RandomMazeOptions,
} from "@/utils/types";
import {
  createEmptyGrid,
  updateCell,
  resetGridPathState,
  findStartAndEnd,
  markCellVisited,
  markCellPath,
  clearGrid,
} from "@/utils/gridHelpers";
import { gridTo2DArray } from "@/utils/gridHelpers";
import { aStarAlgorithm, randomWalkAlgorithm, neuralPathfinding } from "@/utils/algorithms";
import { flattenGrid, generateMaze, unflattenGrid } from "@/utils/mazeGenerator";

export default function MazeBuilder() {
  const { toast } = useToast();

  // Grid state
  const [gridSize, setGridSize] = useState(20);
  const [cellSize, setCellSize] = useState(25);
  const [cells, setCells] = useState<GridCell[]>([]);
  const [selectedTool, setSelectedTool] = useState<CellType>(CellType.Start);
  const [mode, setMode] = useState<"build" | "play">("build");
  const [mazeName, setMazeName] = useState("Untitled Maze");

  // History for undo/redo
  const [history, setHistory] = useState<GridCell[][]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // Algorithm state
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<AlgorithmType>(AlgorithmType.AStar);
  const [metrics, setMetrics] = useState<AlgorithmMetrics>({
    computationTime: 0,
    cellsEvaluated: 0,
    pathLength: 0,
    status: "Ready",
  });
  const [isRunningAlgorithm, setIsRunningAlgorithm] = useState(false);

  // Modal state
  const [saveModalOpen, setSaveModalOpen] = useState(false);
  const [randomMazeModalOpen, setRandomMazeModalOpen] = useState(false);

  // Load existing maze if provided in URL
  const [mazeId, setMazeId] = useState<number | null>(null);

  // Initialize grid on load
  useEffect(() => {
    initializeGrid();
  }, [gridSize]);

  // Load maze if ID exists
  const { data: mazeData } = useQuery({
    queryKey: mazeId ? [`/api/mazes/${mazeId}`] : [],
    enabled: !!mazeId,
  });

  // Load maze data if available
  useEffect(() => {
    if (mazeData) {
      setMazeName(mazeData.name);
      setGridSize(mazeData.gridSize);
      setCells(mazeData.cells);
      // Add to history
      addToHistory(mazeData.cells);
    }
  }, [mazeData]);

  // Initialize an empty grid
  const initializeGrid = () => {
    const newCells = createEmptyGrid(gridSize);
    setCells(newCells);
    // Reset history
    setHistory([newCells]);
    setHistoryIndex(0);
  };

  // Update a cell based on the selected tool
  const handleCellUpdate = (x: number, y: number, type: CellType) => {
    // Check if in build mode
    if (mode !== "build") return;

    // If placing start or exit, first remove any existing ones
    let updatedCells = [...cells];

    if (type === CellType.Start) {
      updatedCells = updatedCells.map((cell) => {
        if (cell.type === CellType.Start) {
          return { ...cell, type: CellType.Empty };
        }
        return cell;
      });
    } else if (type === CellType.Exit) {
      updatedCells = updatedCells.map((cell) => {
        if (cell.type === CellType.Exit) {
          return { ...cell, type: CellType.Empty };
        }
        return cell;
      });
    }

    // Now update the selected cell
    updatedCells = updateCell(updatedCells, x, y, type);
    setCells(updatedCells);
    
    // Add to history
    addToHistory(updatedCells);
  };

  // Add current state to history
  const addToHistory = (newCells: GridCell[]) => {
    // If we're not at the end of the history, truncate it
    if (historyIndex !== history.length - 1) {
      setHistory(history.slice(0, historyIndex + 1));
    }
    
    // Add new state to history
    setHistory([...history, newCells]);
    setHistoryIndex(historyIndex + 1);
  };

  // Handle undo/redo
  const handleUndo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setCells(history[historyIndex - 1]);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setCells(history[historyIndex + 1]);
    }
  };

  // Handle clear grid
  const handleClearGrid = () => {
    const newCells = clearGrid(cells);
    setCells(newCells);
    addToHistory(newCells);
    toast({
      title: "Grid Cleared",
      description: "The grid has been reset to an empty state.",
    });
  };

  // Handle zoom in/out
  const handleZoomIn = () => {
    if (cellSize < 40) {
      setCellSize(cellSize + 5);
    }
  };

  const handleZoomOut = () => {
    if (cellSize > 10) {
      setCellSize(cellSize - 5);
    }
  };

  // Save maze mutation
  const saveMazeMutation = useMutation({
    mutationFn: async (maze: MazeData) => {
      const response = await apiRequest("POST", "/api/mazes", maze);
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/mazes"] });
      toast({
        title: "Maze Saved",
        description: "Your maze has been saved successfully.",
      });
      setMazeId(data.id);
    },
    onError: (error) => {
      toast({
        title: "Error Saving Maze",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Handle save maze
  const handleSaveMaze = () => {
    // Check if there's a start and exit point
    const { start, end } = findStartAndEnd(cells);
    
    if (!start || !end) {
      toast({
        title: "Missing Start or Exit",
        description: "Please add both a start and exit point to your maze.",
        variant: "destructive",
      });
      return;
    }
    
    setSaveModalOpen(true);
  };

  const handleSaveConfirm = (name: string, description: string, isPublic: boolean) => {
    const maze: MazeData = {
      id: mazeId || undefined,
      name,
      description,
      isPublic,
      gridSize,
      cells,
    };
    
    saveMazeMutation.mutate(maze);
    setMazeName(name);
  };

  // Handle load maze
  const handleLoadMaze = () => {
    // Redirect to the gallery to select a maze
    window.location.href = "/gallery";
  };

  // Handle generate random maze
  const handleGenerateRandomMaze = () => {
    setRandomMazeModalOpen(true);
  };

  const handleGenerateConfirm = (options: RandomMazeOptions) => {
    // Generate a random maze
    const randomGrid = generateMaze(options);
    const flatCells = flattenGrid(randomGrid);
    
    // Update state
    setCells(flatCells);
    addToHistory(flatCells);
    
    toast({
      title: "Random Maze Generated",
      description: `A new ${options.mazeType} maze has been created.`,
    });
  };

  // Run pathfinding algorithm
  const runAlgorithm = async () => {
    // Check if there's a start and exit point
    const { start, end } = findStartAndEnd(cells);
    
    if (!start || !end) {
      toast({
        title: "Missing Start or Exit",
        description: "Please add both a start and exit point to your maze.",
        variant: "destructive",
      });
      return;
    }
    
    // Reset the grid path state
    const resetCells = resetGridPathState(cells);
    setCells(resetCells);
    
    // Convert to 2D array for the algorithm
    const grid2D = gridTo2DArray(resetCells, gridSize);
    
    // Set running state
    setIsRunningAlgorithm(true);
    setMetrics({
      ...metrics,
      status: "Running",
    });
    
    // Define callbacks
    const onVisit = (x: number, y: number) => {
      setCells((prevCells) => markCellVisited(prevCells, x, y));
    };
    
    const onPathFound = (path: Point[]) => {
      setCells((prevCells) => markCellPath(prevCells, path));
    };
    
    try {
      let result;
      
      // Run the selected algorithm
      switch (selectedAlgorithm) {
        case AlgorithmType.AStar:
          result = await aStarAlgorithm(grid2D, start, end, onVisit, onPathFound);
          break;
        case AlgorithmType.Neural:
          result = await neuralPathfinding(grid2D, start, end, onVisit, onPathFound);
          break;
        case AlgorithmType.Random:
          result = await randomWalkAlgorithm(grid2D, start, end, onVisit, onPathFound);
          break;
        default:
          result = await aStarAlgorithm(grid2D, start, end, onVisit, onPathFound);
      }
      
      // Update metrics
      setMetrics({
        computationTime: result.time,
        cellsEvaluated: result.visitedCells,
        pathLength: result.path.length,
        status: result.path.length > 0 ? "Solution Found" : "No Solution",
      });
    } catch (error) {
      console.error("Algorithm error:", error);
      setMetrics({
        ...metrics,
        status: "Error",
      });
      
      toast({
        title: "Algorithm Error",
        description: "An error occurred while running the pathfinding algorithm.",
        variant: "destructive",
      });
    } finally {
      setIsRunningAlgorithm(false);
    }
  };

  return (
    <Layout>
      <div className="flex flex-col lg:flex-row flex-grow">
        <ToolsSidebar
          selectedTool={selectedTool}
          onSelectTool={setSelectedTool}
          gridSize={gridSize}
          onGridSizeChange={setGridSize}
          cellSize={cellSize}
          onCellSizeChange={setCellSize}
          onSaveMaze={handleSaveMaze}
          onLoadMaze={handleLoadMaze}
          onGenerateRandomMaze={handleGenerateRandomMaze}
        />

        <WorkspaceArea
          cells={cells}
          gridSize={gridSize}
          cellSize={cellSize}
          selectedTool={selectedTool}
          onCellUpdate={handleCellUpdate}
          mode={mode}
          onModeChange={setMode}
          mazeName={mazeName}
          onClearGrid={handleClearGrid}
          onUndo={handleUndo}
          onRedo={handleRedo}
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
        />
      </div>

      <AlgorithmPanel
        selectedAlgorithm={selectedAlgorithm}
        onAlgorithmChange={setSelectedAlgorithm}
        onRunAlgorithm={runAlgorithm}
        metrics={metrics}
        isRunning={isRunningAlgorithm}
      />

      <SaveMazeModal
        isOpen={saveModalOpen}
        onClose={() => setSaveModalOpen(false)}
        onSave={handleSaveConfirm}
        defaultName={mazeName}
      />

      <RandomMazeModal
        isOpen={randomMazeModalOpen}
        onClose={() => setRandomMazeModalOpen(false)}
        onGenerate={handleGenerateConfirm}
        currentSize={gridSize}
      />
    </Layout>
  );
}
