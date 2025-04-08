import { Link, useLocation } from "wouter";

export default function Header() {
  const [location] = useLocation();

  return (
    <header className="bg-primary-700 text-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
            />
          </svg>
          <Link href="/">
            <h1 className="font-heading text-xl font-bold cursor-pointer">
              Escape Logic Lab
            </h1>
          </Link>
        </div>
        <nav className="hidden md:flex space-x-6">
          <Link href="/">
            <span className={`font-medium hover:text-primary/70 transition-colors cursor-pointer ${location === "/" ? "text-primary/70" : ""}`}>
              Home
            </span>
          </Link>
          <Link href="/builder">
            <span className={`font-medium hover:text-primary/70 transition-colors cursor-pointer ${location === "/builder" ? "text-primary/70" : ""}`}>
              Builder
            </span>
          </Link>
          <Link href="/gallery">
            <span className={`font-medium hover:text-primary/70 transition-colors cursor-pointer ${location === "/gallery" ? "text-primary/70" : ""}`}>
              Gallery
            </span>
          </Link>
          <Link href="/about">
            <span className={`font-medium hover:text-primary/70 transition-colors cursor-pointer ${location === "/about" ? "text-primary/70" : ""}`}>
              About
            </span>
          </Link>
        </nav>
        <div className="flex items-center space-x-3">
          <button className="bg-primary-600 hover:bg-primary-500 px-4 py-2 rounded-md text-sm font-medium transition-colors">
            Sign In
          </button>
          <button className="md:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
