import {
  LoginBodyType,
  LoginResType,
  RegisterBodyType,
  RegisterResType,
} from "@/app/schemaValidations/auth.schema";
import http from "@/lib/http";

const authApiRequest = {
  // Call to BE server
  login: (body: LoginBodyType) => http.post<LoginResType>("/auth/login", body),
  register: (body: RegisterBodyType) =>
    http.post<RegisterResType>("/auth/register", body),
  // Call to Next server
  setSession: (body: { sessionToken: string }) =>
    http.post("/api/auth/set-session", body, {
      baseUrl: "",
    }),
};

export default authApiRequest;
