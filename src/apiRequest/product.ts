import {
  CreateProductBodyType,
  ProductResType,
} from "@/app/schemaValidations/product.schema";
import http from "@/lib/http";

const productApiRequest = {
  get: () => http.get("/products"),
  create: (body: CreateProductBodyType) =>
    http.post<ProductResType>("/products", body),
  uploadImage: (body: FormData) =>
    http.post<{ message: string; data: string }>("/media/upload", body),
};

export default productApiRequest;
