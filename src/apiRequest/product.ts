import {
  CreateProductBodyType,
  ProductListResType,
  ProductResType,
  UpdateProductBodyType,
} from "@/app/schemaValidations/product.schema";
import http from "@/lib/http";

const productApiRequest = {
  getList: () => http.get<ProductListResType>("/products"),
  getDetails: (id: number) => http.get<ProductResType>(`/products/${id}`),
  create: (body: CreateProductBodyType) =>
    http.post<ProductResType>("/products", body),
  update: (id: number, body: UpdateProductBodyType) =>
    http.put<ProductResType>(`/products/${id}`, body),
  uploadImage: (body: FormData) =>
    http.post<{ message: string; data: string }>("/media/upload", body),
};

export default productApiRequest;
