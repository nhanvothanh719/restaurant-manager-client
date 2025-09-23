import { AccountResType } from "@/app/schemaValidations/account.schema";
import ButtonLogout from "@/components/button-logout";
import { ModeToggle } from "@/components/mode-toggle";
import Link from "next/link";
import React from "react";

export default function Header({
  user,
}: {
  user: AccountResType["data"] | null;
}) {
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
            <span>Welcome, {user.name}</span>
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
