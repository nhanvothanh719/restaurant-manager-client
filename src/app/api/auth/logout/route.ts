import authApiRequest from "@/apiRequest/auth";
import { HttpError } from "@/lib/http";
import { cookies } from "next/headers";

// POST: /api/auth/set-session
export async function POST(request: Request) {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("sessionToken")?.value;
  if (!sessionToken) {
    return Response.json({ message: "Missing session token" }, { status: 400 });
  }

  try {
    const result = await authApiRequest.logoutFromNextServerToBackendServer(
      sessionToken
    );

    return Response.json(result.payload, {
      status: 200,
      headers: {
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
