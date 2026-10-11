'use client';

import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';

type Phase = 'idle' | 'covering' | 'holding' | 'opening';
const TransitionContext = createContext({ isTransitioning: false, hasNavigated: false });
export const usePageTransition = () => useContext(TransitionContext);
const normalize = (path: string) => path.replace(/\/+$/, '') || '/';

export default function PageTransition({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [phase, setPhase] = useState<Phase>('idle');
  const [hasNavigated, setHasNavigated] = useState(false);
  const content = useRef<HTMLDivElement>(null);
  const pending = useRef<{ path: string; started: number; keyboard: boolean } | null>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const restoreFocus = useRef(false);

  function clearTimers() {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  }
  function finish() {
    restoreFocus.current = pending.current?.keyboard ?? false;
    pending.current = null;
    clearTimers();
    setPhase('idle');
  }

  useEffect(() => {
    const click = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>('a[href]') : null;
      if (!link || link.hasAttribute('download') || (link.target && link.target !== '_self')) return;
      const destination = new URL(link.href, location.href);
      // Hash links, other origins, mail, and new-tab gestures retain native behavior.
      if (destination.origin !== location.origin || !['http:', 'https:'].includes(destination.protocol) || normalize(destination.pathname) === normalize(location.pathname)) return;
      event.preventDefault();
      if (pending.current) return;
      const href = destination.pathname + destination.search + destination.hash;
      setHasNavigated(true);
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        router.push(href);
        return;
      }
      pending.current = { path: normalize(destination.pathname), started: performance.now(), keyboard: event.detail === 0 };
      setPhase('covering');
      router.prefetch(href);
      timers.current.push(setTimeout(() => {
        setPhase('holding');
        router.push(href);
      }, 450));
      // Navigation errors or interrupted requests must not leave a blocking screen.
      timers.current.push(setTimeout(finish, 8000));
    };
    document.addEventListener('click', click);
    return () => { document.removeEventListener('click', click); clearTimers(); };
  }, [router]);

  useEffect(() => {
    const navigation = pending.current;
    if (!navigation || normalize(pathname) !== navigation.path) return;
    const remaining = Math.max(0, 980 - (performance.now() - navigation.started));
    timers.current.push(setTimeout(() => {
      setPhase('opening');
      timers.current.push(setTimeout(finish, 520));
    }, remaining));
  }, [pathname]);

  useEffect(() => {
    if (phase === 'idle') {
      if (restoreFocus.current) {
        restoreFocus.current = false;
        const main = content.current?.querySelector<HTMLElement>('main');
        if (main) {
          main.tabIndex = -1;
          main.focus({ preventScroll: true });
        }
      }
      return;
    }
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previous; };
  }, [phase]);

  const active = phase !== 'idle';
  return <TransitionContext.Provider value={{ isTransitioning: active, hasNavigated }}>
    <div ref={content} className="asl-route-content" inert={active} aria-busy={active}>{children}</div>
    {active && <div className="asl-page-transition" data-phase={phase}>
      <p className="asl-transition-status" role="status">Opening the next ASL page.</p>
      <div className="asl-shutter asl-shutter-left" aria-hidden="true" />
      <div className="asl-shutter asl-shutter-right" aria-hidden="true" />
      <div className="asl-transition-mark" aria-hidden="true">
        <img src="/asl-logo.svg" width="160" height="151" alt="" />
        <span className="asl-transition-sweep" />
        <span className="asl-transition-reflection"><img src="/asl-logo.svg" width="160" height="44" alt="" /></span>
      </div>
    </div>}
  </TransitionContext.Provider>;
}
