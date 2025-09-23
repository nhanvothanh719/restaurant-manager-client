import { clientEnvConfigData } from "@/config";
import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*", // Googlebot, Applebot, Bingbot, ...
      allow: "/",
      disallow: "/me/",
    },
    sitemap: `${clientEnvConfigData.NEXT_PUBLIC_APPLICATION_URL}/sitemap.xml`,
  };
}
