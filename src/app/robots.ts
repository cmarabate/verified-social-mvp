import { MetadataRoute } from 'next'
import { publicEnv } from '@/env/public'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = publicEnv.siteUrl

  return {
    rules: {
      userAgent: '*',
      allow: ['/', '/explore'],
      disallow: [
        '/admin/',
        '/account/',
        '/auth/',
        '/verify/',
        '/api/',
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
