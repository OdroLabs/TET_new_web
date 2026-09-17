import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://transequalitytrust.lk'; 

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/private/'], 
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}