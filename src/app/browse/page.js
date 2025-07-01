'use client'
import React, { useEffect, useState } from 'react';
import axios from 'axios';

function NeowsData() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Call Next.js API route
        const response = await axios.get('/api/neo');
        setData(response.data);
      } catch (err) {
        setError(err);
      }
    };

    fetchData();
  }, []);

  if (error) {
    return (
      <div>
        Error: {error instanceof Error ? error.message : String(error)}
      </div>
    );
  }
  if (!data) return <div>Loading...</div>;
  const asteroids = data?.near_earth_objects || [];

  function getNextCloseApproach(asteroid) {
    if (!asteroid.close_approach_data || asteroid.close_approach_data.length === 0) return null;

    const today = new Date();
    // Filter for future dates
    const futureApproaches = asteroid.close_approach_data.filter(entry => {
        const date = new Date(entry.close_approach_date);
        return date >= today;
    });

    // Find the soonest future date
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
                            <div className="text-xs uppercase font-semibold opacity-60"> Threat Level: {asteroid.is_potentially_hazardous_asteroid ? "Hazardous" : "Safe"}</div>
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


            </div>
          </div>
      </div>
    
    
  );
}

export default NeowsData;