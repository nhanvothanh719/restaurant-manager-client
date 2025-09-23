"use client";
import { Button } from "@/components/ui/button";
import { SESSION_TOKEN } from "@/constants/localStorageKeys";
import { isClientComponent } from "@/lib/utils";
import Link from "next/link";
import React from "react";

export default function ProductAddButton() {
  const isAuthenticated = isClientComponent() && Boolean(localStorage.getItem(SESSION_TOKEN));

  if (!isAuthenticated) return null;
  return (
    <Link href={"/products/add"}>
      <Button type="button" variant={"secondary"}>
        Add product
      </Button>
    </Link>
  );
}
