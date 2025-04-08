import { useState } from "react";
import { motion } from "framer-motion";
import Grid from "./Grid";
import { CellType, GridCell, GameDifficulty } from "@/utils/types";
import { Eye, EyeOff, AlertTriangle, BrainCircuit } from "lucide-react";

interface WorkspaceAreaProps {
  cells: GridCell[];
  gridSize: number;
  cellSize: number;
  selectedTool: CellType;
  onCellUpdate: (x: number, y: number, type: CellType) => void;
  mode: "build" | "play";
  onModeChange: (mode: "build" | "play") => void;
  mazeName: string;
  onClearGrid: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
}

export default function WorkspaceArea({
  cells,
  gridSize,
  cellSize,
  selectedTool,
  onCellUpdate,
  mode,
  onModeChange,
  mazeName,
  onClearGrid,
  onUndo,
  onRedo,
  onZoomIn,
  onZoomOut,
}: WorkspaceAreaProps) {
  const [difficulty, setDifficulty] = useState<GameDifficulty>(GameDifficulty.Normal);
  const [visibilityRadius, setVisibilityRadius] = useState<number>(4);
  return (
    <div className="flex-grow flex flex-col px-2 py-3 md:px-6 md:py-4">
      {/* Workspace Controls */}
      <div className="flex flex-wrap gap-3 mb-4">
        {/* Mode Toggle */}
        <div className="bg-white shadow-sm rounded-lg flex p-1">
          <button
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              mode === "build"
                ? "bg-primary-500 text-white"
                : "text-foreground hover:bg-gray-100"
            }`}
            onClick={() => onModeChange("build")}
          >
            Build
          </button>
          <button
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              mode === "play"
                ? "bg-primary-500 text-white"
                : "text-foreground hover:bg-gray-100"
            }`}
            onClick={() => onModeChange("play")}
          >
            Play
          </button>
        </div>
        
        {/* Difficulty Selector - only show in play mode */}
        {mode === "play" && (
          <div className="bg-white shadow-sm rounded-lg p-1 flex items-center">
            <div className="flex items-center">
              <button
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors mr-1 ${
                  difficulty === GameDifficulty.Normal
                    ? "bg-green-100 text-green-800"
                    : "hover:bg-gray-100"
                }`}
                onClick={() => setDifficulty(GameDifficulty.Normal)}
                title="Normal Mode"
              >
                <Eye className="h-4 w-4" />
                <span>Normal</span>
              </button>
              
              <button
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  difficulty === GameDifficulty.Hard
                    ? "bg-red-100 text-red-800"
                    : "hover:bg-gray-100"
                }`}
                onClick={() => setDifficulty(GameDifficulty.Hard)}
                title="Hard Mode with Fog-of-War"
              >
                <EyeOff className="h-4 w-4" />
                <span>Hard Mode</span>
              </button>
            </div>
          </div>
        )}

        {/* Extra Controls */}
        <div className="flex gap-2 ml-auto">
          <button
            className="p-2 bg-white shadow-sm rounded-lg hover:bg-gray-50 transition-colors"
            title="Clear Grid"
            onClick={onClearGrid}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-muted-foreground"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
          <button
            className="p-2 bg-white shadow-sm rounded-lg hover:bg-gray-50 transition-colors"
            title="Undo"
            onClick={onUndo}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-muted-foreground"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
              />
            </svg>
          </button>
          <button
            className="p-2 bg-white shadow-sm rounded-lg hover:bg-gray-50 transition-colors"
            title="Redo"
            onClick={onRedo}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-muted-foreground"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </button>
          <button
            className="p-2 bg-white shadow-sm rounded-lg hover:bg-gray-50 transition-colors"
            title="Zoom In"
            onClick={onZoomIn}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-muted-foreground"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
              />
            </svg>
          </button>
          <button
            className="p-2 bg-white shadow-sm rounded-lg hover:bg-gray-50 transition-colors"
            title="Zoom Out"
            onClick={onZoomOut}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-muted-foreground"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Grid Container */}
      <div className="flex-grow bg-white p-4 rounded-lg shadow-md overflow-auto relative">
        {/* Grid Header */}
        <div className="absolute top-3 left-3 bg-white/80 backdrop-blur-sm rounded-md px-3 py-2 shadow-sm z-10">
          <h2 className="font-heading font-medium text-sm text-foreground">{mazeName || "Untitled Maze"}</h2>
        </div>

        {/* Grid Viewport */}
        <Grid
          cells={cells}
          gridSize={gridSize}
          cellSize={cellSize}
          selectedTool={selectedTool}
          onCellUpdate={onCellUpdate}
          mode={mode}
          difficulty={difficulty}
          visibilityRadius={visibilityRadius}
        />
        
        {/* Fog of War Hard Mode Indicator */}
        {mode === "play" && difficulty === GameDifficulty.Hard && (
          <div className="absolute top-3 right-3 bg-slate-800/90 text-white px-3 py-2 rounded-md z-10 flex items-center gap-2">
            <EyeOff className="h-4 w-4 text-red-400" />
            <span className="font-medium text-sm">Fog of War Mode</span>
          </div>
        )}

        {/* Grid Legend */}
        <div className="absolute bottom-3 right-3 bg-white/80 backdrop-blur-sm rounded-md px-3 py-2 shadow-sm z-10 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded-sm"></div>
            <span>Start</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500 rounded-sm"></div>
            <span>Exit</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-800 rounded-sm"></div>
            <span>Wall</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-200 rounded-sm"></div>
            <span>Visited</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-500 rounded-sm"></div>
            <span>Path</span>
          </div>
        </div>
      </div>
    </div>
  );
}
