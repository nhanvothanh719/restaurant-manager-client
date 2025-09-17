"use client";
import { useRouter } from "next/navigation";
import React from "react";

const ButtonRedirect = () => {
  const router = useRouter();

  const handleNavigate = () => {
    router.push("/users");
  };

  return (
    <button type="button" onClick={handleNavigate}>
      User
    </button>
  );
};

export default ButtonRedirect;
