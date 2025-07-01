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

  useEffect(() => {
    if (inView && hasMore) {
      setPage(prev => prev + 1);
    }
  }, [inView, hasMore]);

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
  }, [page, showHazardousOnly, maxMissDistance]);

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

  // All hooks and derived values are above this line!
  const filteredAsteroids = asteroids.filter(asteroid => {
    if (showHazardousOnly && !asteroid.is_potentially_hazardous_asteroid) return false;
    const nextApproach = getNextCloseApproach(asteroid);
    if (!nextApproach) return false;
    const miles = Number(nextApproach.miles);
    if (isNaN(miles)) return false;
    return miles <= maxMissDistance * 1_000_000;
  });

  useEffect(() => {
    if (
        filteredAsteroids.length === 0 &&
        hasMore &&
        asteroids.length > 0
    ) {
        setPage(prev => prev + 1);
    }
    }, [
    filteredAsteroids.length,
    hasMore,
    asteroids.length,
    showHazardousOnly,
    maxMissDistance
  ]);

  useEffect(() => {
    // Reset pagination and data when filters change
    setPage(0);
    setAsteroids([]);
    setHasMore(true);
  }, [showHazardousOnly, maxMissDistance]);

  // Now you can return early
  if (error) {
    return (
      <div>
        Error: {error instanceof Error ? error.message : String(error)}
      </div>
    );
  }
 if (loading && page === 0) return (
  <div className="flex w-full mt-8 justify-center items-center">
    <span className="loading loading-bars loading-bars-secondary loading-xl"></span>
  </div>
 );

return (
  <div className="flex flex-row items-start p-4 gap-8 w-full">
  {/* Filters sidebar */}
  <div className="sticky top-20 z-10 p-4 shadow-md asteroids-filters min-w-[220px] max-w-xs">
    <div className="flex flex-col gap-6 items-start">
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
    </div>
  </div>
  {/* Asteroids list */}
  <div className="flex flex-col items-center w-full">
    <div className="w-full max-w-md mr-[25%] ">
      <ul className="list bg-base-100 rounded-box shadow-md asteroids-list">
        {filteredAsteroids.map((asteroid) => {
          const nextApproach = getNextCloseApproach(asteroid);
          return (
            <li className="list-row mb-1" key={asteroid.id}>
              <div>
                <img className="size-10 rounded-box" width="100" src="/img/asteroid-thumb.png" alt="Asteroid" />
              </div>
              <div>
                <div>{asteroid.name}</div>
                <div className="text-xs uppercase font-semibold opacity-60">Absolute Magnitude: {asteroid.absolute_magnitude_h}</div>
                <div className="text-xs uppercase font-semibold opacity-60">Diameter: {asteroid.estimated_diameter.miles.estimated_diameter_max} miles</div>
                <div className="text-xs uppercase font-semibold opacity-60">
                  {asteroid.is_potentially_hazardous_asteroid
                    ? <div className="badge badge-xs badge-secondary text-gray-950 mt-2 mb-2">Hazardous</div>
                    : <div className="badge badge-xs badge-neutral mt-2 mb-2">Safe</div>}
                </div>
                <div className="text-xs uppercase font-semibold opacity-60">
                  Next Close Approach: {nextApproach ? nextApproach.date : "N/A"}
                </div>
                <div className="text-xs uppercase font-semibold opacity-60">
                  Miss Distance: {nextApproach ? `${Number(nextApproach.miles).toLocaleString()} miles` : "N/A"}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
      {loading && page > 0 && (
        <div className="flex w-full justify-center items-center py-4 mb-2">
            <span class="loading loading-infinity loading-md"></span>
        </div>
      )}
      <div ref={ref}></div>
    </div>
  </div>
</div>
);
}