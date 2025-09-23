import productApiRequest from "@/apiRequest/product";
import { Link } from "lucide-react";
import Image from "next/image";
import React from "react";

export default async function ProductDetailsPage({
  params,
}: {
  params: {
    id: string;
  };
}) {
  let product = undefined;
  try {
    const { id } = params;
    const { payload } = await productApiRequest.getDetails(Number(id));
    product = payload.data;
  } catch (error) {
    console.error(error);
  }

  if (!product) {
    return (
      <div>
        <p>Product not found!</p>
      </div>
    );
  }

  return (
    <div>
      <h3>Product: {product.name}</h3>
      <div key={product.id} className="flex flex-col gap-4">
        <Image
          src={product.image}
          width={200}
          height={200}
          alt={product.name}
        />
        <p>{product.name}</p>
        <p>${product.price}</p>
      </div>
    </div>
  );
}
