'use client';

import { useEffect, useRef, useState } from 'react';
import ArrowIcon from './ArrowIcon';

type Props = { onComplete: () => void };

/** Play the approved assembly film, then hand off to the existing hero entrance. */
export default function LoadingEntrance({ onComplete }: Props) {
  const video = useRef<HTMLVideoElement>(null);
  const complete = useRef(onComplete);
  complete.current = onComplete;
  const dismissed = useRef(false);
  const finishEntrance = useRef(() => {});
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const media = video.current!;
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const previousOverflow = document.body.style.overflow;
    const content = document.querySelector<HTMLElement>('main.asl-home');
    const previousInert = content?.inert ?? false;
    document.body.style.overflow = 'hidden';
    if (content) content.inert = true;
    let disposed = false;
    let exitTimer: ReturnType<typeof setTimeout> | undefined;

    const finish = (immediate = false) => {
      if (dismissed.current) return;
      dismissed.current = true;
      media.pause();
      setLeaving(true);
      try { sessionStorage.setItem('asl:intro-seen', 'true'); } catch { /* Storage may be unavailable. */ }
      exitTimer = setTimeout(() => complete.current(), immediate || preference.matches ? 0 : 850);
    };
    const finishNormally = () => finish();
    const change = () => { if (preference.matches) finish(true); };
    finishEntrance.current = finishNormally;
    const skip = (event: KeyboardEvent) => { if (event.key === 'Escape') finish(); };
    media.addEventListener('ended', finishNormally);
    media.addEventListener('error', finishNormally);
    preference.addEventListener('change', change);
    window.addEventListener('keydown', skip);
    // A failed download or denied autoplay must never trap the visitor.
    const safetyTimer = setTimeout(finishNormally, 12000);
    let alreadySeen = false;
    try { alreadySeen = sessionStorage.getItem('asl:intro-seen') === 'true'; } catch { /* Play normally without storage. */ }
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
    const slowConnection = ['slow-2g', '2g', '3g'].includes(connection?.effectiveType ?? '');
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined;
    const isRefresh = navigation?.type === 'reload';
    // An explicit refresh replays the original film. Ordinary navigation keeps
    // the existing bypasses; accessibility and data-saving preferences always win.
    if (preference.matches || connection?.saveData
      || (!isRefresh && (alreadySeen || location.hash || performance.now() > 3000 || slowConnection))) finish(true);
    else {
      media.src = '/asl-loading-burgundy-refined.mp4';
      void media.play().catch(() => { if (!disposed) finish(); });
    }

    return () => {
      disposed = true;
      clearTimeout(safetyTimer);
      clearTimeout(exitTimer);
      media.pause();
      media.removeEventListener('ended', finishNormally);
      media.removeEventListener('error', finishNormally);
      preference.removeEventListener('change', change);
      window.removeEventListener('keydown', skip);
      document.body.style.overflow = previousOverflow;
      if (content) content.inert = previousInert;
      finishEntrance.current = () => {};
      dismissed.current = false;
    };
  }, []);

  return (
    <div className={`asl-loading-entrance${leaving ? ' is-leaving' : ''}`} data-phase={leaving ? 'revealing' : 'assembling'}>
      <p className="asl-loader-status" role="status">Bringing ASL to life.</p>
      <video ref={video} muted playsInline preload="auto" disablePictureInPicture aria-hidden="true" />
      <button className="asl-loader-skip" onClick={() => finishEntrance.current()}>Skip intro <span aria-hidden="true"><ArrowIcon /></span></button>
      <noscript><style>{'.asl-loading-entrance{display:none!important}.asl-home[data-loading="true"] .hero-copy{animation:none!important}'}</style></noscript>
    </div>
  );
}
