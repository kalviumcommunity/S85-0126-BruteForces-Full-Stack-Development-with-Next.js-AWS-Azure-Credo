import { NextResponse } from "next/server";
import { prisma } from "@/lib-1/prisma";
import redis from "@/lib-1/redis";

type UserData = {
  name: string;
  email: string;
};

// GET /api/users
export async function GET() {
  try {
    const cacheKey = "users:list";

    console.time("Users API");

    // 1️⃣ Check cache
    const cachedUsers = await redis.get(cacheKey);

    if (cachedUsers) {
      console.log("Cache Hit");
      console.timeEnd("Users API");
      return NextResponse.json(JSON.parse(cachedUsers));
    }

    // 2️⃣ Cache miss → DB fetch
    console.log("Cache Miss - Fetching from DB");
    const users = await prisma.user.findMany();

    // 3️⃣ Store in Redis (TTL = 60s)
    await redis.set(cacheKey, JSON.stringify(users), "EX", 60);

    console.timeEnd("Users API");
    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to fetch users", error },
      { status: 500 }
    );
  }
}

// POST /api/users
export async function POST(request: Request) {
  try {
    const data: UserData = await request.json();
    
    // Basic validation
    if (!data.name || !data.email) {
      return NextResponse.json(
        { success: false, message: 'Name and email are required' },
        { status: 400 }
      );
    }

    console.time('Create User API');
    
    // Create user in database
    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: 'defaultpassword123', // In production, this should be properly hashed
      },
    });

    // Invalidate cache
    await redis.del('users:list');
    
    console.timeEnd('Create User API');
    
    return NextResponse.json(user, { status: 201 });
    
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create user', error },
      { status: 500 }
    );
  }
}
