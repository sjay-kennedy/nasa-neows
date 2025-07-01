'use client'
import React, { useEffect, useState } from 'react';
import axios from 'axios';

function NeowsData() {
  const [data, setData] = useState(null);
  const [error, setError] = useState<unknown>(null);

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

  return (
    <div>
      <h1>API Data:</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}

export default NeowsData;