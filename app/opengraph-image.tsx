import { ImageResponse } from 'next/og';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { seo } from '@/lib/seo';

export const alt = seo.socialImageAlt;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function SocialImage() {
  const logo = await readFile(join(process.cwd(), 'public/asl-logo.svg'));
  return new ImageResponse(
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '58px 72px', background: 'linear-gradient(115deg, #080709 30%, #650b28)', color: '#f3ede8' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}><img src={`data:image/svg+xml;base64,${logo.toString('base64')}`} width={86} height={82} alt="" /><span style={{ fontSize: 24 }}>Creative technology / Sri Lanka</span></div>
      <div style={{ display: 'flex', flexDirection: 'column', fontSize: 112, fontWeight: 700, letterSpacing: '-6px', lineHeight: 1 }}><span>Digital.</span><span>Alive.</span></div>
      <div style={{ display: 'flex', fontSize: 26, color: '#e0c4d0' }}>Websites. Software. AI automation.</div>
    </div>, size,
  );
}
