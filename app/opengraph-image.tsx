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
    // Keep the original mark inside the central square so it remains legible
    // when messaging clients crop the wide social image to a thumbnail.
    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'radial-gradient(ellipse at center, #3a1225 0%, #130b11 65%, #080709 100%)' }}>
      <img src={`data:image/svg+xml;base64,${logo.toString('base64')}`} width={400} height={378} alt="" />
    </div>, size,
  );
}
