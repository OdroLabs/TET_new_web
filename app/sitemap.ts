import { MetadataRoute } from 'next';

const API_BASE = (process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000").replace(/\/+$/, "");

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://transequalitytrust.lk'; 

  const staticPages = [
    '',
    '/about',
    '/services',
    '/projects',
    '/gallery',
    '/news',
    '/booking',
    '/contact',
    '/donate',
    '/volunteer',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1.0 : 0.8,
  }));

  let dynamicEntries: MetadataRoute.Sitemap = [];
  try {
    const res = await fetch(`${API_BASE}/api/sitemap-urls`, { next: { revalidate: 3600 } });
    if (res.ok) {
      const data = await res.json();
      
      const activityEntries = (data.activities || []).map((item: { url: string; lastmod: string }) => ({
        url: `${baseUrl}${item.url}`,
        lastModified: new Date(item.lastmod),
        changeFrequency: 'weekly' as const,
        priority: 0.6,
      }));

      dynamicEntries = [...activityEntries];
    }
  } catch (err) {
    console.error("Failed to fetch sitemap data from Laravel:", err);
  }

  return [...staticPages, ...dynamicEntries];
}