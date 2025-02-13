/* import { NextResponse } from 'next/server';
import { readFileSync } from 'fs';
import { join } from 'path';

export async function POST(req: Request) {
  try {
    console.log('Request received at /api/auth');

    // Step 1: Parse the request body
    const { username, password } = await req.json();
    console.log('Parsed request body:', { username, password });

    // Step 2: Define the path to users.json
    const usersFilePath = join(process.cwd(), 'data/users.json');
    console.log('Resolved users.json path:', usersFilePath);

    // Step 3: Read and parse the users.json file
    let users;
    try {
      const fileContents = readFileSync(usersFilePath, 'utf-8');
      console.log('Read users.json contents:', fileContents);
      users = JSON.parse(fileContents);
    } catch (fileError) {
      console.error('Error reading users.json:', fileError);
      return NextResponse.json(
        { success: false, error: 'Server configuration error. Could not load user data.' },
        { status: 500 }
      );
    }

    // Step 4: Validate credentials
    if (username === users.username && password === users.password) {
      console.log('Credentials validated successfully');
      return NextResponse.json({ success: true });
    }

    console.log('Invalid credentials provided');
    return NextResponse.json(
      { success: false, error: 'Invalid credentials' },
      { status: 401 }
    );
  } catch (error) {
    console.error('Unhandled error in /api/auth route:', error);
    return NextResponse.json(
      { success: false, error: 'An unexpected server error occurred.' },
      { status: 500 }
    );
  }
}
 */

import { NextResponse } from "next/server";
import { readFileSync } from "fs";
import { join } from "path";

// ✅ Define a User interface for TypeScript type safety
interface User {
  username: string;
  password: string; // Consider hashing passwords using bcrypt for security
}

export async function POST(req: Request) {
  try {
    console.log("Request received at /api/auth");

    // Step 1: Parse the request body
    const { username, password } = await req.json();
    console.log("Parsed request body:", { username, password });

    // Step 2: Define the path to users.json
    const usersFilePath = join(process.cwd(), "data/users.json");
    console.log("Resolved users.json path:", usersFilePath);

    // Step 3: Read and parse the users.json file
    let users: User[]; // ✅ Explicitly define type as an array of User

    try {
      const fileContents = readFileSync(usersFilePath, "utf-8");
      console.log("Read users.json contents:", fileContents);
      users = JSON.parse(fileContents) as User[]; // ✅ Cast as User[]
    } catch (fileError) {
      console.error("Error reading users.json:", fileError);
      return NextResponse.json(
        { success: false, error: "Server configuration error. Could not load user data." },
        { status: 500 }
      );
    }

    // Step 4: Validate credentials (Now supports multiple users)
    const user = users.find((u: User) => u.username === username && u.password === password);

    if (user) {
      console.log("User authenticated:", username);
      return NextResponse.json({ success: true });
    }

    console.log("Invalid credentials provided");
    return NextResponse.json(
      { success: false, error: "Invalid credentials" },
      { status: 401 }
    );
  } catch (error) {
    console.error("Unhandled error in /api/auth route:", error);
    return NextResponse.json(
      { success: false, error: "An unexpected server error occurred." },
      { status: 500 }
    );
  }
}
