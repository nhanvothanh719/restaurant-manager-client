import { AccountResType } from "@/app/schemaValidations/account.schema";
import http from "@/lib/http";

const accountApiRequest = {
  getMe: (sessionToken: string) =>
    http.get<AccountResType>("/account/me", {
      headers: {
        Authorization: `Bearer ${sessionToken}`,
      },
    }),
  getMeOnClient: () => http.get<AccountResType>("/account/me"),
};

export default accountApiRequest;
