import { NextResponse } from "next/server";
import { readFileSync } from "fs";
import { join } from "path";
import { User } from "@/app/types/route";

export async function POST(req: Request) {
  try {
    console.log("Request received at /api/auth");

    const { username, password } = await req.json();
    console.log("Parsed request body:", { username, password });

    const usersFilePath = join(process.cwd(), "data/users.json");
    console.log("Resolved users.json path:", usersFilePath);

    let users: User[]; 

    try {
      const fileContents = readFileSync(usersFilePath, "utf-8");
      console.log("Read users.json contents:", fileContents);
      users = JSON.parse(fileContents) as User[]; 
    } catch (fileError) {
      console.error("Error reading users.json:", fileError);
      return NextResponse.json(
        { success: false, error: "Server configuration error. Could not load user data." },
        { status: 500 }
      );
    }

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
