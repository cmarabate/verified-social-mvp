import { MetadataRoute } from 'next'
import { publicEnv } from '@/env/public'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = publicEnv.siteUrl

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/explore`,
      lastModified: new Date(),
      changeFrequency: 'always',
      priority: 0.8,
    },
  ]
}
