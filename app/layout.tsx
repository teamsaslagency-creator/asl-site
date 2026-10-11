import type { Metadata } from 'next';
import { Chakra_Petch, Manrope, Syne } from 'next/font/google';
import './site.css';
import PageTransition from '@/components/PageTransition';

const bodyFont = Manrope({ subsets: ['latin'], variable: '--font-body', display: 'swap' });
const displayFont = Syne({ subsets: ['latin'], variable: '--font-display', display: 'swap' });

const techFont = Chakra_Petch({ subsets: ['latin'], weight: ['500', '600', '700'], variable: '--font-tech', display: 'swap' });

export const metadata: Metadata = {
  title: 'ASL — We build what’s next',
  description: 'Premium digital experiences, mobile apps, and intelligent automation. Custom websites, Flutter mobile apps, AI agents, and SEO built around your business.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  // Browser extensions may inject data-extension-* attributes before hydration.
  // Limit suppression to the document element; page content stays checked.
  return <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning><body className={`${bodyFont.variable} ${displayFont.variable} ${techFont.variable}`}><PageTransition>{children}</PageTransition></body></html>;
}
