'use client'
import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function BrowseAsteroids() {
  const [asteroids, setAsteroids] = useState([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  useEffect(() => {
  const fetchData = async () => {
    try {
      const response = await axios.get(`/api/neo?page=${page}`);
      const newAsteroids = response.data.near_earth_objects || [];
      setAsteroids(prev => page === 0 ? newAsteroids : [...prev, ...newAsteroids]);
      if (response.data.page) {
        setHasMore(response.data.page.number < response.data.page.total_pages - 1);
      } else {
        setHasMore(false); // or handle as needed
      }
      setData(response.data); // Save the whole response if you need it
    } catch (err) {
      setError(err);
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

  if (error) {
    return (
      <div>
        Error: {error instanceof Error ? error.message : String(error)}
      </div>
    );
  }
  if (!data) return <div>Loading...</div>;

  return (
    <div className="p-4 mt-8">
      <div className="flex flex-col items-center h-screen">
        <div>
          <h1>Browse Asteroids</h1>
          {/* <pre>{JSON.stringify(data, null, 2)}</pre> */}
          <ul className="list bg-base-100 rounded-box shadow-md asteroids-list">
            <li className="p-4 pb-2 text-xs opacity-60 tracking-wide">Asteroids</li>
            {asteroids.map((asteroid) => {
              const nextApproach = getNextCloseApproach(asteroid);
              return (
                <li className="list-row mb-1" key={asteroid.id}>
                  <div>
                    <img className="size-10 rounded-box" width="100" src="/img/asteroid.png" alt="Asteroid" />
                  </div>
                  <div>
                    <div>{asteroid.name}</div>
                    <div className="text-xs uppercase font-semibold opacity-60">Absolute Magnitude: {asteroid.absolute_magnitude_h}</div>
                    <div className="text-xs uppercase font-semibold opacity-60">Diameter: {asteroid.estimated_diameter.miles.estimated_diameter_max} miles</div>
                    <div className="text-xs uppercase font-semibold opacity-60"> {asteroid.is_potentially_hazardous_asteroid ? <div className="badge badge-xs badge-secondary text-gray-950 mt-2 mb-2">Threat</div> : <div className="badge badge-xs badge-neutral mt-2 mb-2">Safe</div>}</div>
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
          {hasMore && (
            <button className="btn btn-primary mt-4 mb-4" onClick={() => setPage(page + 1)}>Load More</button>
           
          )}
        </div>
      </div>
    </div>
  );
}