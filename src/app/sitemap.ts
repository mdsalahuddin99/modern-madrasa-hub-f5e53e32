import { MetadataRoute } from 'next';
import prisma from '@/lib/prisma';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://madrasahportal.vercel.app';

  // Fetch all APPROVED madrasas
  const madrasas = await prisma.madrasa.findMany({
    where: {
      status: 'APPROVED',
    },
    select: {
      slug: true,
      updatedAt: true,
    },
  });

  const madrasaUrls = madrasas.map((madrasa) => ({
    url: `${baseUrl}/${madrasa.slug}`,
    lastModified: madrasa.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // Static routes
  const staticRoutes = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/madrasas`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/register`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
  ];

  return [...staticRoutes, ...madrasaUrls];
}
