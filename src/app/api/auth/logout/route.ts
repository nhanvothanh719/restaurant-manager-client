import authApiRequest from "@/apiRequest/auth";
import { HttpError } from "@/lib/http";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

// POST: /api/auth/set-session
export async function POST(request: Request) {
  const req = await request.json();
  // Determine if force to logout
  const force = req.force as boolean | undefined;
  if (force) {
    const response = NextResponse.json(
      {
        message: "Force to logout successfully",
      },
      { status: 200 }
    );
    response.cookies.set({
      name: "sessionToken",
      value: "",
      path: "/",
      httpOnly: true,
      maxAge: 0,
    });
    return response;
  }

  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("sessionToken")?.value;
  if (!sessionToken) {
    return Response.json({ message: "Missing session token" }, { status: 400 });
  }

  try {
    const result = await authApiRequest.logoutFromNextServerToBackendServer(
      sessionToken
    );

    // Delete `sessionToken` cookie
    const response = NextResponse.json(result.payload, { status: 200 });
    response.cookies.set({
      name: "sessionToken",
      value: "",
      path: "/",
      httpOnly: true,
      maxAge: 0,
    });
    return response;
  } catch (error) {
    if (error instanceof HttpError) {
      return Response.json(error.payload, {
        status: error.status,
      });
    } else {
      return Response.json(
        {
          message: "Error in logging out",
        },
        { status: 500 }
      );
    }
  }
}
