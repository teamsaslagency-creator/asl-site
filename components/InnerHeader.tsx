import ArrowIcon from './ArrowIcon';

export default function InnerHeader() {
  return <header className="site-header premium-header inner-header">
    <a className="wordmark nav-logo" href="/" aria-label="ASL home"><img src="/asl-logo.svg" width={58} height={55} alt="" /></a>
    <nav aria-label="Main navigation"><a href="/services">Services</a><a href="/projects">Projects</a><a className="nav-project-link" href="/#contact">Start a project <span aria-hidden="true"><ArrowIcon /></span></a></nav>
  </header>;
}
