"use client";
import { useAppContext } from "@/app/AppProvider";
import { clientEnvConfigData } from "@/config";
import React, { useEffect } from "react";

export default function Profile() {
  const { sessionToken } = useAppContext();

  useEffect(() => {
    const fetchRequest = async () => {
      const result = await fetch(
        `${clientEnvConfigData.NEXT_PUBLIC_API_ENDPOINT}/account/me`,
        {
          headers: {
            Authorization: `Bearer ${sessionToken}`,
          },
        }
      ).then(async (res) => {
        const payload = await res.json();
        const data = {
          status: res.status,
          payload,
        };
        if (!res.ok) {
          throw data;
        }
        return data;
      });
    };
    fetchRequest();
  }, [sessionToken]);
  return <div>Profile</div>;
}
