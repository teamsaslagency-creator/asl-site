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

    const finish = () => {
      if (dismissed.current) return;
      dismissed.current = true;
      media.pause();
      setLeaving(true);
      exitTimer = setTimeout(() => complete.current(), preference.matches ? 0 : 850);
    };
    const change = () => { if (preference.matches) finish(); };
    finishEntrance.current = finish;
    const skip = (event: KeyboardEvent) => { if (event.key === 'Escape') finish(); };
    media.addEventListener('ended', finish);
    media.addEventListener('error', finish);
    preference.addEventListener('change', change);
    window.addEventListener('keydown', skip);
    // A failed download or denied autoplay must never trap the visitor.
    const safetyTimer = setTimeout(finish, 12000);
    if (preference.matches) finish();
    else {
      media.src = '/asl-loading-burgundy-refined.mp4';
      void media.play().catch(() => { if (!disposed) finish(); });
    }

    return () => {
      disposed = true;
      clearTimeout(safetyTimer);
      clearTimeout(exitTimer);
      media.pause();
      media.removeEventListener('ended', finish);
      media.removeEventListener('error', finish);
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
