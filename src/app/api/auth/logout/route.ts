import authApiRequest from "@/apiRequest/auth";
import { HttpError } from "@/lib/http";
import { cookies } from "next/headers";

// POST: /api/auth/set-session
export async function POST(request: Request) {
  const req = await request.json();
  // Determine if force to logout
  const force = req.force as boolean | undefined;
  if (force) {
    return Response.json(
      {
        message: "Force to logout successfully",
      },
      {
        status: 200,
        headers: {
          // Delete `sessionToken` cookie in server component
          "Set-Cookie": `sessionToken=; Path=/; HttpOnly; Max-Age=0`,
        },
      }
    );
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
    return Response.json(result.payload, {
      status: 200,
      headers: {
        // Delete `sessionToken` cookie in server component
        "Set-Cookie": `sessionToken=; Path=/; HttpOnly; Max-Age=0`,
      },
    });
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
