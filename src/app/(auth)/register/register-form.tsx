"use client";
import authApiRequest from "@/apiRequest/auth";
import {
  RegisterBody,
  RegisterBodyType,
} from "@/app/schemaValidations/auth.schema";
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
import { handleApiError } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { FieldErrors, useForm } from "react-hook-form";
import { toast } from "sonner";

export default function RegisterForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm<RegisterBodyType>({
    resolver: zodResolver(RegisterBody),
    defaultValues: {
      email: "",
      name: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: RegisterBodyType) => {
    if (loading) return;
    setLoading(true);
    try {
      const result = await authApiRequest.register(values);

      // Call Next server API to set sessionToken cookie (for using in server component)
      await authApiRequest.setSession({
        sessionToken: result.payload.data.token,
        expiresAt: result.payload.data.expiresAt,
      });

      toast.success(`${result.payload.message}`);
      router.push("/me");
    } catch (error: any) {
      handleApiError({ error, setError: form.setError });
    } finally {
      setLoading(false);
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
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
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
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm password</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="!mt-5 w-full" disabled={loading}>
          Register
        </Button>
      </form>
    </Form>
  );
}
