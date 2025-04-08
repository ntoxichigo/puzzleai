import { useState } from "react";
import { CellType } from "@/utils/types";

interface ToolsSidebarProps {
  selectedTool: CellType;
  onSelectTool: (tool: CellType) => void;
  gridSize: number;
  onGridSizeChange: (size: number) => void;
  cellSize: number;
  onCellSizeChange: (size: number) => void;
  onSaveMaze: () => void;
  onLoadMaze: () => void;
  onGenerateRandomMaze: () => void;
}

export default function ToolsSidebar({
  selectedTool,
  onSelectTool,
  gridSize,
  onGridSizeChange,
  cellSize,
  onCellSizeChange,
  onSaveMaze,
  onLoadMaze,
  onGenerateRandomMaze,
}: ToolsSidebarProps) {
  const handleToolClick = (tool: CellType) => {
    onSelectTool(tool);
  };

  const handleGridSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onGridSizeChange(parseInt(e.target.value));
  };

  const handleCellSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onCellSizeChange(parseInt(e.target.value));
  };

  return (
    <aside className="w-full lg:w-64 bg-white shadow-md p-4 border-b lg:border-b-0 lg:border-r border-gray-200 flex flex-col">
      <h2 className="font-heading text-lg font-medium mb-4 text-foreground">Tools</h2>
      <div className="grid grid-cols-2 lg:grid-cols-1 gap-3">
        {/* Start Tool */}
        <div
          className={`tool-button p-3 rounded-lg border flex flex-col items-center cursor-pointer ${
            selectedTool === CellType.Start ? "tool-selected" : ""
          }`}
          onClick={() => handleToolClick(CellType.Start)}
        >
          <div className="w-8 h-8 bg-green-500 rounded-md mb-2"></div>
          <span className="text-sm font-medium">Start Point</span>
        </div>

        {/* Exit Tool */}
        <div
          className={`tool-button p-3 rounded-lg border flex flex-col items-center cursor-pointer ${
            selectedTool === CellType.Exit ? "tool-selected" : ""
          }`}
          onClick={() => handleToolClick(CellType.Exit)}
        >
          <div className="w-8 h-8 bg-red-500 rounded-md mb-2"></div>
          <span className="text-sm font-medium">Exit Point</span>
        </div>

        {/* Wall Tool */}
        <div
          className={`tool-button p-3 rounded-lg border flex flex-col items-center cursor-pointer ${
            selectedTool === CellType.Wall ? "tool-selected" : ""
          }`}
          onClick={() => handleToolClick(CellType.Wall)}
        >
          <div className="w-8 h-8 bg-gray-800 rounded-md mb-2"></div>
          <span className="text-sm font-medium">Wall</span>
        </div>

        {/* Clear Tool */}
        <div
          className={`tool-button p-3 rounded-lg border flex flex-col items-center cursor-pointer ${
            selectedTool === CellType.Empty ? "tool-selected" : ""
          }`}
          onClick={() => handleToolClick(CellType.Empty)}
        >
          <div className="w-8 h-8 border border-dashed border-gray-400 rounded-md mb-2 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-500"
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
          </div>
          <span className="text-sm font-medium">Eraser</span>
        </div>

        {/* Door Tool */}
        <div
          className={`tool-button p-3 rounded-lg border flex flex-col items-center cursor-pointer ${
            selectedTool === CellType.Door ? "tool-selected" : ""
          }`}
          onClick={() => handleToolClick(CellType.Door)}
        >
          <div className="w-8 h-8 bg-orange-500 rounded-md mb-2 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"
              />
            </svg>
          </div>
          <span className="text-sm font-medium">Door</span>
        </div>

        {/* Key Tool */}
        <div
          className={`tool-button p-3 rounded-lg border flex flex-col items-center cursor-pointer ${
            selectedTool === CellType.Key ? "tool-selected" : ""
          }`}
          onClick={() => handleToolClick(CellType.Key)}
        >
          <div className="w-8 h-8 bg-yellow-300 rounded-md mb-2 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-yellow-700"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
              />
            </svg>
          </div>
          <span className="text-sm font-medium">Key</span>
        </div>
      </div>

      <div className="mt-6 pb-4 border-b border-gray-200">
        <h3 className="font-heading text-md font-medium mb-3 text-foreground">Grid Settings</h3>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">Grid Size</label>
            <div className="flex items-center">
              <input
                type="range"
                min="10"
                max="50"
                value={gridSize}
                onChange={handleGridSizeChange}
                className="w-full"
              />
              <span className="ml-2 text-sm font-mono">{gridSize}×{gridSize}</span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">Cell Size</label>
            <div className="flex items-center">
              <input
                type="range"
                min="10"
                max="40"
                value={cellSize}
                onChange={handleCellSizeChange}
                className="w-full"
              />
              <span className="ml-2 text-sm font-mono">{cellSize}px</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 space-y-3">
        <button
          onClick={onSaveMaze}
          className="w-full bg-primary-500 hover:bg-primary-600 text-white py-2 px-4 rounded-md font-medium transition-colors flex items-center justify-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
            />
          </svg>
          Save Maze
        </button>
        <button
          onClick={onLoadMaze}
          className="w-full bg-white border border-primary-500 text-primary-500 hover:bg-primary-50 py-2 px-4 rounded-md font-medium transition-colors flex items-center justify-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
            />
          </svg>
          Load Maze
        </button>
        <button
          onClick={onGenerateRandomMaze}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-md font-medium transition-colors flex items-center justify-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M17 8l4 4m0 0l-4 4m4-4H3"
            />
          </svg>
          Generate Random Maze
        </button>
      </div>
    </aside>
  );
}
