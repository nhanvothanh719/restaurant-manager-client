import Profile from "@/app/me/profile";
import { clientEnvConfigData } from "@/config";
import { cookies } from "next/headers";
import React from "react";

// Server component
export default async function CurrentUserProfilePage() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("sessionToken");

  const result = await fetch(
    `${clientEnvConfigData.NEXT_PUBLIC_API_ENDPOINT}/account/me`,
    {
      headers: {
        Authorization: `Bearer ${sessionToken?.value}`,
      },
    }
  ).then(async (res) => {
    const payload = await res.json();
    const data = {
      status: res.status,
      payload,
    };
    if (!res.ok) {
      throw data;
    }
    return data;
  });

  return (
    <div>
      <ul>
        <li>
          <p>Email: {result.payload.data.email}</p>
        </li>
        <li>
          <p>Name: {result.payload.data.name}</p>
        </li>
      </ul>
      <Profile />
    </div>
  );
}
