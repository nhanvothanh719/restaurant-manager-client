import { UnprocessableEntityError } from "@/lib/http";
import { clsx, type ClassValue } from "clsx";
import { UseFormSetError } from "react-hook-form";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const handleApiError = ({
  error,
  setError,
  toastDuration,
}: {
  error: any;
  setError?: UseFormSetError<any>;
  toastDuration?: number;
}) => {
  console.error(error);

  if (error instanceof UnprocessableEntityError && setError) {
    error.payload.errors.forEach((err) => {
      setError(err.field as "email" | "password", {
        type: "server",
        message: err.message,
      });
    });
  } else {
    toast.error(`${error.payload.message}`, { duration: toastDuration });
  }
};

/**
 * 
 * @param path 
 * Ex: `/login` -> `login`
 */
export const normalizePath = (path: string): string => {
  return path.startsWith("/") ? path.slice(1) : path;
};
