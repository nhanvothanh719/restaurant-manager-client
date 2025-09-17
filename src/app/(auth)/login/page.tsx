import LoginForm from "@/app/(auth)/login/login-form";
import React from "react";

export default function LoginPage() {
  return (
    <div>
      <h3 className="text-xl font-semibold text-center">Login</h3>
      <div className="flex justify-center">
        <LoginForm />
      </div>
    </div>
  );
}
