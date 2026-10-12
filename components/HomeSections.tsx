'use client';

import ArrowIcon from './ArrowIcon';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import ProcessExperience from './ProcessExperience';
import WhyASL from './WhyASL';
import Services from './Services';
import IntelligenceLab from './IntelligenceLab';
import HomeFooter from './HomeFooter';
import ProjectBriefForm from './ProjectBriefForm';
import { projects as allProjects, contactEmail } from '@/lib/projects';
const projects = allProjects.slice(0, 3);
const developmentTools = ['TypeScript', 'React', 'Next.js', 'Three.js', 'Blender', 'GSAP', 'Motion', 'Flutter', 'AI agents'];
export default function HomeSections({ motion, serviceDirectory }: { motion: boolean; serviceDirectory: ReactNode }) {
  const [selected, setSelected] = useState(0);
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      entry.target.classList.toggle('in-view', entry.isIntersecting);
      if (entry.isIntersecting) entry.target.classList.add('seen');
    }), { threshold: .12 });
    root.current?.querySelectorAll('[data-motion-section]').forEach(node => observer.observe(node));
    return () => observer.disconnect();
  }, []);
  return <div ref={root} className={`home-sections ${motion ? 'sections-motion' : ''}`}>
    <section className="studio-section studio-refined home-shell" id="studio" aria-labelledby="studio-title" data-motion-section>
      <div className="studio-edition"><p>01 / The point of view</p><span>Presence, purpose, and possibility.</span></div>
      <div className="studio-composition">
      <h2 id="studio-title" className="studio-manifesto"><span>Beautiful to use.</span><span>Intelligent <em>by design.</em></span></h2>
      <figure className="studio-robot-scene"><img src="/asl-robot-interface-v1.webp" alt="The ASL robot carefully shaping a floating glass interface" width={1254} height={1254} loading="lazy" /><figcaption>Imagination, made tangible.</figcaption></figure>
      <div className="studio-introduction"><div><p>We bring imagination and engineering into the same conversation.</p><p>ASL creates distinctive websites, e-commerce experiences, and mobile apps. We also build AI agents and connected workflows that help businesses turn everyday complexity into useful software.</p><a href="#capabilities" className="text-link">Explore our capabilities <span aria-hidden="true"><ArrowIcon down /></span></a></div></div>
      </div>
    </section>

    <Services motion={motion} />
    {serviceDirectory}

    <section className="work-section home-shell" id="work" aria-labelledby="work-title" data-motion-section>
      <div className="home-section-heading"><div><p className="section-kicker">03 / Studio showcases</p><h2 id="work-title">See the idea.<br />Feel the difference.</h2></div><div><p>Explore our website showcases.<br />Design and interaction, brought to life.</p><a className="text-link" href="/projects">All projects <span><ArrowIcon /></span></a></div></div>
      <div className="project-gallery" aria-label="Selected project gallery">
        <div className="gallery-track">{projects.map((project, index) => {
          const position = (index - selected + 3) % 3;
          return <button key={project.name} className={`project-frame project-position-${position}`} onClick={() => setSelected(index)} aria-labelledby={`gallery-label-${project.id}`} aria-pressed={selected === index}><img src={project.image} alt={`${project.name} website preview`} loading="lazy" width={1280} height={720} /><span id={`gallery-label-${project.id}`} className="project-frame-label">{project.name}<span>{project.category}</span></span></button>;
        })}</div>
        <div className="gallery-navigation"><button aria-label="Previous project" onClick={() => setSelected(value => (value + 2) % 3)}>←</button><span>Explore the projects</span><button aria-label="Next project" onClick={() => setSelected(value => (value + 1) % 3)}>→</button></div>
      </div>
    </section>

    <IntelligenceLab motion={motion} />

    <WhyASL />

    <ProcessExperience motion={motion} />

    <section className="technology-strip tools-marquee home-shell" aria-label="Our development tools" data-motion-section>
      <div className="tools-marquee-window">
        <div className="tools-marquee-track">
          {[0, 1, 2].map(copy => <ul key={copy} className="tools-marquee-group" aria-hidden={copy > 0 ? true : undefined}>
            {developmentTools.map(tool => <li key={tool} className="tool-bubble"><span>{tool}</span></li>)}
          </ul>)}
        </div>
      </div>
    </section>

    <section className="contact-section home-shell" id="contact" aria-labelledby="contact-title" data-motion-section>
      <div className="contact-background" aria-hidden="true"><img src="/asl-connected-hands-v1.webp" alt="" width={1672} height={941} loading="lazy" /></div>
      <div className="contact-intro"><p className="section-kicker">07 / Your next chapter</p><h2 id="contact-title">Let’s build<br /><span>what’s next.</span></h2><h3>A good idea deserves<br />a considered beginning.</h3><p>A website with presence. An app with purpose.<br /> A smarter way to work. Let’s shape the idea.</p></div>
      <div className="contact-form-area"><ProjectBriefForm /><a className="contact-address" href={`mailto:${contactEmail}`}>{contactEmail} <span><ArrowIcon /></span></a></div>
    </section>

    <HomeFooter />
  </div>;
}
