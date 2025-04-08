import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import Layout from "@/components/Layout";
import { MazeListItem } from "@/utils/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Gallery() {
  const [_, setLocation] = useLocation();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch mazes from the API
  const { data: mazes, isLoading, error } = useQuery<MazeListItem[]>({
    queryKey: ["/api/mazes"],
  });

  const handleMazeSelect = (mazeId: number) => {
    setLocation(`/builder?mazeId=${mazeId}`);
  };

  // Filter mazes based on search term
  const filteredMazes = mazes?.filter((maze) =>
    maze.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Group mazes into public and personal
  const publicMazes = filteredMazes?.filter(maze => maze.isPublic) || [];
  const personalMazes = filteredMazes?.filter(maze => !maze.isPublic) || [];

  return (
    <Layout>
      <div className="container mx-auto py-8 px-4">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold font-heading mb-4">Maze Gallery</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Browse and load saved mazes from our community or your personal collection.
          </p>
        </div>

        <div className="mb-6 max-w-md mx-auto">
          <Input
            placeholder="Search mazes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>

        <Tabs defaultValue="all" className="max-w-5xl mx-auto">
          <TabsList className="grid w-full md:w-96 grid-cols-3 mb-8">
            <TabsTrigger value="all">All Mazes</TabsTrigger>
            <TabsTrigger value="public">Public</TabsTrigger>
            <TabsTrigger value="personal">Personal</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            {isLoading ? (
              <div className="text-center py-12">Loading mazes...</div>
            ) : error ? (
              <div className="text-center py-12 text-red-500">
                Error loading mazes. Please try again.
              </div>
            ) : filteredMazes?.length === 0 ? (
              <div className="text-center py-12">
                No mazes found. Try creating one!
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredMazes?.map((maze) => (
                  <MazeCard
                    key={maze.id}
                    maze={maze}
                    onSelect={handleMazeSelect}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="public">
            {isLoading ? (
              <div className="text-center py-12">Loading mazes...</div>
            ) : publicMazes.length === 0 ? (
              <div className="text-center py-12">
                No public mazes found.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {publicMazes.map((maze) => (
                  <MazeCard
                    key={maze.id}
                    maze={maze}
                    onSelect={handleMazeSelect}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="personal">
            {isLoading ? (
              <div className="text-center py-12">Loading mazes...</div>
            ) : personalMazes.length === 0 ? (
              <div className="text-center py-12">
                No personal mazes found. Try saving one!
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {personalMazes.map((maze) => (
                  <MazeCard
                    key={maze.id}
                    maze={maze}
                    onSelect={handleMazeSelect}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}

interface MazeCardProps {
  maze: MazeListItem;
  onSelect: (id: number) => void;
}

function MazeCard({ maze, onSelect }: MazeCardProps) {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>{maze.name}</CardTitle>
        <CardDescription>
          {maze.description || "No description provided"}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="text-sm text-muted-foreground">
          <div>Grid Size: {maze.gridSize}×{maze.gridSize}</div>
          <div>
            Created:{" "}
            {maze.createdAt
              ? new Date(maze.createdAt).toLocaleDateString()
              : "Unknown"}
          </div>
          <div>Visibility: {maze.isPublic ? "Public" : "Private"}</div>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full"
          onClick={() => onSelect(maze.id)}
        >
          Load Maze
        </Button>
      </CardFooter>
    </Card>
  );
}
