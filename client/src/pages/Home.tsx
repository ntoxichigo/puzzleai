import { Link } from "wouter";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <Layout>
      <div className="flex flex-col items-center">
        <section className="py-16 px-4 text-center max-w-5xl mx-auto">
          <motion.h1 
            className="text-4xl md:text-5xl font-bold font-heading mb-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Welcome to Escape Logic Lab
          </motion.h1>
          <motion.p 
            className="text-lg md:text-xl text-muted-foreground mb-8 max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Design intricate escape rooms, solve challenging mazes, and explore AI pathfinding algorithms in action.
          </motion.p>
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Link href="/builder">
              <Button size="lg" className="px-8">
                Start Building
              </Button>
            </Link>
            <Link href="/gallery">
              <Button size="lg" variant="outline" className="px-8">
                Browse Gallery
              </Button>
            </Link>
          </motion.div>
        </section>

        <section className="py-12 px-4 bg-gray-50 w-full">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold font-heading text-center mb-10">Key Features</h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              <motion.div 
                className="bg-white p-6 rounded-lg shadow-md"
                whileHover={{ y: -5, boxShadow: "0 12px 24px rgba(0, 0, 0, 0.1)" }}
              >
                <div className="mb-4 w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Intuitive Builder</h3>
                <p className="text-muted-foreground">
                  Create custom mazes with our drag-and-drop interface. Add walls, doors, keys, and more.
                </p>
              </motion.div>
              
              <motion.div 
                className="bg-white p-6 rounded-lg shadow-md"
                whileHover={{ y: -5, boxShadow: "0 12px 24px rgba(0, 0, 0, 0.1)" }}
              >
                <div className="mb-4 w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">AI Pathfinding</h3>
                <p className="text-muted-foreground">
                  Watch different algorithms find the optimal path through your maze in real-time.
                </p>
              </motion.div>
              
              <motion.div 
                className="bg-white p-6 rounded-lg shadow-md"
                whileHover={{ y: -5, boxShadow: "0 12px 24px rgba(0, 0, 0, 0.1)" }}
              >
                <div className="mb-4 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Play Mode</h3>
                <p className="text-muted-foreground">
                  Test your own problem-solving skills by navigating through the maze you've built.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        <section className="py-12 px-4 max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold font-heading mb-4">Ready to Get Started?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Build your first maze, experiment with AI algorithms, and challenge your friends to solve your creations.
            </p>
          </div>
          
          <div className="flex justify-center">
            <Link href="/builder">
              <Button size="lg" className="px-8">
                Start Building Now
              </Button>
            </Link>
          </div>
        </section>
      </div>
    </Layout>
  );
}
