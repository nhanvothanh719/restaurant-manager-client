"use client";
import accountApiRequest from "@/apiRequest/account";
import React, { useEffect } from "react";

export default function Profile() {
  useEffect(() => {
    const fetchRequest = async () => {
      await accountApiRequest.getMeOnClient();
    };
    fetchRequest();
  }, []);
  return <div>Profile</div>;
}
