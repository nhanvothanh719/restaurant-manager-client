import productApiRequest from "@/apiRequest/product";
import DeleteButton from "@/app/products/_components/delete-button";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export default async function ProductsPage() {
  const { payload } = await productApiRequest.getList();
  const productsList = payload.data;
  return (
    <div>
      <Link href={"/products/add"}>
        <Button type="button" variant={"secondary"}>
          Add product
        </Button>
      </Link>
      <h3>Products List</h3>
      <div className="space-y-5">
        {productsList.map((product) => (
          <div key={product.id} className="flex space-x-4">
            <Image
              src={product.image}
              width={200}
              height={200}
              alt={product.name}
            />
            <p>{product.name}</p>
            <p>${product.price}</p>
            <div className="flex space-x-2">
              <Link href={`/products/${product.id}`}>
                <Button type="button" variant={"link"}>
                  Edit
                </Button>
              </Link>
              <DeleteButton product={product} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
