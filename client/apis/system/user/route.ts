import { NextResponse } from "next/server";
import { UserType, UserRoleType } from "@/types/server/user";
import { hash } from "bcryptjs";

// Mock database - replace with actual database implementation
const users: UserType[] = [];

export async function GET() {
  try {
    return NextResponse.json(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    return NextResponse.json(
      { message: "Error fetching users" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { name, password, email, role } = await request.json();

    // Validate input
    if (!name || !password) {
      return NextResponse.json(
        { message: "Name and password are required" },
        { status: 400 }
      );
    }

    // Check if user already exists
    if (users.find((u) => u.name === name)) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await hash(password, 10);

    const newUser: UserType = {
      id: Date.now().toString(),
      name,
      password: hashedPassword,
      email,
      role: role || UserRoleType.USER,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    users.push(newUser);
    return NextResponse.json(newUser, { status: 201 });
  } catch (err) {
    console.error("Error creating user:", err);
    return NextResponse.json(
      { message: "Error creating user" },
      { status: 500 }
    );
  }
}
