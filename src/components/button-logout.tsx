"use client";
import authApiRequest from "@/apiRequest/auth";
import { Button } from "@/components/ui/button";
import { handleApiError } from "@/lib/utils";
import { useRouter } from "next/navigation";
import React from "react";

export default function ButtonLogout() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await authApiRequest.logoutFromNextClientToNextServer();
      router.push("/login");
    } catch (error) {
      handleApiError({ error });
    }
  };
  return (
    <Button size={"sm"} onClick={handleLogout}>
      Logout
    </Button>
  );
}
