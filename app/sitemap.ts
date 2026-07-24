import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://echoscarrie.com/",
      lastModified: new Date("2026-07-23T00:00:00+08:00"),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: "https://echoscarrie.com/candy-cottage/",
      lastModified: new Date("2026-07-23T00:00:00+08:00"),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: "https://echoscarrie.com/nobody/",
      lastModified: new Date("2026-07-24T00:00:00+08:00"),
      changeFrequency: "monthly",
      priority: 0.9,
    },
  ];
}
