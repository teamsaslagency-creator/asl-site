'use client';

import ArrowIcon from './ArrowIcon';

import { useEffect, useRef, useState } from 'react';

const stages = [
  { name: 'Discover', word: 'Understand.', lead: 'First, the right questions.', text: 'We get to know your business, your audience, and what success should look like. A clear brief gives us a shared direction.', output: 'A focused brief & project scope', note: 'Finding the shape of your ambition.' },
  { name: 'Design', word: 'Imagine.', lead: 'Find the feeling. Shape the experience.', text: 'We explore the visual direction, map the journeys, and prototype the important interactions. You experience the idea before we build it.', output: 'Design direction & interactive prototypes', note: 'Giving the idea a world of its own.' },
  { name: 'Build', word: 'Create.', lead: 'Bring every detail to life.', text: 'Design becomes working software. We connect the systems, refine the motion, and build performance and accessibility into the experience.', output: 'Working software & tested integrations', note: 'Every layer, working together.' },
  { name: 'Launch & evolve', word: 'Forward.', lead: 'A launch is a beginning.', text: 'We prepare the launch and handover, then help your product keep moving with ongoing care, analytics, and thoughtful improvements.', output: 'Launch, handover & ongoing care', note: 'Ready for the world. Built to keep moving.' },
];

function moveDeck(root: HTMLElement, position: number) {
  root.querySelectorAll<HTMLElement>('.journey-card').forEach((card, index) => {
    const distance = index - position;
    const depth = Math.abs(distance);
    card.style.transform = `translate(-50%, -50%) translateX(${distance * 125}px) translateY(${depth * 14}px) translateZ(${-depth * 120}px) rotateY(${-distance * 22}deg) rotateZ(${-distance * 5}deg)`;
    card.style.opacity = String(Math.max(.12, 1 - depth * .32));
    card.style.zIndex = String(10 - Math.round(depth * 2));
  });
}

function ProcessSculpture() {
  return <div className="process-artifact journey-deck" aria-hidden="true">
    <div className="journey-card journey-brief">
      <div className="journey-card-top">01 / Discovery <span>ASL</span></div>
      <span className="brief-mark"><ArrowIcon /></span>
      <h4>Every possibility<br/>starts with<br/><em>a question.</em></h4>
      <div className="brief-lines"><span>The ambition<i/></span><span>The people<i/></span><span>The opportunity<i/></span></div>
      <small>A shared direction.</small>
    </div>
    <div className="journey-card journey-design">
      <div className="journey-card-top">02 / Design <span>ASL</span></div>
      <h4>Form.<br/><em>Feeling.</em></h4>
      <img src="/asl-robot-interface-v1.webp" width="1254" height="1254" alt="" loading="lazy"/>
      <small>From visual language to interaction.</small>
    </div>
    <div className="journey-card journey-build">
      <div className="journey-card-top">03 / Engineering <span>ASL</span></div>
      <span className="code-glyph">&lt;/&gt;</span>
      <h4>Ideas become<br/><em>experience.</em></h4>
      <div className="journey-code"><span>experience.connect({'{'}</span><span>  design: 'considered',</span><span>  motion: 'fluid',</span><span>  purpose: 'your business'</span><span>{'}'});</span></div>
      <small>Design, systems, and detail.</small>
    </div>
    <div className="journey-card journey-launch">
      <div className="journey-card-top">04 / Launch <span>ASL</span></div>
      <div className="launch-word">LIVE <span><ArrowIcon /></span></div>
      <div className="launch-window"><img src="/projects/ember.jpg" width="1280" height="720" alt="" loading="lazy"/></div>
      <h4>A beginning.<br/><em>More to come.</em></h4>
      <small>Release. Learn. Refine.</small>
    </div>
  </div>;
}

