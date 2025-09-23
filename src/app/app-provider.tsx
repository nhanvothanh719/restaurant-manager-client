"use client";
import { AccountResType } from "@/app/schemaValidations/account.schema";
import { ReactNode, createContext, useContext, useState } from "react";

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
  user: userProp,
}: {
  children: ReactNode;
  user: AccountResType["data"] | null;
}) {
  const [user, setUser] = useState<User | null>(userProp);

  return (
    <AppContext.Provider value={{ user, setUser }}>
      {children}
    </AppContext.Provider>
  );
}
