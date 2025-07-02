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
          <div className="z-[3] relative flex flex-col items-center  mt-[7%] sm:mt-[10%] md:mt-[10%] lg:mt-[15%] xl:mt-[5%] 2xl:mt-[5%]">
            <Image
              src={theme === "light" ? "/img/nasa-dark.png" : "/img/nasa.png"}
              alt="NASA Logo"
              width={400}
              height={200}
              className="mb-6  animate-fade-in"
            />
            <div className={theme === "light" ? "bg-slate-900/40 p-6 rounded-lg shadow-lg" : "bg-pink-300/20 p-6 rounded-lg shadow-lg"}>
              <h1 className="text-white text-center text-3xl font-bold mb-4">NEO Web Service</h1>
              <p className="text-white text-center text-lg mb-6 pl-5 pr-5">
                Explore Near-Earth Objects (NEOs) with NASA's NEO Web Service.
              </p>
              <div className="flex justify-center">
                <Link
                  href="/browse"
                  className={theme === "light" ? "btn btn-secondary" : "btn btn-secondary"}
                >
                  Browse Asteroids
                </Link>
              </div>
            </div>
          </div>
      </div>
    
    
    
  );
}
