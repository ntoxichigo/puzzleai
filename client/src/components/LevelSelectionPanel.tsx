import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Star, 
  Clock, 
  Trophy, 
  Sparkles, 
  Users, 
  Footprints,
  Brain,
  Filter,
  SlidersHorizontal
} from "lucide-react";
import { motion } from "framer-motion";
import { MazeListItem } from "@/utils/types";

interface LevelSelectionPanelProps {
  mazes: MazeListItem[];
  onSelectLevel: (maze: MazeListItem) => void;
  loading: boolean;
}

export default function LevelSelectionPanel({
  mazes,
  onSelectLevel,
  loading
}: LevelSelectionPanelProps) {
  const [difficultyFilter, setDifficultyFilter] = useState<string>("all");
  const [sortOrder, setSortOrder] = useState<string>("newest");
  
  // Calculate a difficulty score based on grid size and other factors
  const getDifficultyLevel = (maze: MazeListItem): "Easy" | "Medium" | "Hard" | "Expert" => {
    const { gridSize } = maze;
    
    if (gridSize <= 10) return "Easy";
    if (gridSize <= 15) return "Medium";
    if (gridSize <= 20) return "Hard";
    return "Expert";
  };
  
  // Apply filters and sorting
  const filteredMazes = mazes.filter(maze => {
    if (difficultyFilter === "all") return true;
    return getDifficultyLevel(maze).toLowerCase() === difficultyFilter.toLowerCase();
  });
  
  // Apply sorting
  const sortedMazes = [...filteredMazes].sort((a, b) => {
    if (sortOrder === "newest") {
      // Assume createdAt is a string date
      return new Date(b.createdAt || "").getTime() - new Date(a.createdAt || "").getTime();
    } else if (sortOrder === "popular") {
      // Here we could sort by number of plays or ratings
      return b.id - a.id; // Placeholder sort
    } else if (sortOrder === "difficulty") {
      const difficultyOrder = { "Easy": 1, "Medium": 2, "Hard": 3, "Expert": 4 };
      return difficultyOrder[getDifficultyLevel(b)] - difficultyOrder[getDifficultyLevel(a)];
    }
    return 0;
  });
  
  // We'll mock some data for demonstration 
  const mockAiTime = (maze: MazeListItem): number => {
    const { gridSize } = maze;
    // The larger the maze, the longer the AI takes
    return Math.round(gridSize * 0.5);
  };
  
  const mockCompletionRate = (maze: MazeListItem): number => {
    return Math.round(Math.random() * 100);
  };

  return (
    <div className="p-4 bg-slate-50 min-h-[calc(100vh-200px)]">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
              <Trophy className="h-6 w-6 text-amber-500" />
              Challenge Yourself
            </h2>
            <p className="text-slate-600 max-w-xl">
              Choose a level and compete against our AI solver. Can you beat the machine at its own game?
            </p>
          </div>
          
          <div className="flex gap-3">
            <div className="border rounded-md p-2 flex items-center gap-2 bg-white">
              <Filter className="h-4 w-4 text-slate-500" />
              <select 
                className="bg-transparent border-none text-sm focus:outline-none" 
                value={difficultyFilter}
                onChange={(e) => setDifficultyFilter(e.target.value)}
              >
                <option value="all">All Difficulties</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
                <option value="expert">Expert</option>
              </select>
            </div>
            
            <div className="border rounded-md p-2 flex items-center gap-2 bg-white">
              <SlidersHorizontal className="h-4 w-4 text-slate-500" />
              <select 
                className="bg-transparent border-none text-sm focus:outline-none" 
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
              >
                <option value="newest">Newest First</option>
                <option value="popular">Most Popular</option>
                <option value="difficulty">Difficulty (Hardest First)</option>
              </select>
            </div>
          </div>
        </div>
        
        <Tabs defaultValue="featured" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="featured" className="flex gap-1 items-center">
              <Sparkles className="h-4 w-4" />
              <span>Featured</span>
            </TabsTrigger>
            <TabsTrigger value="community" className="flex gap-1 items-center">
              <Users className="h-4 w-4" />
              <span>Community Mazes</span>
            </TabsTrigger>
            <TabsTrigger value="my-progress" className="flex gap-1 items-center">
              <Footprints className="h-4 w-4" />
              <span>My Progress</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="featured" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {loading ? (
                // Skeleton loaders
                Array(6).fill(0).map((_, i) => (
                  <Card key={i} className="p-4 animate-pulse">
                    <div className="h-32 bg-slate-200 rounded-md mb-4"></div>
                    <div className="h-5 bg-slate-200 rounded w-2/3 mb-2"></div>
                    <div className="h-4 bg-slate-200 rounded w-full mb-4"></div>
                    <div className="flex justify-between">
                      <div className="h-8 bg-slate-200 rounded w-24"></div>
                      <div className="h-8 bg-slate-200 rounded w-20"></div>
                    </div>
                  </Card>
                ))
              ) : (
                sortedMazes.map(maze => (
                  <LevelCard 
                    key={maze.id} 
                    maze={maze} 
                    aiTime={mockAiTime(maze)}
                    completionRate={mockCompletionRate(maze)}
                    difficulty={getDifficultyLevel(maze)}
                    onSelect={() => onSelectLevel(maze)}
                  />
                ))
              )}
            </div>
            
            {sortedMazes.length === 0 && !loading && (
              <div className="text-center py-10">
                <p className="text-slate-500">No levels match your filters. Try changing your criteria.</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="community">
            <div className="text-center py-10">
              <Brain className="h-12 w-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-medium mb-2">Coming Soon</h3>
              <p className="text-slate-500 max-w-md mx-auto">
                The community section will allow you to discover, play, and rate mazes created by other users.
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="my-progress">
            <div className="text-center py-10">
              <Brain className="h-12 w-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-medium mb-2">Track Your Progress</h3>
              <p className="text-slate-500 max-w-md mx-auto">
                Once you start solving mazes, your progress and achievements will appear here.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

interface LevelCardProps {
  maze: MazeListItem;
  aiTime: number;
  difficulty: "Easy" | "Medium" | "Hard" | "Expert";
  completionRate: number;
  onSelect: () => void;
}

function LevelCard({ maze, aiTime, difficulty, completionRate, onSelect }: LevelCardProps) {
  // Map difficulty to colors
  const difficultyColor = {
    "Easy": "bg-green-100 text-green-800 border-green-200",
    "Medium": "bg-blue-100 text-blue-800 border-blue-200",
    "Hard": "bg-orange-100 text-orange-800 border-orange-200",
    "Expert": "bg-red-100 text-red-800 border-red-200"
  };

  // Generate a simple maze preview based on maze size
  const generateMazePreview = () => {
    return `linear-gradient(to right, #f1f5f9 1px, transparent 1px) 0 0 / ${100 / maze.gridSize}% 100%, 
            linear-gradient(to bottom, #f1f5f9 1px, transparent 1px) 0 0 / 100% ${100 / maze.gridSize}%`;
  };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <Card className="overflow-hidden hover:shadow-lg transition-shadow">
        <div 
          className="h-36 bg-slate-100 relative" 
          style={{ background: "#e2e8f0", backgroundImage: generateMazePreview() }}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-white/80 backdrop-blur-sm rounded-full w-16 h-16 flex items-center justify-center">
              <div className="text-2xl font-bold">{maze.gridSize}×{maze.gridSize}</div>
            </div>
          </div>
          
          <div className="absolute top-2 right-2">
            <Badge className={`${difficultyColor[difficulty]} border px-2 py-0.5`}>
              {difficulty}
            </Badge>
          </div>
        </div>
        
        <div className="p-4">
          <h3 className="font-bold text-lg mb-1">{maze.name}</h3>
          <p className="text-slate-500 text-sm mb-3 line-clamp-2">
            {maze.description || "Navigate through this challenging maze to find the exit."}
          </p>
          
          <div className="flex justify-between items-center text-sm text-slate-600 mb-4">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4 text-blue-500" />
              <span>AI: {aiTime}s</span>
            </div>
            
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 text-amber-500" />
              <span>{completionRate}% completion</span>
            </div>
          </div>
          
          <Button 
            onClick={onSelect}
            className="w-full"
            variant="default"
          >
            Play Challenge
          </Button>
        </div>
      </Card>
    </motion.div>
  );
}