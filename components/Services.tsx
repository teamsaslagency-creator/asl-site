'use client';

import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react';
import ArrowIcon from './ArrowIcon';

const serviceDestinations = ['/services/website-development', '/services/mobile-app-development', '/services/ai-automation', '/services/seo-performance'];

const services = [
  { name: 'Web experiences', detail: 'Make every interaction unforgettable.', copy: 'Premium websites and e-commerce shaped around your brand. Immersive visuals, thoughtful interactions, and shopping that feels effortless.', tags: ['Custom websites', 'E-commerce', 'Interactive 3D'], label: 'Websites with presence.', tools: 'TypeScript / React / Next.js', cta: 'Shape your website' },
  { name: 'Apps & software', detail: 'Your idea. In people’s hands.', copy: 'Beautiful Flutter apps and custom platforms that make complex tasks feel simple. Connected to the tools your business already uses.', tags: ['Flutter apps', 'Custom platforms', 'Integrations'], label: 'Your product. In their hands.', tools: 'Flutter / Custom platforms / APIs', cta: 'Plan your product' },
  { name: 'AI & automation', detail: 'Less repetition. More possibility.', copy: 'Purpose-built AI agents and connected workflows that handle routine work, support your team, and keep your business moving.', tags: ['AI agents', 'Workflow automation', 'Connected systems'], label: 'Make room for better work.', tools: 'AI agents / Integrations / Workflows', cta: 'Explore automation' },
  { name: 'SEO & performance', detail: 'Be found. Stay fast. Keep growing.', copy: 'Search optimization, technical performance, and ongoing care. A stronger digital presence built to work long after launch.', tags: ['Technical SEO', 'Speed optimization', 'Analytics & care'], label: 'A stronger digital foundation.', tools: 'Technical SEO / Performance / Analytics', cta: 'Improve your presence' },
];

function Visual({ index }: { index: number }) {
  if (index === 0) return <div className="experience-art" aria-hidden="true">
    <div className="floating-browser"><div className="browser-bar"><span /><span /><span /><i>ASL / Objects of tomorrow</i></div><div className="browser-content"><div className="object-word">Future.<br />In form.</div><div className="web-preview-object"><img src="/asl-robotic-craft-v1.webp" alt="" width={1122} height={1402} loading="lazy" /></div><span className="object-caption">Craft. Intelligence. Another perspective.</span><span className="object-shop">Explore collection <ArrowIcon /></span></div></div>
    <div className="floating-detail"><span>Made to be felt.</span><div className="material-orb" /><small>ASL / Interaction study</small></div>
    <div className="visual-note"><span className="note-line" />Design with another dimension.</div>
  </div>;
  if (index === 1) return <div className="apps-art" aria-hidden="true"><div className="phone phone-back"><div className="phone-island" /><span className="phone-brand">Orbit</span><div className="phone-orbit" /><div className="phone-greeting">A little space<br />for your day.</div><div className="phone-mini-row"><span>Focus</span><span>Explore</span></div></div><div className="phone phone-front"><div className="phone-island" /><div className="phone-topline">Your space <span>◌</span></div><h4>Good things<br />are taking shape.</h4><div className="phone-landscape"><div /><span>Find your rhythm</span></div><div className="phone-task"><span>Today’s focus</span><strong>Create something new</strong><div><i /><i /><i /></div></div><div className="phone-nav">⌂ <span>◈</span> ◯</div></div><div className="visual-note"><span className="note-line" />One experience. Wherever you are.</div></div>;
  if (index === 2) return <div className="network-art" aria-hidden="true"><svg viewBox="0 0 640 420"><defs><radialGradient id="core-mask-gradient"><stop offset=".65" stopColor="white" /><stop offset="1" stopColor="black" /></radialGradient><mask id="core-mask"><rect x="220" y="110" width="200" height="200" fill="url(#core-mask-gradient)" /></mask><radialGradient id="agent-light"><stop stopColor="#f0dfda" /><stop offset=".35" stopColor="#ad344f" /><stop offset="1" stopColor="#310814" /></radialGradient><linearGradient id="agent-path"><stop stopColor="#aa7187" stopOpacity=".2" /><stop offset=".5" stopColor="#d7a2ad" /><stop offset="1" stopColor="#aa7187" stopOpacity=".2" /></linearGradient></defs><g className="network-paths" fill="none" stroke="url(#agent-path)"><path d="M110 110H210Q235 110 235 135V190Q235 210 260 210H320M110 310H210Q235 310 235 285V230Q235 210 260 210M320 210H385Q405 210 405 185V130Q405 110 430 110H530M320 210H385Q405 210 405 235V290Q405 310 430 310H530" /><path className="signal-path" d="M110 110H210Q235 110 235 135V190Q235 210 260 210H385Q405 210 405 235V290Q405 310 430 310H530" /></g><circle cx="320" cy="210" r="100" fill="none" stroke="#d3aabd" strokeOpacity=".12" /><circle className="agent-ring" cx="320" cy="210" r="72" fill="none" stroke="#d3aabd" strokeOpacity=".4" strokeDasharray="2 10" /><image className="intelligence-core-image" href="/asl-intelligence-core-v1.webp" x="220" y="110" width="200" height="200" mask="url(#core-mask)" /><g fill="#250c16" stroke="#c6a2b44d"><rect x="60" y="86" width="100" height="48" rx="12" /><rect x="60" y="286" width="100" height="48" rx="12" /><rect x="480" y="86" width="100" height="48" rx="12" /><rect x="480" y="286" width="100" height="48" rx="12" /></g><g fill="#ecdae2" fontSize="13" textAnchor="middle" fontFamily="Manrope, sans-serif"><text x="110" y="115">Your tools</text><text x="110" y="315">Your data</text><text x="530" y="115">Your team</text><text x="530" y="315">Workflows</text><text x="320" y="350" fill="#c5a7b5">Connected around your business.</text></g></svg></div>;
  return <div className="growth-art" aria-hidden="true"><div className="search-surface"><span className="search-symbol">⌕</span><span>Your next customer is searching.</span><span>↵</span></div><svg viewBox="0 0 640 330"><defs><linearGradient id="growth-fill" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#a43051" stopOpacity=".28" /><stop offset="1" stopColor="#a43051" stopOpacity="0" /></linearGradient></defs><g stroke="#d2adbd15"><path d="M60 80H580M60 145H580M60 210H580M60 275H580" /></g><path d="M60 270C135 265 160 225 210 225S280 200 320 180S380 188 420 140S510 135 580 58V290H60Z" fill="url(#growth-fill)" /><path className="growth-line" d="M60 270C135 265 160 225 210 225S280 200 320 180S380 188 420 140S510 135 580 58" fill="none" stroke="#d48a9e" strokeWidth="2" pathLength="1" /><circle cx="580" cy="58" r="5" fill="#f0d3df" /><circle className="growth-beacon" cx="580" cy="58" r="15" fill="none" stroke="#d48a9e" strokeOpacity=".4" /></svg><div className="growth-principles"><span>Discoverable</span><span>Responsive</span><span>Built to last</span></div></div>;
}

