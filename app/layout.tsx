import type { Metadata } from 'next';
import { Chakra_Petch, Manrope, Syne } from 'next/font/google';
import './site.css';
import PageTransition from '@/components/PageTransition';
import JsonLd from '@/components/JsonLd';
import MeasurementBridge from '@/components/MeasurementBridge';
import { businessGraph, isIndexable, seo } from '@/lib/seo';

const bodyFont = Manrope({ subsets: ['latin'], variable: '--font-body', display: 'swap' });
const displayFont = Syne({ subsets: ['latin'], variable: '--font-display', display: 'swap' });

const techFont = Chakra_Petch({ subsets: ['latin'], weight: ['500', '600', '700'], variable: '--font-tech', display: 'swap' });

export const metadata: Metadata = {
  metadataBase: new URL(seo.url),
  title: { default: 'ASL — Creative Technology Agency in Sri Lanka', template: '%s | ASL' },
  description: seo.description,
  applicationName: seo.name,
  robots: { index: isIndexable, follow: true },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  // Browser extensions may inject data-extension-* attributes before hydration.
  // Limit suppression to the document element; page content stays checked.
  return <html lang={seo.language} data-scroll-behavior="smooth" suppressHydrationWarning><body className={`${bodyFont.variable} ${displayFont.variable} ${techFont.variable}`}><JsonLd data={businessGraph} /><MeasurementBridge /><PageTransition>{children}</PageTransition><noscript><style>{'.asl-home .hero-copy{animation:none!important}.asl-loading-entrance{display:none!important}.mobile-menu-toggle{display:none!important}.asl-home .premium-header #home-navigation{display:flex!important;flex-wrap:wrap;gap:12px}.asl-home .premium-header #home-navigation>a{display:inline-flex!important}.asl-home .site-header{height:auto;min-height:88px;flex-wrap:wrap}.asl-home .cinematic-panel[data-state="hidden"]{display:none}'}</style></noscript></body></html>;
}
