"use client";
import { AccountResType } from "@/app/schemaValidations/account.schema";
import { USER } from "@/constants/localStorageKeys";
import { useRouter } from "next/navigation";
import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

type User = AccountResType["data"];

const AppContext = createContext<{
  user: User | null;
  setUser: (user: User | null) => void;
  isAuthenticated: boolean;
}>({ user: null, setUser: () => {}, isAuthenticated: false });
export const useAppContext = () => {
  const context = useContext(AppContext);
  return context;
};

export default function AppProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [user, setUserInState] = useState<User | null>(null);

  useEffect(() => {
    const savedUserInfo = localStorage.getItem(USER);
    if (savedUserInfo) {
      setUserInState(JSON.parse(savedUserInfo));
    } else {
      router.push("/login"); // Redirect if no user
    }
  }, [router, setUserInState]);

  const setUser = useCallback(
    (user: User | null) => {
      setUserInState(user);
      localStorage.setItem(USER, JSON.stringify(user));
    },
    [setUserInState]
  );

  const isAuthenticated = Boolean(user);
  return (
    <AppContext.Provider value={{ user, setUser, isAuthenticated }}>
      {children}
    </AppContext.Provider>
  );
}
