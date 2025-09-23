import { LoginResType } from "@/app/schemaValidations/auth.schema";
import { clientEnvConfigData } from "@/config";
import { isClientComponent, normalizePath } from "@/lib/utils";
import { redirect } from "next/navigation";

const UNPROCESSABLE_ENTITY_STATUS = 422;
const AUTHENTICATION_ERROR_STATUS = 401;

type UnprocessableEntityErrorPayload = {
  message: string;
  errors: {
    field: string;
    message: string;
  }[];
};

// Remove method; Add baseUrl
type CustomOptions = Omit<RequestInit, "method"> & {
  baseUrl?: string | undefined;
};

export class HttpError extends Error {
  status: number;
  payload: {
    message: string;
    [key: string]: any;
  };

  constructor({ status, payload }: { status: number; payload: any }) {
    super("HTTP Error"); // MEMO: error.message
    this.status = status;
    this.payload = payload;
  }
}

const request = async <Response>(
  method: "GET" | "POST" | "PUT" | "DELETE",
  url: string,
  options?: CustomOptions | undefined
) => {
  let body = undefined;
  if (options?.body) {
    body =
      options?.body instanceof FormData
        ? options.body
        : JSON.stringify(options.body);
  }

  const baseHeaders: Record<string, string> =
    method !== "GET" &&
    method !== "DELETE" &&
    !(options?.body instanceof FormData)
      ? {
          "Content-Type": "application/json",
        }
      : {};
  baseHeaders.Authorization = clientSessionToken.value
    ? `Bearer ${clientSessionToken.value}`
    : "";

  // MEMO: Set url of the BE server as the default base url
  // MEMO: `options.baseUrl = ''` means call to the Next.js server
  const baseUrl =
    options?.baseUrl === undefined
      ? clientEnvConfigData.NEXT_PUBLIC_API_ENDPOINT
      : options.baseUrl;

  const fullUrl = url.startsWith("/")
    ? `${baseUrl}${url}`
    : `${baseUrl}/${url}`;

  const res = await fetch(fullUrl, {
    ...options,
    headers: {
      ...baseHeaders,
      ...options?.headers,
    },
    body,
    method,
  });
  const payload: Response = await res.json();

  const data = {
    status: res.status,
    payload,
  };

  if (!res.ok) {
    if (res.status === UNPROCESSABLE_ENTITY_STATUS) {
      throw new UnprocessableEntityError(
        data as { status: 422; payload: UnprocessableEntityErrorPayload }
      );
    } else if (res.status === AUTHENTICATION_ERROR_STATUS) {
      if (isClientComponent()) {
        // Xử lý cho client component
        // Delete `sessionToken` cookie in Next server
        await fetch("/api/auth/logout", {
          method: "POST",
          body: JSON.stringify({ force: true }),
          headers: {
            ...baseHeaders,
          },
        });
        // Delete `sessionToken` value in Next client
        clientSessionToken.value = "";
        clientSessionToken.expiresAt = new Date().toISOString();
        // Full-reload page
        location.href = "/login";
      } else {
        // Xử lý cho server component
        // Bởi vì từ server component muốn gọi được BE server thì cần truyền Authorization vào header'
        const sessionToken = (options?.headers as any).Authorization.split(
          " "
        )[1];
        redirect(`/logout?sessionToken=${sessionToken}`);
      }
    } else {
      throw new HttpError(data);
    }
  }

  if (isClientComponent()) {
    if (
      ["auth/login", "auth/register"].some(
        (item) => item === normalizePath(url)
      )
    ) {
      // Set value for clientSessionToken when logging in or registering
      clientSessionToken.value = (payload as LoginResType).data.token;
      clientSessionToken.expiresAt = (payload as LoginResType).data.expiresAt;
    } else if (normalizePath(url) === "auth/logout") {
      // Delete clientSessionToken value when logging out
      clientSessionToken.value = "";
      clientSessionToken.expiresAt = new Date().toISOString();
    }
  }

  return data;
};

const http = {
  get<Response>(
    url: string,
    options?: Omit<CustomOptions, "body"> | undefined
  ) {
    return request<Response>("GET", url, options);
  },
  post<Response>(
    url: string,
    body: any,
    options?: Omit<CustomOptions, "body"> | undefined
  ) {
    return request<Response>("POST", url, { ...options, body });
  },
  put<Response>(
    url: string,
    body: any,
    options?: Omit<CustomOptions, "body"> | undefined
  ) {
    return request<Response>("PUT", url, { ...options, body });
  },
  delete<Response>(
    url: string,
    options?: Omit<CustomOptions, "body"> | undefined
  ) {
    return request<Response>("DELETE", url, options);
  },
};

export default http;

class SessionToken {
  private token = "";
  private _expiresAt = new Date().toISOString();

  // Getter
  get value() {
    return this.token;
  }
  get expiresAt() {
    return this._expiresAt;
  }

  // Setter
  set value(token: string) {
    if (!isClientComponent()) {
      // Throw error if this method is called by server component
      throw new Error("Session token cannot be set on server side");
    }
    this.token = token;
  }
  set expiresAt(expiresAt: string) {
    if (!isClientComponent()) {
      // Throw error if this method is called by server component
      throw new Error(
        "Expries at value of session token cannot be set on server side"
      );
    }
    this._expiresAt = expiresAt;
  }
}
export const clientSessionToken = new SessionToken();

export class UnprocessableEntityError extends HttpError {
  status: 422;
  payload: UnprocessableEntityErrorPayload;
  constructor({
    status,
    payload,
  }: {
    status: 422;
    payload: UnprocessableEntityErrorPayload;
  }) {
    super({ status, payload });
    this.status = status;
    this.payload = payload;
  }
}
