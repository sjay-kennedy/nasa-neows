import { NextResponse } from "next/server";

const apiKey = 'c7zuhxEoafwjxL5YbUWe682a0zWuP4QSquwKgXh6'; // replace with your key
export async function GET() {
  const apiUrl = `https://api.nasa.gov/neo/rest/v1/neo/browse?api_key=${apiKey}`;
  const res = await fetch(apiUrl);
  const data = await res.json();
  
  return NextResponse.json(data);
}