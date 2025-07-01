import { NextResponse } from "next/server";

interface NeoBrowseRequest extends Request {}

interface NeoBrowseResponse {
    links: {
        next: string;
        prev: string;
        self: string;
    };
    page: {
        size: number;
        total_elements: number;
        total_pages: number;
        number: number;
    };
    near_earth_objects: Array<Record<string, unknown>>;
}

export async function GET(request: NeoBrowseRequest): Promise<NextResponse<NeoBrowseResponse>> {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get("page") || 0;
    const apiKey = 'c7zuhxEoafwjxL5YbUWe682a0zWuP4QSquwKgXh6';
    const apiUrl = `https://api.nasa.gov/neo/rest/v1/neo/browse?page=${page}&api_key=${apiKey}`;

    const res = await fetch(apiUrl);
    const data: NeoBrowseResponse = await res.json();

    return NextResponse.json(data);
}