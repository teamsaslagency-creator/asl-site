import { breadcrumbs, pageMetadata } from '@/lib/seo';
import JsonLd from '@/components/JsonLd';
import ProjectsGrid from '@/components/ProjectsGrid';
import HomeFooter from '@/components/HomeFooter';
import { projects } from '@/lib/projects';
import ArrowIcon from '@/components/ArrowIcon';

export const metadata = pageMetadata('Website & Interaction Showcases', 'Explore ASL’s studio website showcases for cafés, salons, food brands and automotive showrooms, with live design and interaction previews.', '/projects');

export default function Projects() {
  return <main className="projects-page projects-premium asl-home" id="projects-top">
    <JsonLd data={breadcrumbs([{ name: 'Home', path: '/' }, { name: 'Projects', path: '/projects' }])} />
    <a className="skip-link" href="#projects-main">Skip to projects</a>
    <div className="projects-exhibition">
    <div className="projects-opening">
      <header className="site-header projects-header premium-header">
        <a className="wordmark nav-logo" href="/" aria-label="ASL home"><img src="/asl-logo.svg" width="58" height="55" alt="" /></a>
        <nav aria-label="Main navigation"><a href="/">Home</a><a href="/services">Services</a><a className="nav-project-link" href="/#contact">Start a project <span aria-hidden="true"><ArrowIcon /></span></a></nav>
      </header>
      <section className="projects-introduction home-shell" aria-labelledby="projects-title">
        <div className="projects-intro-copy">
          <p className="projects-eyebrow">Selected work / The ASL collection</p>
          <h1 id="projects-title">Different worlds.<br /><span>One studio.</span></h1>
          <p className="projects-intro-lead">A distinct character.<br />An experience of its own.</p>
        </div>
        <div className="projects-intro-note">
          <span className="projects-collection-number">{String(projects.length).padStart(2, '0')}<small>Live website experiences</small></span>
          <p>Studio showcases and concept experiences. Explore the visual direction, interfaces and interactions behind each world.</p>
          <a className="projects-collection-link" href="#projects-main">Explore the collection <span aria-hidden="true">↓</span></a>
        </div>
      </section>
    </div>
    <section className="projects-index home-shell" id="projects-main" aria-labelledby="collection-title">
      <div className="projects-collection-heading"><div><p className="projects-eyebrow">01 / Experience the work</p><h2 id="collection-title">Made to be explored.</h2></div><p>Choose a world.<br />Open it. Experience it live.</p></div>
      <ProjectsGrid />
    </section>
    </div>
    <section className="projects-invitation home-shell" aria-labelledby="projects-invitation-title">
      <div><p className="projects-eyebrow">Your next chapter</p><h2 id="projects-invitation-title">Your world.<br /><span>Made possible.</span></h2><p>Websites, mobile apps, and intelligent systems.<br />Let’s shape what comes next.</p><a className="projects-invitation-link" href="/#contact">Start a project <span aria-hidden="true"><ArrowIcon /></span></a></div>
    </section>
    <HomeFooter homePath="/" topId="projects-top" />
  </main>;
}
