import { LoginResType } from "@/app/schemaValidations/auth.schema";
import { clientEnvConfigData } from "@/config";
import { normalizePath } from "@/lib/utils";

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

// Remove method; Add baseUrl
type CustomOptions = Omit<RequestInit, "method"> & {
  baseUrl?: string | undefined;
};

const request = async <Response>(
  method: "GET" | "POST" | "PUT" | "DELETE",
  url: string,
  options?: CustomOptions | undefined
) => {
  const body = options?.body ? JSON.stringify(options.body) : undefined;

  const baseHeaders: Record<string, string> =
    method !== "GET" && method !== "DELETE"
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
    } else {
      throw new HttpError(data);
    }
  }

  if (typeof window !== undefined) {
    // This logic is only applied to client component
    if (
      ["auth/login", "auth/register"].some(
        (item) => item === normalizePath(url)
      )
    ) {
      // Set value for clientSessionToken when logging in or registering
      clientSessionToken.value = (payload as LoginResType).data.token;
    } else if (normalizePath(url) === "auth/logout") {
      // Delete clientSessionToken value when logging out
      clientSessionToken.value = "";
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

  // Getter
  get value() {
    return this.token;
  }

  // Setter
  set value(token: string) {
    if (typeof window === undefined) {
      // Throw error if this method is called by server component
      throw new Error("Session token cannot be set on server side");
    }
    this.token = token;
  }
}
export const clientSessionToken = new SessionToken();

const UNPROCESSABLE_ENTITY_STATUS = 422;

type UnprocessableEntityErrorPayload = {
  message: string;
  errors: {
    field: string;
    message: string;
  }[];
};

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