export default function Services({ motion }: { motion: boolean }) {
  const [active, setActive] = useState(0);
  const [outgoing, setOutgoing] = useState<number | null>(null);
  const [direction, setDirection] = useState(1);
  const [autoplay, setAutoplay] = useState(true);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [pageHidden, setPageHidden] = useState(false);
  const [visible, setVisible] = useState(false);
  const [entered, setEntered] = useState(false);
  const section = useRef<HTMLElement>(null);
  const exitTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const gesture = useRef<{ x: number; y: number; time: number; id: number } | null>(null);
  const running = motion && visible && autoplay && !hovered && !focused && !pageHidden;

  const choose = useCallback((index: number, travel = 1, manual = true) => {
    if (manual) setAutoplay(false);
    const next = (index + services.length) % services.length;
    if (next === active) return;
    if (exitTimer.current) clearTimeout(exitTimer.current);
    setDirection(travel);
    setOutgoing(motion ? active : null);
    setActive(next);
    if (motion) exitTimer.current = setTimeout(() => setOutgoing(null), 950);
  }, [active, motion]);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setVisible(entry.isIntersecting);
      if (entry.isIntersecting) setEntered(true);
    }, { threshold: .15 });
    if (section.current) observer.observe(section.current);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    const root = section.current;
    if (!root) return;
    const query = window.matchMedia('(max-width:767px)');
    const reserve = () => {
      if (!query.matches) { root.style.removeProperty('--mobile-stage-height'); return; }
      const heights = Array.from(root.querySelectorAll<HTMLElement>('.cinematic-panel')).map(panel =>
        (panel.querySelector<HTMLElement>('.service-visual')?.offsetHeight ?? 0) +
        (panel.querySelector<HTMLElement>('.service-description')?.offsetHeight ?? 0));
      root.style.setProperty('--mobile-stage-height', `${Math.max(...heights)}px`);
    };
    const size = new ResizeObserver(reserve);
    root.querySelectorAll('.service-visual,.service-description').forEach(node => size.observe(node));
    query.addEventListener('change', reserve);
    reserve();
    return () => { size.disconnect(); query.removeEventListener('change', reserve); };
  }, []);
  useEffect(() => {
    const change = () => setPageHidden(document.hidden);
    change();
    document.addEventListener('visibilitychange', change);
    return () => document.removeEventListener('visibilitychange', change);
  }, []);
  useEffect(() => {
    if (!running) return;
    const timer = setTimeout(() => choose(active + 1, 1, false), 6000);
    return () => clearTimeout(timer);
  }, [active, choose, running]);
  useEffect(() => () => { if (exitTimer.current) clearTimeout(exitTimer.current); }, []);
  useEffect(() => {
    if (!motion) section.current?.querySelectorAll<HTMLElement>('.service-art-scene').forEach(scene => { scene.style.transform = ''; });
  }, [motion]);
  return <section ref={section} className={`capabilities services-lab cinematic-services ${entered ? 'has-entered' : ''} ${visible && motion ? 'is-running' : ''} ${running ? 'is-autoplaying' : ''}`} id="capabilities" aria-labelledby="services-title" style={{ '--scene-direction': direction } as CSSProperties}
    onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
    onFocusCapture={() => setFocused(true)} onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false); }}>
    <div className="services-heading"><div><p className="services-eyebrow">02 / Our capabilities</p><h2 id="services-title">Explore what’s <span>possible.</span></h2></div><p>Four disciplines.<br /> One connected studio.</p></div>
    <div className="cinematic-stage" role="region" aria-roledescription="carousel" aria-label="ASL services" tabIndex={0}
      onKeyDown={event => {
        if (event.key === 'ArrowRight') { event.preventDefault(); choose(active + 1); }
        else if (event.key === 'ArrowLeft') { event.preventDefault(); choose(active - 1, -1); }
        else if (event.key === 'Home') { event.preventDefault(); choose(0, -1); }
        else if (event.key === 'End') { event.preventDefault(); choose(3); }
      }}
      onPointerDown={event => {
        if (!event.isPrimary || event.button !== 0 || (event.target as HTMLElement).closest('a,button')) return;
        gesture.current = { x: event.clientX, y: event.clientY, time: performance.now(), id: event.pointerId };
        event.currentTarget.setPointerCapture(event.pointerId);
      }}
      onPointerUp={event => {
        const start = gesture.current; gesture.current = null;
        if (!start || start.id !== event.pointerId) return;
        const dx = event.clientX - start.x, dy = event.clientY - start.y;
        const velocity = Math.abs(dx) / Math.max(1, performance.now() - start.time);
        if (Math.abs(dx) > Math.abs(dy) * 1.3 && (Math.abs(dx) > 55 || (Math.abs(dx) > 20 && velocity > .4))) choose(active + (dx < 0 ? 1 : -1), dx < 0 ? 1 : -1);
      }} onPointerCancel={() => { gesture.current = null; }}>
        {services.map((item, index) => <div key={item.name} id={`service-panel-${index}`} className="cinematic-panel" data-state={active === index ? 'active' : outgoing === index ? 'outgoing' : 'hidden'} role="group" aria-roledescription="slide" aria-label={`${index + 1} of 4: ${item.name}`} aria-hidden={active !== index} inert={active !== index}>
            <div className="service-description"><span className="service-copy-kicker"><span>0{index + 1}</span>{item.name}</span><h3>{item.label}</h3><p>{item.copy}</p><ul>{item.tags.map(tag => <li key={tag}>{tag}</li>)}</ul><a href={serviceDestinations[index]} className="text-link service-enquiry">{item.cta}<span aria-hidden="true"><ArrowIcon /></span></a></div>
            <div className="service-visual" onPointerMove={event => {
              if (!motion || event.pointerType !== 'mouse' || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
              const bounds = event.currentTarget.getBoundingClientRect();
              const scene = event.currentTarget.querySelector<HTMLElement>('.service-art-scene');
              if (scene) scene.style.transform = `rotateX(${((event.clientY - bounds.top) / bounds.height - .5) * -7}deg) rotateY(${((event.clientX - bounds.left) / bounds.width - .5) * 9}deg)`;
            }} onPointerLeave={event => {
              const scene = event.currentTarget.querySelector<HTMLElement>('.service-art-scene');
              if (scene) scene.style.transform = '';
            }}><div className="service-art-scene"><Visual index={index} /></div></div>
        </div>)}
    </div>
    <div className="cinematic-navigation">
      <div className="cinematic-position"><span aria-hidden="true">0{active + 1}<small>/ 04</small></span><div className="cinematic-progress" aria-label="Choose a service">{services.map((item,index) => <button key={item.name} type="button" aria-label={`Show ${item.name}`} aria-controls={`service-panel-${index}`} aria-current={active === index ? 'step' : undefined} data-complete={index < active} onClick={() => choose(index,index < active ? -1 : 1)}><span /></button>)}</div></div>
      <p className="cinematic-tools">{services[active].tools}</p>
      <div className="cinematic-controls"><span className="cinematic-swipe-hint">Swipe to explore</span><button type="button" aria-label="Previous service" onClick={() => choose(active - 1,-1)}>←</button><button type="button" aria-label="Next service" onClick={() => choose(active + 1)}>→</button><button type="button" className="cinematic-pause" aria-label={autoplay && motion ? 'Pause service autoplay' : 'Play service autoplay'} aria-pressed={autoplay && motion} disabled={!motion} onClick={() => setAutoplay(value => !value)}>{autoplay && motion ? <span className="pause-mark" aria-hidden="true" /> : <span className="play-mark" aria-hidden="true" />}</button></div>
      <span className="cinematic-status" aria-live={running ? 'off' : 'polite'} aria-atomic="true">{services[active].name}, {active + 1} of 4.</span>
    </div>
  </section>;
}
