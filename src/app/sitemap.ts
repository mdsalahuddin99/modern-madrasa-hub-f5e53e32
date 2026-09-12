import { MetadataRoute } from 'next';
import prisma from '@/lib/prisma';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
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
    url: `https://madrasahportal.vercel.app/${madrasa.slug}`,
    lastModified: madrasa.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // Static routes
  const staticRoutes = [
    {
      url: 'https://madrasahportal.vercel.app',
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1.0,
    },
    {
      url: 'https://madrasahportal.vercel.app/madrasas',
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: 'https://madrasahportal.vercel.app/register',
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
  ];

  return [...staticRoutes, ...madrasaUrls];
}
