"use client";
import { useAppContext } from "@/app/AppProvider";
import { LoginBody, LoginBodyType } from "@/app/schemaValidations/auth.schema";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { clientEnvConfigData } from "@/config";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { FieldErrors, useForm } from "react-hook-form";
import { toast } from "sonner";

export default function LoginForm() {
  const { setSessionToken } = useAppContext();

  const form = useForm<LoginBodyType>({
    resolver: zodResolver(LoginBody),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginBodyType) => {
    try {
      const result = await fetch(
        `${clientEnvConfigData.NEXT_PUBLIC_API_ENDPOINT}/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        }
      ).then(async (res) => {
        const payload = await res.json();
        const data = {
          status: res.status,
          payload,
        };
        if (!res.ok) {
          // MEMO: This error will be caught in `catch` block
          throw data;
        }
        return data;
      });

      toast.success(`${result.payload.message}`);

      // Call Next server API to set sessionToken cookie (for using in server component)
      const resultFromNextServer = await fetch("/api/auth/set-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(result),
      }).then(async (res) => {
        const payload = await res.json();
        const data = {
          status: res.status,
          payload,
        };
        if (!res.ok) {
          // MEMO: This error will be caught in `catch` block
          throw data;
        }
        return data;
      });

      // Set sessionToken to Context API (for using in client component)
      setSessionToken(resultFromNextServer.payload.data.token);
    } catch (err: any) {
      console.error(err);

      const errors = err.payload.errors as {
        field: string;
        message: string;
      }[];
      const status = err.status as number;
      if (status === 422) {
        errors.forEach((error) => {
          form.setError(error.field as "email" | "password", {
            type: "server",
            message: error.message,
          });
        });
      } else {
        toast.error(`${err.payload.message}`);
      }
    }
  };

  const onSubmitError = (error: FieldErrors) => {
    console.error(">>> Error in registration process: ", error);
  };

  return (
    <Form {...form}>
      <form
        noValidate
        className="space-y-2 max-w-[400px] w-full"
        onSubmit={form.handleSubmit(onSubmit, (error) => onSubmitError(error))}
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="!mt-5 w-full">
          Login
        </Button>
      </form>
    </Form>
  );
}