export default function ProcessExperience({ motion }: { motion: boolean }) {
  const [stage, setStage] = useState(0);
  const [compact, setCompact] = useState(false);
  const scrollDriven = motion && !compact;
  const sectionRef = useRef<HTMLElement>(null);
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  useEffect(() => {
    const query = window.matchMedia('(max-width:1024px)');
    const update = () => setCompact(query.matches);
    update(); query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);
  useEffect(() => {
    if (!scrollDriven) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const root = sectionRef.current;
      if (!root) return;
      const bounds = root.getBoundingClientRect();
      const travel = Math.max(1, bounds.height - window.innerHeight);
      const progress = Math.max(0, Math.min(1, (24 - bounds.top) / travel));
      const position = Math.min(3, progress * 4);
      moveDeck(root, position);
      const next = Math.min(3, Math.floor(position + .35));
      setStage(current => current === next ? current : next);
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    update();
    return () => { cancelAnimationFrame(frame); window.removeEventListener('scroll', schedule); window.removeEventListener('resize', schedule); };
  }, [scrollDriven]);
  useEffect(() => { if (!scrollDriven && sectionRef.current) moveDeck(sectionRef.current, stage); }, [scrollDriven, stage]);
  const chooseStage = (next: number) => {
    setStage(next);
    const root = sectionRef.current;
    if (!scrollDriven || !root) return;
    const bounds = root.getBoundingClientRect();
    const travel = Math.max(1, bounds.height - window.innerHeight);
    window.scrollTo({ top: window.scrollY + bounds.top - 24 + travel * ((next + .15) / 4), behavior: 'instant' });
  };
  return <section ref={sectionRef} className={`process-experience home-shell ${scrollDriven ? 'process-scroll-driven' : 'process-touch-driven'}`} id="process" aria-labelledby="process-title" data-motion-section>
    <div className="process-pin">
      <div className="process-heading"><div><p className="section-kicker">06 / From idea to experience</p><h2 id="process-title">From first thought<br/>to full experience.</h2></div><p>{scrollDriven ? 'Scroll through the making.' : 'Explore each stage at your own pace.'}<br/>A considered journey. A shared ambition.</p></div>
      <div className="process-theatre process-workshop" data-process-stage={stage}>
        <div className="process-stage-word" aria-hidden="true">{stages.map((item, index) => <span key={item.word} className={stage === index ? 'word-active' : ''}>{item.word}</span>)}</div>
        <div className="process-stage-index" aria-hidden="true"><span>0{stage + 1}</span><i>/ 04</i></div>
        <ProcessSculpture/>
        <div className="process-scene-caption" aria-hidden="true"><span/><p>{stages[stage].note}</p></div>
        <div className="process-narration">{stages.map((item, index) => <div key={item.name} role="tabpanel" aria-labelledby={`process-choice-${index}`} id={`process-detail-${index}`} hidden={stage !== index} tabIndex={0}><h3>{item.lead}</h3><div><p>{item.text}</p><span className="process-deliverable"><i aria-hidden="true">↳</i>{item.output}</span></div></div>)}</div>
      </div>
      <div className="process-sequence" role="tablist" aria-label="Project process" aria-orientation="horizontal">{stages.map((item, index) => <button key={item.name} ref={node => { buttons.current[index] = node; }} type="button" role="tab" aria-selected={stage === index} aria-controls={`process-detail-${index}`} id={`process-choice-${index}`} tabIndex={stage === index ? 0 : -1} onClick={() => chooseStage(index)} onKeyDown={event => {
        let next = index;
        if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = (index + 1) % 4;
        else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = (index + 3) % 4;
        else if (event.key === 'Home') next = 0;
        else if (event.key === 'End') next = 3;
        else return;
        event.preventDefault(); chooseStage(next); buttons.current[next]?.focus({ preventScroll: true });
      }}><span className="sequence-track"><i className={index <= stage ? 'track-reached' : ''}/></span><span className="sequence-label"><small>0{index + 1}</small>{item.name}<span aria-hidden="true"><ArrowIcon /></span></span></button>)}</div>
    </div>
  </section>;
}
