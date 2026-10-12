'use client';

import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';

const WorkflowRobot = dynamic(() => import('./WorkflowRobot'), { ssr: false });

export default function DeferredWorkflowRobot({ motion, reaction }: { motion: boolean; reaction: number }) {
  const placeholder = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) { setVisible(true); observer.disconnect(); }
    }, { rootMargin: '300px' });
    if (placeholder.current) observer.observe(placeholder.current);
    return () => observer.disconnect();
  }, []);
  return visible ? <WorkflowRobot motion={motion} reaction={reaction} /> : <div ref={placeholder} className="workflow-character" data-ready={false} aria-hidden="true"><img className="workflow-character-fallback" src="/asl-robot-workflow-v1.webp" width={1254} height={1254} alt="" loading="lazy" /><div className="workflow-character-canvas" /></div>;
}
