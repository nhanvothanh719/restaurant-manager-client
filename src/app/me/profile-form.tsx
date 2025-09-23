"use client";
import accountApiRequest from "@/apiRequest/account";
import {
  AccountResType,
  UpdateMeBody,
  UpdateMeBodyType,
} from "@/app/schemaValidations/account.schema";
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

type Profile = AccountResType["data"];

export default function ProfileForm({ profile }: { profile: Profile }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm<UpdateMeBodyType>({
    resolver: zodResolver(UpdateMeBody),
    defaultValues: {
      name: profile.name,
    },
  });

  const onSubmit = async (values: UpdateMeBodyType) => {
    if (loading) return;
    setLoading(true);
    try {
      const result = await accountApiRequest.updateMe(values);

      toast.success(`${result.payload.message}`);
      // Refresh current page
      router.refresh();
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
        <FormItem>
          <FormLabel>Email</FormLabel>
          <FormControl>
            <Input type="email" value={profile.email} readOnly />
          </FormControl>
          <FormMessage />
        </FormItem>

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input type="text" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="!mt-5 w-full" disabled={loading}>
          Update
        </Button>
      </form>
    </Form>
  );
}
