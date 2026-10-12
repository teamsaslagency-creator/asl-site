'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { preload } from 'react-dom';
import dynamic from 'next/dynamic';
import StoryNavigation from '@/components/StoryNavigation';
import HomeSections from '@/components/HomeSections';
import LoadingEntrance from '@/components/LoadingEntrance';
import { usePageTransition } from '@/components/PageTransition';
import ArrowIcon from '@/components/ArrowIcon';

const RobotArtwork = dynamic(() => import('@/components/RobotArtwork'), { ssr: false });

export default function HomeExperience({ serviceDirectory }: { serviceDirectory: ReactNode }) {
  // Lighthouse identifies this CSS background as the mobile LCP resource.
  preload('/asl-intelligence-chamber-v1.webp', { as: 'image', fetchPriority: 'high' });
  const [motion, setMotion] = useState(true);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [hydrated, setHydrated] = useState(false);
  const { hasNavigated, isTransitioning } = usePageTransition();

  // The film may block interaction only once its skip and safety timer can run.
  // Keep the server-rendered homepage usable if a JavaScript download fails.
  useEffect(() => { setHydrated(true); }, []);
  const entranceActive = hydrated && loading && !hasNavigated;

  useEffect(() => {
    if (hasNavigated && !isTransitioning) setLoading(false);
  }, [hasNavigated, isTransitioning]);

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const change = () => setMotion(!query.matches);
    change();
    query.addEventListener('change', change);
    return () => query.removeEventListener('change', change);
  }, []);

  return (
    <>
    {entranceActive && <LoadingEntrance onComplete={() => setLoading(false)} />}
    <main className={`asl-home ${motion ? 'motion-on' : 'motion-off'}`} data-loading={entranceActive}>
      <div className="reading-progress" aria-hidden="true" />
      <a className="skip-link" href="#home">Skip to content</a>
      <header className="site-header premium-header">
        <a className="wordmark nav-logo" href="#home" aria-label="ASL home"><img src="/asl-logo.svg" width="58" height="55" alt="" /></a>
        <button className="mobile-menu-toggle" aria-expanded={menuOpen} aria-controls="home-navigation" onClick={() => setMenuOpen(value => !value)}>{menuOpen ? 'Close' : 'Menu'}<svg viewBox="0 0 20 20" fill="none" aria-hidden="true">{menuOpen ? <path d="m5 5 10 10M15 5 5 15" /> : <path d="M3 7h14M3 13h14" />}</svg></button>
        <nav id="home-navigation" className={menuOpen ? 'menu-open' : ''} aria-label="Main navigation" onKeyDown={event => { if (event.key === 'Escape') { setMenuOpen(false); (event.currentTarget.previousElementSibling as HTMLButtonElement)?.focus(); } }}>
          <a href="#capabilities" onClick={() => setMenuOpen(false)}>Services</a>
          <a href="/projects">Projects</a>
          <a className="nav-project-link" href="#contact" onClick={() => setMenuOpen(false)}>Start a project <span aria-hidden="true"><ArrowIcon /></span></a>
        </nav>
      </header>

      <section className="hero" id="home" aria-labelledby="hero-title">
        <div className="hero-atmosphere" aria-hidden="true"><div className="orbital-light" /><div className="orbital-line" /><div className="orbital-line orbital-line-secondary" /></div>
        <div className="hero-copy">
          <p className="intro-line">ASL / Creative technology / Sri Lanka</p>
          <h1 id="hero-title"><span>Digital.</span><span>Alive.</span></h1>
          <p className="description"><span className="hero-description-desktop">Distinctive websites. Purposeful apps and custom software. AI automation that connects the work. Built in Sri Lanka, around your business.</span><span className="hero-description-compact">Websites, apps, custom software and AI automation. Built in Sri Lanka to move your business forward.</span></p>
          <a className="primary-link" href="#capabilities">Explore services <span aria-hidden="true"><ArrowIcon /></span></a>
        </div>

        <div className="robot-stage">
          {!loading && <RobotArtwork replay={0} motion={motion} onReady={() => setReady(true)} onError={() => setFailed(true)} />}
          {failed && <p className="loading">The robot could not load. Refresh to try again.</p>}
          {!ready && !failed && <p className="loading">Bringing ASL to life…</p>}
          <div className="stage-caption"><span className="status-light" aria-hidden="true" /><span>{motion ? 'Move your cursor. Say hello.' : 'Motion paused'}</span></div>
          <div className="robot-control">
            <button onClick={() => setMotion(value => !value)} aria-pressed={!motion} aria-label={motion ? 'Pause motion' : 'Enable motion'} title={motion ? 'Pause motion' : 'Enable motion'}>
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">{motion ? <><path d="M9 7v10M15 7v10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></> : <path d="m9 6 9 6-9 6V6Z" fill="currentColor" />}</svg>
            </button>
          </div>
        </div>
      </section>

      <StoryNavigation />
      <HomeSections motion={motion} serviceDirectory={serviceDirectory} />

    </main>
    </>
  );
}
