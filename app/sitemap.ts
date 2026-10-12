import type { MetadataRoute } from 'next';
import { absoluteUrl, isIndexable } from '@/lib/seo';
import { contentUpdated, services, servicePath } from '@/lib/services';

export default function sitemap(): MetadataRoute.Sitemap {
  if (!isIndexable) return [];
  return ['/', '/projects', '/services', ...services.map(service => servicePath(service.slug))].map(path => ({ url: absoluteUrl(path), lastModified: contentUpdated }));
}
