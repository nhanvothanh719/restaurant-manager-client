"use client";
import { AccountResType } from "@/app/schemaValidations/account.schema";
import { clientSessionToken } from "@/lib/http";
import { isClientComponent } from "@/lib/utils";
import {
  ReactNode,
  useLayoutEffect,
  createContext,
  useContext,
  useState,
} from "react";

type User = AccountResType["data"];

const AppContext = createContext<{
  user: User | null;
  setUser: (user: User | null) => void;
}>({ user: null, setUser: () => {} });
export const useAppContext = () => {
  const context = useContext(AppContext);
  return context;
};

export default function AppProvider({
  children,
  initialSessionToken = "",
  user: userProp,
}: {
  children: ReactNode;
  initialSessionToken?: string;
  user: AccountResType["data"] | null;
}) {
  const [user, setUser] = useState<User | null>(userProp);

  useLayoutEffect(() => {
    // MEMO: Only reassigning value in client component
    if (isClientComponent()) {
      clientSessionToken.value = initialSessionToken;
    }
  }, [initialSessionToken]);

  return (
    <AppContext.Provider value={{ user, setUser }}>
      {children}
    </AppContext.Provider>
  );
}
