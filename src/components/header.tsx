import accountApiRequest from "@/apiRequest/account";
import ButtonLogout from "@/components/button-logout";
import { ModeToggle } from "@/components/mode-toggle";
import { cookies } from "next/headers";
import Link from "next/link";
import React from "react";

export default async function Header() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("sessionToken")?.value || "";

  let user = null;
  if (sessionToken) {
    const data = await accountApiRequest.getMe(sessionToken);
    user = data.payload.data;
  }
  return (
    <div>
      <ul className="flex gap-4">
        <li>
          <Link href={"/products"}>Products</Link>
        </li>
        {user ? (
          <>
            <li>
              <ButtonLogout />
            </li>
            <p>Welcome, {user.name}</p>
          </>
        ) : (
          <>
            <li>
              <Link href={"/login"}>Login</Link>
            </li>
            <li>
              <Link href={"/register"}>Register</Link>
            </li>
          </>
        )}
      </ul>
      <ModeToggle />
    </div>
  );
}
