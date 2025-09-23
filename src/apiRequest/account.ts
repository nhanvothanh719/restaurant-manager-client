import {
  AccountResType,
  UpdateMeBodyType,
} from "@/app/schemaValidations/account.schema";
import http from "@/lib/http";

const accountApiRequest = {
  // Call API from BE server to server component
  getMe: (sessionToken: string) =>
    http.get<AccountResType>("/account/me", {
      headers: {
        Authorization: `Bearer ${sessionToken}`,
      },
    }),
  // Call API from client component to BE server (MEMO: `sessionToken`` is handled by `http`)
  getMeOnClient: () => http.get<AccountResType>("/account/me"),
  updateMe: (body: UpdateMeBodyType) =>
    http.put<AccountResType>("/account/me", body),
};

export default accountApiRequest;
