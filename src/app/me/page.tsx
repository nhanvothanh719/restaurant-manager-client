import accountApiRequest from "@/apiRequest/account";
import ProfileForm from "@/app/me/profile-form";
import { cookies } from "next/headers";
import React from "react";

// Server component
export default async function CurrentUserProfilePage() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("sessionToken");

  const result = await accountApiRequest.getMe(sessionToken?.value || "");
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
      <ProfileForm profile={result.payload.data} />
    </div>
  );
}
