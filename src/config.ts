import z from "zod";

const clientEnvConfigSchema = z.object({
  NEXT_PUBLIC_API_ENDPOINT: z.string(),
  NEXT_PUBLIC_APPLICATION_URL: z.string(),
});

const clientEnvConfig = clientEnvConfigSchema.safeParse({
  NEXT_PUBLIC_API_ENDPOINT: process.env.NEXT_PUBLIC_API_ENDPOINT,
  NEXT_PUBLIC_APPLICATION_URL: process.env.NEXT_PUBLIC_APPLICATION_URL,
});

if (!clientEnvConfig.success) {
  console.error(clientEnvConfig.error.issues);
  throw new Error("Có giá trị khai báo trong file .env không hợp lệ");
}

export const clientEnvConfigData = clientEnvConfig.data;
