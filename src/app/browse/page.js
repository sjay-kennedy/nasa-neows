'use client'
import React, { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import axios from 'axios';

export default function BrowseAsteroids() {
  const [asteroids, setAsteroids] = useState([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [showHazardousOnly, setShowHazardousOnly] = useState(false);
  const [maxMissDistance, setMaxMissDistance] = useState(20); // in millions
  const { ref, inView } = useInView();
  const [loading, setLoading] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [theme, setTheme] = useState("dark");
  const [lastFilteredCount, setLastFilteredCount] = useState(0);
  const [autoLoading, setAutoLoading] = useState(false);
  const [consecutiveNoMatches, setConsecutiveNoMatches] = useState(0);

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

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 200); // Show button after scrolling 200px
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Simple infinite scroll - trigger on raw data
  useEffect(() => {
    if (inView && hasMore && !loading && asteroids.length > 0) {
      setPage(prev => prev + 1);
    }
  }, [inView, hasMore, loading, asteroids.length]);

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
        try {
        const response = await axios.get(`/api/neo?page=${page}`);
        const newAsteroids = response.data.near_earth_objects || [];
        setAsteroids(prev => page === 0 ? newAsteroids : [...prev, ...newAsteroids]);
        if (response.data.page) {
            setHasMore(response.data.page.number < response.data.page.total_pages - 1);
        } else {
            setHasMore(false);
        }
        setData(response.data);
        } catch (err) {
        setError(err);
        } finally {
        setLoading(false);
        }
    };
    fetchData();
  }, [page]);

  function getNextCloseApproach(asteroid) {
    if (!asteroid.close_approach_data || asteroid.close_approach_data.length === 0) return null;
    const today = new Date();
    const futureApproaches = asteroid.close_approach_data.filter(entry => {
      const date = new Date(entry.close_approach_date);
      return date >= today;
    });
    if (futureApproaches.length === 0) return null;
    futureApproaches.sort((a, b) =>
      new Date(a.close_approach_date) - new Date(b.close_approach_date)
    );
    const next = futureApproaches[0];
    return {
      date: next.close_approach_date,
      miles: next.miss_distance?.miles
    };
  }

  // Filter asteroids based on current criteria
  const filteredAsteroids = asteroids.filter(asteroid => {
    if (showHazardousOnly && !asteroid.is_potentially_hazardous_asteroid) return false;
    
    // If no distance filter is applied (maxMissDistance is 20), show all asteroids
    if (maxMissDistance === 20) {
      return true;
    }
    
    const nextApproach = getNextCloseApproach(asteroid);
    if (!nextApproach) return false; // Only filter by distance if there's close approach data
    const miles = Number(nextApproach.miles);
    if (isNaN(miles)) return false;
    return miles <= maxMissDistance * 1_000_000;
  });

  const uniqueFilteredAsteroids = Array.from(
        new Map(filteredAsteroids.map(a => [a.id, a])).values()
  );

  // Memoize the filtered asteroids to prevent unnecessary re-renders
  const memoizedFilteredAsteroids = React.useMemo(() => {
    return Array.from(
      new Map(filteredAsteroids.map(a => [a.id, a])).values()
    );
  }, [filteredAsteroids]);

  // Update last filtered count when filtered results change
  useEffect(() => {
    setLastFilteredCount(filteredAsteroids.length);
  }, [filteredAsteroids.length]);

  // Track consecutive loads without new matches
  useEffect(() => {
    const foundNewMatches = filteredAsteroids.length > lastFilteredCount;
    
    if (!foundNewMatches && lastFilteredCount > 0) {
      setConsecutiveNoMatches(prev => prev + 1);
    } else if (foundNewMatches) {
      setConsecutiveNoMatches(0);
    }
  }, [filteredAsteroids.length, lastFilteredCount]);

  // Auto-load more data if we have very few filtered results but more data is available
  useEffect(() => {
    // Only auto-load if we have fewer than 3 results AND we haven't found any new matches recently
    if (filteredAsteroids.length < 3 && hasMore && !loading && asteroids.length > 0 && !autoLoading && consecutiveNoMatches < 3) {
      // Only trigger if we have some data but not enough filtered results
      const timer = setTimeout(() => {
        if (filteredAsteroids.length < 3 && hasMore && !loading && !autoLoading && consecutiveNoMatches < 3) {
          setAutoLoading(true);
          setPage(prev => prev + 1);
        }
      }, 1500); // Wait 1.5 seconds before auto-loading to reduce jumping
      
      return () => clearTimeout(timer);
    }
  }, [filteredAsteroids.length, hasMore, loading, asteroids.length, autoLoading, consecutiveNoMatches]);

  // Reset auto-loading when data finishes loading
  useEffect(() => {
    if (!loading) {
      setAutoLoading(false);
    }
  }, [loading]);

  // Now you can return early
  if (error) {
    return (
      <div>
        Error: {error instanceof Error ? error.message : String(error)}
      </div>
    );
  }

