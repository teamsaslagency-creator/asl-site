'use client';
import { useEffect, useState } from 'react';
const chapters = [
  { id: 'home', label: 'Opening' }, { id: 'studio', label: 'Point of view' }, { id: 'capabilities', label: 'Capabilities' }, { id: 'work', label: 'Selected work' }, { id: 'intelligence', label: 'Intelligence' }, { id: 'why-asl', label: 'Why ASL' }, { id: 'process', label: 'The process' }, { id: 'contact', label: 'Your next chapter' },
];
export default function StoryNavigation() {
  const [active, setActive] = useState('home');
  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      const incoming = entries.filter(entry => entry.isIntersecting);
      if (incoming.length) setActive(incoming[incoming.length - 1].target.id);
    }, { rootMargin: '-15% 0px -65% 0px', threshold: 0 });
    chapters.forEach(chapter => { const node = document.getElementById(chapter.id); if (node) observer.observe(node); });
    return () => observer.disconnect();
  }, []);
  return <nav className="story-navigation" aria-label="Homepage chapters">{chapters.map((chapter, index) => <a key={chapter.id} href={`#${chapter.id}`} aria-label={chapter.label} aria-current={active === chapter.id ? 'location' : undefined}><span className="chapter-name">{chapter.label}</span><span className="chapter-dot" aria-hidden="true" /><small aria-hidden="true">0{index}</small></a>)}</nav>;
}
