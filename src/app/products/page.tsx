import productApiRequest from "@/apiRequest/product";
import ProductAddButton from "@/app/products/_components/product-add-button";
import ProductEditButton from "@/app/products/_components/product-edit-button";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export const metadata: Metadata = {
  title: "Products", // Products | My restaurant
  description: "Products page for My restaurant",
};

export default async function ProductsPage() {
  const { payload } = await productApiRequest.getList();
  const productsList = payload.data;

  return (
    <div>
      <ProductAddButton />
      <h3>Products List</h3>
      <div className="space-y-5">
        {productsList.map((product) => (
          <div key={product.id} className="flex space-x-4">
            <Link href={`/products/${product.id}`}>
              <Image
                src={product.image}
                width={200}
                height={200}
                alt={product.name}
              />
            </Link>
            <p>{product.name}</p>
            <p>${product.price}</p>
            <ProductEditButton product={product} />
          </div>
        ))}
      </div>
    </div>
  );
}
