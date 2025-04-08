import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RandomMazeOptions } from "@/utils/types";
import { Badge } from "@/components/ui/badge";
import { Info, Wand2, Puzzle, Zap, Maximize, Layers, Brain } from "lucide-react";

interface RandomMazeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (options: RandomMazeOptions) => void;
  currentSize: number;
}

export default function RandomMazeModal({
  isOpen,
  onClose,
  onGenerate,
  currentSize,
}: RandomMazeModalProps) {
  const [mazeType, setMazeType] = useState<RandomMazeOptions["mazeType"]>("Labyrinth");
  const [difficulty, setDifficulty] = useState<number>(3);
  const [width, setWidth] = useState<number>(currentSize);
  const [height, setHeight] = useState<number>(currentSize);
  const [ensureSolvable, setEnsureSolvable] = useState<boolean>(true);
  const [mazeDescription, setMazeDescription] = useState<string>("");

  // Update description when maze type changes
  useEffect(() => {
    switch(mazeType) {
      case "Labyrinth":
        setMazeDescription("Classic maze with winding passages and a single solution path. Perfect for beginners.");
        break;
      case "Puzzle Challenge":
        setMazeDescription("Challenging maze with keys and doors. Collect keys to unlock doors blocking your path.");
        break;
      case "Open Space":
        setMazeDescription("Maze with open areas and multiple paths. Great for exploring different strategies.");
        break;
      case "Maze with Loops":
        setMazeDescription("Complex maze with circular paths and multiple routes. Test your navigation skills!");
        break;
    }
  }, [mazeType]);

  const handleGenerate = () => {
    onGenerate({
      mazeType,
      difficulty,
      width,
      height,
      ensureSolvable: true, // Always ensure solvable
    });
    onClose();
  };

  const getMazeTypeIcon = () => {
    switch(mazeType) {
      case "Labyrinth": return <Layers className="h-5 w-5 mr-2" />;
      case "Puzzle Challenge": return <Puzzle className="h-5 w-5 mr-2" />;
      case "Open Space": return <Maximize className="h-5 w-5 mr-2" />;
      case "Maze with Loops": return <Zap className="h-5 w-5 mr-2" />;
      default: return <Wand2 className="h-5 w-5 mr-2" />;
    }
  };

  const getDifficultyLabel = () => {
    switch(difficulty) {
      case 1: return <Badge variant="outline" className="ml-2 bg-green-100">Very Easy</Badge>;
      case 2: return <Badge variant="outline" className="ml-2 bg-green-200">Easy</Badge>;
      case 3: return <Badge variant="outline" className="ml-2 bg-yellow-100">Medium</Badge>;
      case 4: return <Badge variant="outline" className="ml-2 bg-orange-100">Hard</Badge>;
      case 5: return <Badge variant="outline" className="ml-2 bg-red-100">Expert</Badge>;
      default: return <Badge variant="outline" className="ml-2">Medium</Badge>;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center text-xl">
            <Wand2 className="h-5 w-5 mr-2" />
            Generate Random Maze
          </DialogTitle>
          <DialogDescription>
            Create a custom maze with the settings below. All mazes are guaranteed to be solvable!
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2 bg-slate-50 p-3 rounded-md">
            <Label htmlFor="mazeType" className="flex items-center font-medium">
              {getMazeTypeIcon()} Maze Type {mazeType && getDifficultyLabel()}
            </Label>
            <Select defaultValue={mazeType} onValueChange={(value) => setMazeType(value as any)}>
              <SelectTrigger className="border-2">
                <SelectValue placeholder="Select maze type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Labyrinth">Labyrinth</SelectItem>
                <SelectItem value="Puzzle Challenge">Puzzle Challenge</SelectItem>
                <SelectItem value="Open Space">Open Space</SelectItem>
                <SelectItem value="Maze with Loops">Maze with Loops</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-slate-600 mt-1 italic">{mazeDescription}</p>
          </div>
          
          <div className="space-y-2 bg-slate-50 p-3 rounded-md">
            <Label className="flex items-center font-medium">
              <Brain className="h-5 w-5 mr-2" /> Difficulty
            </Label>
            <div className="flex items-center space-x-4">
              <span className="text-xs text-muted-foreground font-medium">Easy</span>
              <Slider
                value={[difficulty]}
                min={1}
                max={5}
                step={1}
                onValueChange={(value) => setDifficulty(value[0])}
                className="flex-grow"
              />
              <span className="text-xs text-muted-foreground font-medium">Hard</span>
            </div>
            <p className="text-sm text-slate-600 mt-1">
              Higher difficulty means more complex paths and obstacles
            </p>
          </div>
          
          <div className="space-y-2 bg-slate-50 p-3 rounded-md">
            <Label className="flex items-center font-medium">
              <Maximize className="h-5 w-5 mr-2" /> Maze Size
            </Label>
            <div className="flex gap-2 items-center">
              <div className="flex flex-col">
                <span className="text-xs text-slate-500 mb-1">Width</span>
                <Input
                  type="number"
                  value={width}
                  min={10}
                  max={50}
                  onChange={(e) => setWidth(parseInt(e.target.value) || 20)}
                  className="w-20 font-mono border-2"
                />
              </div>
              <span className="px-2 text-lg">×</span>
              <div className="flex flex-col">
                <span className="text-xs text-slate-500 mb-1">Height</span>
                <Input
                  type="number"
                  value={height}
                  min={10}
                  max={50}
                  onChange={(e) => setHeight(parseInt(e.target.value) || 20)}
                  className="w-20 font-mono border-2"
                />
              </div>
            </div>
            <p className="text-sm text-slate-600 mt-1">
              Recommended size: 20×20 for optimal performance
            </p>
          </div>
          
          <div className="flex items-start space-x-2 bg-blue-50 p-3 rounded-md">
            <Info className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-blue-700">
              All mazes are automatically checked to ensure they're solvable. The AI solver can always find a path!
            </p>
          </div>
        </div>
        <DialogFooter className="sm:justify-end">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleGenerate} 
            className="bg-orange-500 hover:bg-orange-600 gap-2"
          >
            <Wand2 className="h-4 w-4" />
            Generate Maze
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
