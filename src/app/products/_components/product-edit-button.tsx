"use client";
import ProductDeleteButton from "@/app/products/_components/product-delete-button";
import { ProductResType } from "@/app/schemaValidations/product.schema";
import { Button } from "@/components/ui/button";
import { SESSION_TOKEN } from "@/constants/localStorageKeys";
import { isClientComponent } from "@/lib/utils";
import Link from "next/link";
import React from "react";

export default function ProductEditButton({
  product,
}: {
  product: ProductResType["data"];
}) {
  const isAuthenticated =
    isClientComponent() && Boolean(localStorage.getItem(SESSION_TOKEN));

  if (!isAuthenticated) return null;
  return (
    <>
      <Link href={`/products/edit/${product.id}`}>
        <Button type="button" variant={"link"}>
          Edit
        </Button>
      </Link>
      <ProductDeleteButton product={product} />
    </>
  );
}
