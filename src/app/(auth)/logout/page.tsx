"use client";
import authApiRequest from "@/apiRequest/auth";
import { clientSessionToken } from "@/lib/http";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect } from "react";

export default function LogoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const passedSessionToken = searchParams.get("sessionToken");

  useEffect(() => {
    if (passedSessionToken === clientSessionToken.value) {
      const forceToLogout = true;
      authApiRequest
        .logoutFromNextClientToNextServer(forceToLogout)
        .then(() => router.push("/login"));
    }
  }, [passedSessionToken, router]);

  return <div>page</div>;
}
