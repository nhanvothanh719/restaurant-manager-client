import productApiRequest from "@/apiRequest/product";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import React from "react";

export default async function ProductsPage() {
  const { payload } = await productApiRequest.getList();
  const productsList = payload.data;
  return (
    <div>
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
              <Button type="button" variant={"secondary"}>
                Edit
              </Button>
              <Button type="button" variant={"destructive"}>
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
