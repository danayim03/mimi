import { clerkClient } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const query = req.nextUrl.searchParams.get("q")?.trim();
    if (!query || query.length < 2) return NextResponse.json([]);

    const client = await clerkClient();
    const { data: users } = await client.users.getUserList({ query, limit: 8 });

    const results = users.map((u) => ({
        id: u.id,
        firstName: u.firstName,
        lastName: u.lastName,
        username: u.username,
        imageUrl: u.imageUrl,
        email: u.emailAddresses[0]?.emailAddress ?? "",
    }));

    return NextResponse.json(results);
}
