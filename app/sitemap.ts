import type { MetadataRoute } from "next";
import { categoryHref, getActiveCategories, getPublishedProductsLive } from "@/lib/products";
import { SITE } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const categoryRoutes = getActiveCategories()
    .map((category) => categoryHref(category.slug))
    .filter((path) => !path.includes("?"));
  const routes = ["", "/ofertas", ...categoryRoutes, "/como-funciona", "/transparencia", "/privacidade", "/termos"];
  return [
    ...routes.map((path) => ({
      url: `${SITE.url}${path}`,
      changeFrequency: "daily" as const,
      priority: path === "" ? 1 : 0.8,
    })),
    ...(await getPublishedProductsLive()).map((product) => ({
      url: `${SITE.url}/produto/${product.slug}`,
      changeFrequency: "daily" as const,
      priority: 0.7,
    })),
  ];
}
