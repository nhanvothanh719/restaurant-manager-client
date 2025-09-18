import { AccountResType } from "@/app/schemaValidations/account.schema";
import http from "@/lib/http";

const accountApiRequest = {
  // Call API from BE server from server component
  getMe: (sessionToken: string) =>
    http.get<AccountResType>("/account/me", {
      headers: {
        Authorization: `Bearer ${sessionToken}`,
      },
    }),
  // Call API from BE server from client component (sessionToken is handled by `http`)
  getMeOnClient: () => http.get<AccountResType>("/account/me"),
};

export default accountApiRequest;
