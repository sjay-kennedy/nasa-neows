'use client';
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
  const [theme, setTheme] = useState<string>("dark");

  useEffect(() => {
    // Function to update theme state
    const updateTheme = () => {
      setTheme(document.documentElement.getAttribute("data-theme") || "dark");
    };

    // Listen for theme changes (if you change theme via JS elsewhere)
    const observer = new MutationObserver(updateTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

    // Set initial theme
    updateTheme();

    return () => observer.disconnect();
  }, []);
  return (
    
      <div className="p-4 mt-8">
          <div className="flex flex-col items-center h-screen">
            <Image
              src={theme === "light" ? "/img/nasa-dark.png" : "/img/nasa.png"}
              alt="NASA Logo"
              width={400}
              height={200}
              className="mb-6 mt-2"
            />
            <h1 className="text-3xl font-bold mb-4">NEO Web Service</h1>
            <p className="text-lg mb-6">Explore Near-Earth Objects (NEOs) with NASA's NEO Web Service.</p>
            <Link href="/browse" className={theme === "light" ? "btn btn-neutral" : "btn btn-secondary"}>Browse Asteroids</Link>
            
          </div>
      </div>
    
    
    
  );
}
