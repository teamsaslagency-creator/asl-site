import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import InnerHeader from '@/components/InnerHeader';
import HomeFooter from '@/components/HomeFooter';
import JsonLd from '@/components/JsonLd';
import ArrowIcon from '@/components/ArrowIcon';
import { absoluteUrl, breadcrumbs, organizationId, pageMetadata } from '@/lib/seo';
import { findService, services, servicePath } from '@/lib/services';
import { projects } from '@/lib/projects';

export const dynamicParams = false;
export function generateStaticParams() { return services.map(service => ({ slug: service.slug })); }

type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const service = findService((await params).slug);
  if (!service) notFound();
  return pageMetadata(service.title, service.description, servicePath(service.slug));
}

export default async function ServicePage({ params }: Props) {
  const service = findService((await params).slug);
  if (!service) notFound();
  const path = servicePath(service.slug);
  const examples = projects.filter(project => service.projectIds.includes(project.id));
  const related = services.filter(item => service.related.includes(item.slug));
  return <main className="asl-home service-page" id="page-top">
    <JsonLd data={breadcrumbs([{ name: 'Home', path: '/' }, { name: 'Services', path: '/services' }, { name: service.name, path }])} />
    <JsonLd data={{ '@context': 'https://schema.org', '@type': 'Service', '@id': absoluteUrl(`${path}#service`), name: service.name, serviceType: service.name, description: service.description, url: absoluteUrl(path), provider: { '@id': organizationId }, areaServed: { '@type': 'Country', name: 'Sri Lanka' } }} />
    <a className="skip-link" href="#service-main">Skip to service details</a><InnerHeader />
    <section className="service-hero home-shell" id="service-main">
      <nav className="service-breadcrumbs" aria-label="Breadcrumb"><a href="/">Home</a><span aria-hidden="true">/</span><a href="/services">Services</a><span aria-hidden="true">/</span><span aria-current="page">{service.name}</span></nav>
      <p className="section-kicker">{service.name} / Sri Lanka</p><h1>{service.title}</h1><p className="service-hero-statement">{service.headline}</p><p className="service-lead">{service.intro}</p><a className="primary-link" href="/#contact" data-service={service.slug}>Discuss your project <span aria-hidden="true"><ArrowIcon /></span></a>
    </section>
    <div className="service-body home-shell">
      <section className="service-section"><h2>{service.problem.title}</h2><p>{service.problem.text}</p></section>
      <section className="service-section"><h2>What we can build.</h2><div className="service-capabilities">{service.capabilities.map(item => <article key={item.title}><h3>{item.title}</h3><p>{item.text}</p></article>)}</div></section>
      <section className="service-section"><h2>Where it fits.</h2><ul className="service-use-cases">{service.useCases.map(item => <li key={item}>{item}</li>)}</ul></section>
      <section className="service-section"><h2>The engineering behind it.</h2><p>{service.approach}</p></section>
      {examples.length > 0 && <section className="service-section"><div><h2>Explore the experience.</h2><p className="service-aside">Studio showcases of design and interaction. These examples do not establish client results or live business integrations.</p></div><div className="service-showcases">{examples.map(project => <article key={project.id}><a href={project.url} target="_blank" rel="noopener noreferrer" data-project={project.id}><img src={project.image} alt={project.imageAlt} width={1280} height={720} loading="lazy" /><h3>{project.name} <ArrowIcon /></h3></a><p>{project.text}</p><span className="service-aside">{project.kind}</span></article>)}</div></section>}
      <section className="service-section"><h2>From brief to beginning.</h2><ol className="service-process">{service.process.map((item, index) => <li key={item}><span aria-hidden="true">0{index + 1}</span><p>{item}</p></li>)}</ol></section>
      <section className="service-section service-enquiry"><div><h2>Let’s shape your next step.</h2><a className="primary-link" href="/#contact" data-service={service.slug}>Prepare a project brief <span aria-hidden="true"><ArrowIcon /></span></a></div><p>{service.preparation}</p></section>
      <section className="service-section"><h2>Connected possibilities.</h2><ul className="related-services">{related.map(item => <li key={item.slug}><a className="text-link" href={servicePath(item.slug)}>{item.name}<ArrowIcon /></a></li>)}</ul></section>
    </div><HomeFooter homePath="/" topId="page-top" />
  </main>;
}
