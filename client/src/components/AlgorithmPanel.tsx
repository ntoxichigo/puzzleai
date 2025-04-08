import { useState, useEffect } from "react";
import { AlgorithmType, AlgorithmMetrics } from "@/utils/types";
import { motion } from "framer-motion";
import { 
  PlayCircle, 
  BrainCircuit, 
  Clock, 
  MousePointerClick, 
  Route, 
  AlertCircle,
  Footprints,
  Sparkles,
  LineChart
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface AlgorithmPanelProps {
  selectedAlgorithm: AlgorithmType;
  onAlgorithmChange: (algorithm: AlgorithmType) => void;
  onRunAlgorithm: () => void;
  metrics: AlgorithmMetrics;
  isRunning: boolean;
}

export default function AlgorithmPanel({
  selectedAlgorithm,
  onAlgorithmChange,
  onRunAlgorithm,
  metrics,
  isRunning,
}: AlgorithmPanelProps) {
  const [animateMetrics, setAnimateMetrics] = useState(false);
  
  // Animate metrics when they change
  useEffect(() => {
    if (metrics.computationTime > 0) {
      setAnimateMetrics(true);
      const timer = setTimeout(() => setAnimateMetrics(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [metrics]);

  const handleAlgorithmChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onAlgorithmChange(e.target.value as AlgorithmType);
  };

  const getAlgorithmDescription = () => {
    switch(selectedAlgorithm) {
      case AlgorithmType.AStar:
        return "Efficiently finds the shortest path using a combination of actual distance and estimated distance to goal.";
      case AlgorithmType.Neural:
        return "Uses a neural network approach to find paths, learning from the maze structure to predict optimal routes.";
      case AlgorithmType.Random:
        return "Takes random steps with a bias toward the goal, simulating an explorer without a map.";
      default:
        return "";
    }
  };

  const getAlgorithmIcon = () => {
    switch(selectedAlgorithm) {
      case AlgorithmType.AStar:
        return <Route className="h-5 w-5 text-blue-500" />;
      case AlgorithmType.Neural:
        return <BrainCircuit className="h-5 w-5 text-purple-500" />;
      case AlgorithmType.Random:
        return <Footprints className="h-5 w-5 text-green-500" />;
      default:
        return <BrainCircuit className="h-5 w-5" />;
    }
  };

  const getStatusIcon = () => {
    switch(metrics.status) {
      case "Solution Found":
        return <Sparkles className="h-5 w-5 text-green-500" />;
      case "No Solution":
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case "Running":
        return <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <LineChart className="h-5 w-5 text-blue-500" />
        </motion.div>;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-400" />;
    }
  };

  return (
    <div className="bg-slate-800 shadow-lg p-4 border-t border-slate-700 text-white">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex-grow md:w-2/5">
            <h3 className="font-heading text-lg font-medium mb-3 flex items-center gap-2">
              <BrainCircuit className="h-5 w-5 text-blue-400" />
              <span>AI Pathfinding Simulator</span>
            </h3>
            
            <div className="flex gap-2 items-start">
              <div className="flex-grow border border-slate-700 rounded-md p-0.5 bg-slate-900">
                <select
                  className="w-full bg-transparent text-white px-3 py-2 text-sm rounded-md"
                  value={selectedAlgorithm}
                  onChange={handleAlgorithmChange}
                  disabled={isRunning}
                >
                  <option value={AlgorithmType.AStar}>{AlgorithmType.AStar}</option>
                  <option value={AlgorithmType.Neural}>{AlgorithmType.Neural}</option>
                  <option value={AlgorithmType.Random}>{AlgorithmType.Random}</option>
                </select>
              </div>
              
              <motion.button
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 min-w-24"
                onClick={onRunAlgorithm}
                disabled={isRunning}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                {isRunning ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  >
                    <PlayCircle className="h-5 w-5" />
                  </motion.div>
                ) : (
                  <PlayCircle className="h-5 w-5" />
                )}
                {isRunning ? "Running..." : "Run AI"}
              </motion.button>
            </div>
            
            <div className="mt-2 flex gap-2 items-start">
              <div className="flex items-center mt-0.5">
                {getAlgorithmIcon()}
              </div>
              <p className="text-sm text-slate-300">
                {getAlgorithmDescription()}
              </p>
            </div>
          </div>

          <div className="hidden md:block border-r border-slate-700 h-24"></div>

          <div className="flex-grow md:w-3/5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-heading text-lg font-medium flex items-center gap-2">
                <LineChart className="h-5 w-5 text-orange-400" />
                <span>Performance Metrics</span>
              </h3>
              
              <Badge variant="outline" className={`px-3 py-1 flex items-center gap-1 ${
                metrics.status === "Solution Found"
                  ? "border-green-500 text-green-400"
                  : metrics.status === "No Solution"
                  ? "border-red-500 text-red-400"
                  : metrics.status === "Running"
                  ? "border-blue-500 text-blue-400"
                  : "border-slate-500"
              }`}>
                {getStatusIcon()}
                {metrics.status}
              </Badge>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <motion.div 
                className="bg-slate-700 p-3 rounded-md"
                animate={animateMetrics ? { scale: [1, 1.05, 1] } : {}}
                transition={{ duration: 0.5 }}
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <Clock className="h-4 w-4 text-blue-400" />
                  <div className="text-xs text-slate-300 font-medium">Computation Time</div>
                </div>
                <div className="font-mono font-medium text-lg">
                  {metrics.computationTime === 0 ? "-" : `${metrics.computationTime.toFixed(0)} ms`}
                </div>
              </motion.div>
              
              <motion.div 
                className="bg-slate-700 p-3 rounded-md"
                animate={animateMetrics ? { scale: [1, 1.05, 1] } : {}}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <MousePointerClick className="h-4 w-4 text-purple-400" />
                  <div className="text-xs text-slate-300 font-medium">Cells Analyzed</div>
                </div>
                <div className="font-mono font-medium text-lg">
                  {metrics.cellsEvaluated === 0 ? "-" : metrics.cellsEvaluated}
                </div>
              </motion.div>
              
              <motion.div 
                className="bg-slate-700 p-3 rounded-md"
                animate={animateMetrics ? { scale: [1, 1.05, 1] } : {}}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <Footprints className="h-4 w-4 text-amber-400" />
                  <div className="text-xs text-slate-300 font-medium">Path Length</div>
                </div>
                <div className="font-mono font-medium text-lg">
                  {metrics.pathLength === 0 ? "-" : metrics.pathLength}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
