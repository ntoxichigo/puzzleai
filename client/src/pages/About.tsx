import { Link } from "wouter";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function About() {
  return (
    <Layout>
      <div className="container max-w-4xl py-12">
        <h1 className="text-4xl font-bold mb-6">About Escape Logic Lab</h1>
        
        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4">Project Overview</h2>
            <Card>
              <CardContent className="pt-6">
                <p className="mb-4">
                  Escape Logic Lab is a browser-based escape room game that combines the thrill of puzzle-solving with the 
                  fascinating world of pathfinding algorithms.
                </p>
                <p>
                  Our platform allows users to create, solve, and share custom maze designs while learning about different
                  pathfinding algorithms through interactive visualizations.
                </p>
              </CardContent>
            </Card>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold mb-4">Key Features</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Visual Maze Builder</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    Create custom mazes with our intuitive editor. Place walls, doors, keys, and more to design challenging escape room puzzles.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>AI Pathfinding</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    Watch as our advanced algorithms solve your mazes in real-time. Compare different pathfinding strategies and their performance.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Community Sharing</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    Share your maze designs with the community and try solving puzzles created by other users. Vote for your favorites!
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Performance Tracking</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    Track your puzzle-solving performance against AI solutions. Analyze metrics like solution time, moves made, and efficiency.
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold mb-4">Technologies</h2>
            <Card>
              <CardContent className="pt-6">
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    <strong>Frontend:</strong> React with TypeScript for a responsive and type-safe user interface
                  </li>
                  <li>
                    <strong>Styling:</strong> Tailwind CSS and shadcn/ui for beautiful, accessible components
                  </li>
                  <li>
                    <strong>Pathfinding:</strong> Custom implementations of A*, Neural Pathfinding, and Random Walk algorithms
                  </li>
                  <li>
                    <strong>Backend:</strong> Express.js for API endpoints and maze data storage
                  </li>
                </ul>
              </CardContent>
            </Card>
          </section>
          
          <section className="text-center">
            <h2 className="text-2xl font-semibold mb-6">Ready to get started?</h2>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-primary-600 hover:bg-primary-700">
                <Link href="/maze-builder">
                  Build a Maze
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/gallery">
                  Explore Gallery
                </Link>
              </Button>
            </div>
          </section>
        </div>
      </div>
    </Layout>
  );
}