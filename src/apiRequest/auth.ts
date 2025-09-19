import {
  LoginBodyType,
  LoginResType,
  RegisterBodyType,
  RegisterResType,
} from "@/app/schemaValidations/auth.schema";
import { MessageResType } from "@/app/schemaValidations/common.schema";
import http from "@/lib/http";

const authApiRequest = {
  // Call to BE server
  login: (body: LoginBodyType) => http.post<LoginResType>("/auth/login", body),
  register: (body: RegisterBodyType) =>
    http.post<RegisterResType>("/auth/register", body),
  logoutFromNextServerToBackendServer: (sessionToken: string) =>
    http.post<MessageResType>(
      "/auth/logout",
      {},
      {
        headers: {
          Authorization: `Bearer ${sessionToken}`,
        },
      }
    ),
  // Call to Next server
  setSession: (body: { sessionToken: string }) =>
    http.post("/api/auth/set-session", body, {
      baseUrl: "",
    }),
  logoutFromNextClientToNextServer: () =>
    http.post<MessageResType>(
      "/api/auth/logout",
      {},
      {
        baseUrl: "",
      }
    ),
};

export default authApiRequest;
