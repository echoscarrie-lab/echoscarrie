import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://echoscarrie.com/",
      lastModified: new Date("2026-07-12T00:00:00+08:00"),
      changeFrequency: "weekly",
      priority: 1,
    },
  ];
}
