import productApiRequest from "@/apiRequest/product";
import ProductAddForm from "@/app/products/_components/product-add-form";
import { Metadata, ResolvingMetadata } from "next";
import React, { cache } from "react";

type Props = {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

// MEMO: Sử dụng cache để ngăn chặn việc API giống nhau được gọi 2 lần
// Thay vào đó gọi 1 lần rồi lưu kết quả vào cache
const getProductDetails = cache(productApiRequest.getDetails);

// MEMO: Function to generate page title using product name
export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { payload } = await getProductDetails(Number(params.id));
  const product = payload.data;
  return {
    title: `Edit ${product.name}`,
    description: product.description,
  };
}

export default async function ProductEditPage({ params }: Props) {
  let product = undefined;
  try {
    const { id } = params;
    const { payload } = await getProductDetails(Number(id));
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
