import type { MetadataRoute } from 'next';
import { getSettings, siteUrl, API_BASE } from './lib/cms';

export default async function robots(): Promise<MetadataRoute.Robots> {
  const s = await getSettings();
  const baseUrl = siteUrl(s);

  // Admin → Site Status → "Hide from search engines": block all crawling (live, not cached)
  let hidden = false;
  try {
    const res = await fetch(`${API_BASE}/api/site-status`, { cache: 'no-store' });
    if (res.ok) hidden = Boolean((await res.json()).noindex);
  } catch {
    // backend unreachable: keep the normal rules
  }
  if (hidden) {
    return { rules: { userAgent: '*', disallow: '/' } };
  }

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/private/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
