// TODO: need to implement the actual database implementation
import { NextResponse } from "next/server";
import { UserType, UserRoleType } from "@/types/server/user";

// Mock database - replace with actual database implementation
const users: UserType[] = [];

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const { name, email, role } = await request.json();

    const userIndex = users.findIndex((u) => u.id === id);
    if (userIndex === -1) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Don't allow updating superadmin
    if (users[userIndex].role === UserRoleType.SUPERADMIN) {
      return NextResponse.json(
        { message: "Cannot modify superadmin" },
        { status: 403 }
      );
    }

    users[userIndex] = {
      ...users[userIndex],
      name: name || users[userIndex].name,
      email: email || users[userIndex].email,
      role: role || users[userIndex].role,
      updatedAt: Date.now(),
    };

    return NextResponse.json(users[userIndex]);
  } catch (err) {
    console.error("Error updating user:", err);
    return NextResponse.json(
      { message: "Error updating user" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const userIndex = users.findIndex((u) => u.id === id);
    if (userIndex === -1) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Don't allow deleting superadmin
    if (users[userIndex].role === UserRoleType.SUPERADMIN) {
      return NextResponse.json(
        { message: "Cannot delete superadmin" },
        { status: 403 }
      );
    }

    users.splice(userIndex, 1);
    return new NextResponse(null, { status: 204 });
  } catch (err) {
    console.error("Error deleting user:", err);
    return NextResponse.json(
      { message: "Error deleting user" },
      { status: 500 }
    );
  }
}
