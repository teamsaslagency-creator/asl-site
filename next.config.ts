import type { NextConfig } from 'next';
import { isIndexable, seo } from './lib/seo';

const config: NextConfig = {
  trailingSlash: false,
  async headers() {
    return [
      ...(!isIndexable ? [{ source: '/:path*', headers: [{ key: 'X-Robots-Tag', value: 'noindex, follow' }] }] : []),
      { source: '/:path*', has: [{ type: 'host' as const, value: '.*\\.vercel\\.app' }], headers: [{ key: 'X-Robots-Tag', value: 'noindex, follow' }] },
    ];
  },
  async redirects() {
    return seo.url === 'https://www.aslagency.dev' ? [{ source: '/:path*', has: [{ type: 'host' as const, value: 'aslagency.dev' }], destination: 'https://www.aslagency.dev/:path*', permanent: true }] : [];
  },
};
export default config;
