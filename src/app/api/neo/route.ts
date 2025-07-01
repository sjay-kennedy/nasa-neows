import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get("page") || 0;
    const apiKey = 'c7zuhxEoafwjxL5YbUWe682a0zWuP4QSquwKgXh6';
    const apiUrl = `https://api.nasa.gov/neo/rest/v1/neo/browse?page=${page}&api_key=${apiKey}`;

    const res = await fetch(apiUrl);
    const data = await res.json();

    return NextResponse.json(data);
}