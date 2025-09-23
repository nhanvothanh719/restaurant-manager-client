"use client";
import authApiRequest from "@/apiRequest/auth";
import { SESSION_TOKEN } from "@/constants/localStorageKeys";
import { useRouter, useSearchParams } from "next/navigation";
import React, { Suspense, useEffect } from "react";

function Logout() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const passedSessionToken = searchParams.get("sessionToken");

  useEffect(() => {
    const sessionToken = localStorage.getItem(SESSION_TOKEN);
    if (passedSessionToken === sessionToken) {
      const forceToLogout = true;
      authApiRequest
        .logoutFromNextClientToNextServer(forceToLogout)
        .then(() => router.push("/login"));
    }
  }, [passedSessionToken, router]);

  return <div>page</div>;
}

// MEMO: Component using `useSearchParams()` must be wrapped in `<Suspense></Suspense>`
export default function LogoutPage() {
  return (
    <Suspense>
      <Logout />
    </Suspense>
  );
}
