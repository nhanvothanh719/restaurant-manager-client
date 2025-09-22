import productApiRequest from "@/apiRequest/product";
import ProductAddForm from "@/app/products/_components/product-add-form";
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
    const { id } = await params;
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
      <h3>{product.name}</h3>
      <ProductAddForm product={product} />
    </div>
  );
}
