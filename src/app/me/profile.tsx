"use client";
import accountApiRequest from "@/apiRequest/account";
import { useAppContext } from "@/app/AppProvider";
import React, { useEffect } from "react";

export default function Profile() {
  const { sessionToken } = useAppContext();

  useEffect(() => {
    const fetchRequest = async () => {
      await accountApiRequest.getMe(sessionToken);
    };
    fetchRequest();
  }, [sessionToken]);
  return <div>Profile</div>;
}
