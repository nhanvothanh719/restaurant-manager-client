import {
  LoginBodyType,
  LoginResType,
  RegisterBodyType,
  RegisterResType,
  SlideSessionResType,
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
  slideSessionFromNextServerToBackendServer: (sessionToken: string) =>
    http.post<SlideSessionResType>(
      "/auth/slide-session",
      {},
      {
        headers: {
          Authorization: `Bearer ${sessionToken}`,
        },
      }
    ),
  // Call to Next server
  setSession: (body: { sessionToken: string; expiresAt: string }) =>
    http.post("/api/auth/set-session", body, {
      baseUrl: "",
    }),
  logoutFromNextClientToNextServer: (
    force: boolean | undefined = undefined
  ) => {
    return http.post<MessageResType>(
      "/api/auth/logout",
      {
        force,
      },
      {
        baseUrl: "",
      }
    );
  },
  slideSessionFromNextClientToNextServer: () =>
    http.post<SlideSessionResType>(
      "/api/auth/slide-session",
      {},
      {
        baseUrl: "",
      }
    ),
};

export default authApiRequest;
