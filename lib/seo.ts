import type { Metadata } from 'next';
import { contactEmail } from './projects';

// Verified by the live redirect and ASL content on 12 October 2026.
const verifiedOrigin = 'https://www.aslagency.dev';
function productionOrigin(value: string): string {
  const url = new URL(value);
  if (url.protocol !== 'https:' || url.username || url.password || url.port || url.pathname !== '/' || url.search || url.hash || url.hostname.endsWith('.vercel.app') || !url.hostname.includes('.') || /^(localhost|127\.)/.test(url.hostname)) {
    throw new Error('ASL_SITE_URL must be a verified HTTPS production origin, without a path, query, credentials or preview hostname.');
  }
  return url.origin;
}

export const seo = {
  url: productionOrigin(process.env.ASL_SITE_URL || verifiedOrigin),
  name: 'ASL',
  locale: 'en_LK',
  language: 'en',
  description: 'ASL is a creative technology agency in Sri Lanka building distinctive websites, e-commerce, mobile apps, custom software and AI automation for businesses.',
  email: contactEmail,
  logo: '/asl-logo.svg',
  socialImage: '/opengraph-image',
  socialImageAlt: 'ASL — Digital. Alive. Websites, software and AI automation from Sri Lanka.',
} as const;

// Build-time policy; never derive canonical URLs from VERCEL_URL or a request host.
export const isIndexable = process.env.SEO_NOINDEX !== 'true' && (!process.env.VERCEL_ENV || process.env.VERCEL_ENV === 'production');
export const absoluteUrl = (path: string) => new URL(path, `${seo.url}/`).toString();
export const organizationId = absoluteUrl('/#organization');
export const websiteId = absoluteUrl('/#website');

export function pageMetadata(title: string, description: string, path: string): Metadata {
  const url = absoluteUrl(path);
  const socialTitle = `${title} | ${seo.name}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    robots: { index: isIndexable, follow: true, googleBot: { index: isIndexable, follow: true, 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 } },
    // Nested metadata is shallow-merged by Next.js. Return complete objects.
    openGraph: { type: 'website', title: socialTitle, description, url, siteName: seo.name, locale: seo.locale, images: [{ url: absoluteUrl(seo.socialImage), width: 1200, height: 630, alt: seo.socialImageAlt }] },
    twitter: { card: 'summary_large_image', title: socialTitle, description, images: [{ url: absoluteUrl(seo.socialImage), alt: seo.socialImageAlt }] },
  };
}

export const businessGraph = {
  '@context': 'https://schema.org',
  '@graph': [
    { '@type': 'Organization', '@id': organizationId, name: seo.name, url: absoluteUrl('/'), logo: absoluteUrl(seo.logo), email: seo.email, description: seo.description },
    { '@type': 'WebSite', '@id': websiteId, name: seo.name, url: absoluteUrl('/'), inLanguage: seo.language, publisher: { '@id': organizationId } },
  ],
};

export function breadcrumbs(items: { name: string; path: string }[]) {
  return { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: items.map((item, index) => ({ '@type': 'ListItem', position: index + 1, name: item.name, item: absoluteUrl(item.path) })) };
}

export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}
