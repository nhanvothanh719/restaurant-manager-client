"use client";
import productApiRequest from "@/apiRequest/product";
import {
  CreateProductBody,
  CreateProductBodyType,
} from "@/app/schemaValidations/product.schema";
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
import { Textarea } from "@/components/ui/textarea";
import { handleApiError } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useRef, useState } from "react";
import { FieldErrors, useForm } from "react-hook-form";
import { toast } from "sonner";

export default function ProductAddForm() {
  const imgInputRef = useRef<HTMLInputElement | null>(null);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [imgFile, setImgFile] = useState<File | null>(null);

  const form = useForm<CreateProductBodyType>({
    resolver: zodResolver(CreateProductBody),
    defaultValues: {
      name: "",
      price: 0,
      description: "",
      image: "",
    },
  });

  const onSubmit = async (values: CreateProductBodyType) => {
    if (loading) return;
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", imgFile as Blob);
      const uploadImageResult = await productApiRequest.uploadImage(formData);
      const imageUrl = uploadImageResult.payload.data;

      const result = await productApiRequest.create({
        ...values,
        image: imageUrl,
      });

      toast.success(`${result.payload.message}`);
      router.push("/products");
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
                <Input type="text" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price</FormLabel>
              <FormControl>
                <Input type="number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image</FormLabel>
              <FormControl>
                <Input
                  ref={imgInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    setImgFile(file);
                    // Add `http://localhost:3000/` just to pass Zod validation
                    field.onChange(`http://localhost:3000/${file.name}`);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {imgFile && (
          <div>
            <Image
              src={URL.createObjectURL(imgFile)}
              width={128}
              height={128}
              className="w-32 h-32 object-cover"
              alt="Preview user avatar"
            />
            <Button
              type="button"
              variant={"destructive"}
              size={"sm"}
              onClick={() => {
                setImgFile(null);
                form.setValue("image", "");
                if (imgInputRef.current) imgInputRef.current.value = "";
              }}
            >
              Delete image
            </Button>
          </div>
        )}
        <Button type="submit" className="!mt-5 w-full" disabled={loading}>
          Add
        </Button>
      </form>
    </Form>
  );
}
