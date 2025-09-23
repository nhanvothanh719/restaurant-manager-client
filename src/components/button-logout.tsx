"use client";
import authApiRequest from "@/apiRequest/auth";
import { useAppContext } from "@/app/app-provider";
import { Button } from "@/components/ui/button";
import {
  SESSION_TOKEN,
  SESSION_TOKEN_EXPIRES_AT,
} from "@/constants/localStorageKeys";
import { handleApiError } from "@/lib/utils";
import { useRouter } from "next/navigation";
import React from "react";

export default function ButtonLogout() {
  const router = useRouter();
  const { setUser } = useAppContext();

  const handleLogout = async () => {
    try {
      await authApiRequest.logoutFromNextClientToNextServer();
      router.push("/login");
    } catch (error) {
      handleApiError({ error });
      await authApiRequest
        .logoutFromNextClientToNextServer(true)
        .then(() => router.push("/login"));
    } finally {
      setUser(null);
      router.refresh();
      localStorage.removeItem(SESSION_TOKEN);
      localStorage.removeItem(SESSION_TOKEN_EXPIRES_AT);
    }
  };
  return (
    <Button size={"sm"} onClick={handleLogout}>
      Logout
    </Button>
  );
}
