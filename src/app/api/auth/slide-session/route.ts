import authApiRequest from "@/apiRequest/auth";
import { HttpError } from "@/lib/http";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

// POST: /api/auth/slide-session
export async function POST() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("sessionToken");

  if (!sessionToken) {
    return Response.json({ message: "Missing session token" }, { status: 401 });
  }

  try {
    const res = await authApiRequest.slideSessionFromNextServerToBackendServer(
      sessionToken?.value
    );
    const newExpiresAt = new Date(res.payload.data.expiresAt);

    const response = NextResponse.json(res.payload, { status: 200 });
    response.cookies.set({
      name: "sessionToken",
      value: sessionToken.value,
      httpOnly: true,
      sameSite: "lax",
      secure: true,
      path: "/",
      expires: newExpiresAt,
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
