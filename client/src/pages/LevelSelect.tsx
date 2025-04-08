import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import Layout from "@/components/Layout";
import LevelSelectionPanel from "@/components/LevelSelectionPanel";
import { MazeListItem } from "@/utils/types";
import { queryClient } from "@/lib/queryClient";

export default function LevelSelect() {
  const [_, setLocation] = useLocation();
  
  // Fetch all mazes
  const { data: mazes, isLoading } = useQuery({
    queryKey: ['/api/mazes'],
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
  
  const handleSelectLevel = (maze: MazeListItem) => {
    // Store selected maze in session storage for persistence across page loads
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('selectedMaze', JSON.stringify(maze));
    }
    
    // Navigate to the maze builder with the selected maze
    setLocation(`/maze-builder?id=${maze.id}`);
  };
  
  return (
    <Layout>
      <div className="flex flex-col min-h-screen">
        <LevelSelectionPanel 
          mazes={mazes || []} 
          onSelectLevel={handleSelectLevel}
          loading={isLoading}
        />
      </div>
    </Layout>
  );
}