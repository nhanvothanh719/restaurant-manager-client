"use client";
import accountApiRequest from "@/apiRequest/account";
import { handleApiError } from "@/lib/utils";
import React, { useEffect } from "react";

export default function Profile() {
  useEffect(() => {
    const fetchRequest = async () => {
      try {
        await accountApiRequest.getMeOnClient();
      } catch (error) {
        handleApiError({ error });
      }
    };
    fetchRequest();
  }, []);
  return <div>Profile</div>;
}