return (
  <div className="relative flex flex-col items-center justify-center p-4 gap-8 lg:flex-row lg:items-start ">
  {/* Filters sidebar */}
   <div className="
    w-full max-w-xs
    p-4 shadow-md asteroids-filters rounded-box mb-6
    lg:min-w-[220px] lg:max-w-xs lg:w-auto lg:mb-0 lg:sticky lg:top-20 lg:z-10
  ">
    <div className="flex flex-col gap-6 items-start  ">
      <label className="flex items-center gap-2">
        <input
          className="checkbox checkbox-secondary"
          type="checkbox"
          checked={showHazardousOnly}
          onChange={e => setShowHazardousOnly(e.target.checked)}
        />
        Show only hazardous
      </label>
      <label className="flex flex-col items-start gap-1">
        <span>Max miss distance:</span>
        <div className="flex items-center gap-[10px]">
          <select
            value={maxMissDistance}
            onChange={e => setMaxMissDistance(Number(e.target.value))}
            className="select select-secondary select-sm"
          >
            {Array.from({ length: 20 }, (_, i) => i + 1).map(num => (
              <option key={num} value={num}>{num} million</option>
            ))}
          </select>
          <span>miles</span>
        </div>
      </label>
      {/* Show info about loaded data */}
      <div className="text-xs opacity-70">
        Loaded: {asteroids.length} asteroids<br/>
        Showing: {filteredAsteroids.length} results
      </div>
    </div>
  </div>
  {/* Asteroids list */}
  <div className="flex flex-col items-center w-full">
    <div className="max-w-md mr-auto ml-auto lg:ml-0 lg:mr-[25%] ">
      <ul className="list bg-base-100 rounded-box shadow-md asteroids-list ">
        {memoizedFilteredAsteroids.map((asteroid) => {
          const nextApproach = getNextCloseApproach(asteroid);
          return (
            <li className={theme === "light" ? "list-row mb-1 border-b border-pink-400/30" : "list-row mb-1 border-b border-pink-300/15"} key={`asteroid-${asteroid.id}-${asteroid.name}`}>
              
              <div>
                <img className="size-10 rounded-box" width="100" src="/img/asteroid-thumb.png" alt="Asteroid" />
              </div>
              <div>
                <div>{asteroid.name}</div>
                <div className="text-xs uppercase font-semibold opacity-60">
                  {asteroid.is_potentially_hazardous_asteroid
                    ? <div className="badge badge-xs badge-secondary text-gray-950 mt-2 mb-2">Hazardous</div>
                    : <div className="badge badge-xs badge-neutral mt-2 mb-2">Safe</div>}
                </div>
                <div className="text-xs uppercase font-semibold opacity-60">Absolute Magnitude: {asteroid.absolute_magnitude_h}</div>
                <div className="text-xs uppercase font-semibold opacity-60">Diameter: {asteroid.estimated_diameter.miles.estimated_diameter_max} miles</div>
                
                <div className="text-xs uppercase font-semibold opacity-60">
                  Next Close Approach: {nextApproach ? nextApproach.date : "No data"}
                </div>
                <div className="text-xs uppercase font-semibold opacity-60">
                  Miss Distance: {nextApproach ? `${Number(nextApproach.miles).toLocaleString()} miles` : "No data"}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
      <div className="flex justify-center mt-4">
        {showScrollTop && (
          <button
            className="fixed bottom-4 right-10 btn btn-secondary btn-sm text-weight-bold text-lg"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            ↑
          </button>
        )}
      </div>
      {/* Show loader when there's more data to load, regardless of current loading state */}
      {hasMore && (
        <div className="flex w-full justify-center items-center py-4 mb-2">
            <span className="loading loading-infinity loading-md"></span>
        </div>
      )}
      {/* Only show the ref element if there's more data to load */}
      {hasMore && (
        <div ref={ref} className="h-4"></div>
      )}
      {/* Show message when all data is loaded */}
      {!hasMore && asteroids.length > 0 && (
        <div className="flex w-full justify-center items-center py-4 mb-2 text-sm opacity-70">
          All data loaded ({asteroids.length} asteroids)
        </div>
      )}
    </div>
  </div>
</div>
);
}