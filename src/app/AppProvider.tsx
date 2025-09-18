"use client";
import { clientSessionToken } from "@/lib/http";
import { ReactNode, useLayoutEffect } from "react";

export default function AppProvider({
  children,
  initialSessionToken = "",
}: {
  children: ReactNode;
  initialSessionToken?: string;
}) {
  useLayoutEffect(() => {
    // MEMO: Only reassigning value in client component
    if (typeof window !== undefined) {
      clientSessionToken.value = initialSessionToken;
    }
  }, [initialSessionToken]);

  return <>{children}</>;
}
