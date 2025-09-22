import productApiRequest from "@/apiRequest/product";
import React from "react";

export default async function ProductDetailsPage({
  params,
}: {
  params: {
    id: string;
  };
}) {
  let product = null;
  try {
    const { payload } = await productApiRequest.getDetails(Number(params.id));
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

  return <div>{product.name}</div>;
}
