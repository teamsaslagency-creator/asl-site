'use client';

import ArrowIcon from './ArrowIcon';

import { useEffect, useRef, useState } from 'react';
import WorkflowRobot from './DeferredWorkflowRobot';
const examples = [
  { name: 'Customer enquiries', input: 'We need a new website for our café, with a menu and table reservations.', route: 'Website enquiry → project brief', output: 'Website enquiry identified. Capture the menu, booking requirements, and brand direction in a brief for the team.', tools: ['Website form', 'Project workspace', 'Team review'] },
  { name: 'Product assistance', input: 'I’m looking for a lightweight jacket for a weekend trip. What should I consider?', route: 'Product question → useful guidance', output: 'Ask about weather, fit, and budget, then use the product catalogue to suggest suitable options for the customer.', tools: ['Storefront', 'Product catalogue', 'Customer reply'] },
  { name: 'Team workflows', input: 'Turn the notes from our project meeting into next steps for design and development.', route: 'Meeting notes → structured tasks', output: 'Create a draft task list grouped by design and development. Flag missing owners and dates for the team to confirm.', tools: ['Meeting notes', 'Task workspace', 'Team approval'] },
];
export default function IntelligenceLab({ motion }: { motion: boolean }) {
  const [selected, setSelected] = useState(0);
  const [reaction, setReaction] = useState(0);
  const [step, setStep] = useState(0);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  const clear = () => { timers.current.forEach(clearTimeout); timers.current = []; };
  useEffect(() => () => clear(), []);
  useEffect(() => { if (!motion) { clear(); setStep(current => current > 0 ? 3 : 0); } }, [motion]);
  const choose = (index: number) => { clear(); setSelected(index); setStep(0); setReaction(current => current + 1); };
  const run = () => {
    clear();
    if (!motion) { setStep(3); return; }
    setStep(1);
    timers.current = [setTimeout(() => setStep(2), 850), setTimeout(() => setStep(3), 1850)];
  };
  const example = examples[selected];
  return <section className="intelligence-lab home-shell" id="intelligence" aria-labelledby="intelligence-title" data-motion-section>
    <div className="intelligence-heading"><div><p className="section-kicker">04 / Intelligence at work</p><h2 id="intelligence-title">Connect the tools.<br /><span>Change the day.</span></h2></div><p>AI has a purpose when it understands the task.<br /> Explore how an everyday request can become a connected workflow.</p></div>
    <div className="intelligence-console" data-step={step}>
      <div className="intelligence-modebar"><span>ASL / Workflow study</span><span>Interactive example · No live AI connection</span></div>
      <div className="intelligence-tabs" role="tablist" aria-label="Workflow examples">{examples.map((item, index) => <button key={item.name} ref={node => { buttons.current[index] = node; }} role="tab" id={`intelligence-tab-${index}`} aria-controls="intelligence-example" aria-selected={selected === index} tabIndex={selected === index ? 0 : -1} onClick={() => choose(index)} onKeyDown={event => {
        let next = index;
        if (event.key === 'ArrowRight') next = (index + 1) % 3;
        else if (event.key === 'ArrowLeft') next = (index + 2) % 3;
        else if (event.key === 'Home') next = 0;
        else if (event.key === 'End') next = 2;
        else return;
        event.preventDefault(); choose(next); buttons.current[next]?.focus({ preventScroll: true });
      }}><small aria-hidden="true">0{index + 1}</small>{item.name}</button>)}</div>
      <div className="intelligence-example" id="intelligence-example" role="tabpanel" aria-labelledby={`intelligence-tab-${selected}`} tabIndex={0}>
        <div className="workflow-input"><span className="workflow-label">A request comes in</span><p key={selected}>{example.input}</p><div className="workflow-tools">{example.tools.map(tool => <span key={tool}>{tool}</span>)}</div><button className="primary-link" onClick={run} disabled={step === 1 || step === 2}>{step === 3 ? 'Replay the workflow' : step > 0 ? 'Connecting the workflow' : 'Run the workflow'}<span aria-hidden="true"><ArrowIcon /></span></button></div>
        <div className="workflow-engine workflow-robot-engine" aria-hidden="true"><svg viewBox="0 0 400 330"><path className="workflow-wire" d="M0 70H80Q105 70 105 95V150Q105 165 125 165H200M0 270H80Q105 270 105 245V185Q105 165 125 165M200 165H270Q290 165 290 145V95Q290 75 310 75H400M200 165H270Q290 165 290 185V235Q290 255 310 255H400" /><path className="workflow-signal" d="M0 70H80Q105 70 105 95V150Q105 165 125 165H270Q290 165 290 185V235Q290 255 310 255H400" /></svg><WorkflowRobot motion={motion} reaction={reaction} /><span>Understand. Connect. Prepare.</span></div>
        <div className={`workflow-output ${step === 3 ? 'output-ready' : ''}`}><span className="workflow-label">A useful next step</span><div className="workflow-status" role="status">{step === 0 ? 'Ready when you are.' : step === 1 ? 'Understanding the request…' : step === 2 ? 'Connecting the next step…' : 'Draft ready for human review.'}</div><div className="workflow-result">{step === 3 ? <><strong>{example.route}</strong><p>{example.output}</p><span className="workflow-review">Review, refine, then put it to work.</span></> : <p>Run the example to see how the request is organised into a practical next step.</p>}</div></div>
      </div>
    </div><p className="intelligence-note">A guided demonstration of the approach. Production systems are connected to your tools, data, and approval rules.</p>
  </section>;
}

