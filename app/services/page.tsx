import InnerHeader from '@/components/InnerHeader';
import HomeFooter from '@/components/HomeFooter';
import ServiceDirectory from '@/components/ServiceDirectory';
import JsonLd from '@/components/JsonLd';
import { breadcrumbs, pageMetadata } from '@/lib/seo';
import ArrowIcon from '@/components/ArrowIcon';

export const metadata = pageMetadata('Digital Development Services in Sri Lanka', 'Explore ASL’s website, e-commerce, Flutter app, custom software, AI automation and technical SEO services for businesses in Sri Lanka.', '/services');

export default function ServicesPage() {
  return <main className="asl-home service-page" id="page-top">
    <JsonLd data={breadcrumbs([{ name: 'Home', path: '/' }, { name: 'Services', path: '/services' }])} />
    <a className="skip-link" href="#service-main">Skip to services</a><InnerHeader />
    <section className="service-hero home-shell" id="service-main"><p className="section-kicker">ASL / Services / Sri Lanka</p><h1>One idea.<br />Many possibilities.</h1><p className="service-lead">Websites, apps, custom software and connected intelligence. We bring design and engineering into the same conversation, starting with what your business needs to do.</p><a className="primary-link" href="/#contact">Tell us about your idea <span aria-hidden="true"><ArrowIcon /></span></a></section>
    <ServiceDirectory />
    <section className="service-body home-shell"><div className="service-section"><h2>A considered beginning.</h2><div><p>A business website, an online store and an internal platform solve different problems. Start with your audience, the important task and the tools already involved. We can then shape a useful scope and choose where custom development adds value.</p><p>ASL is a creative technology agency based in Sri Lanka. Our work connects distinctive interfaces with websites, Flutter apps, custom platforms and workflow integrations. Explore the service that fits your next step, then share the ambition and the practical constraints in a project brief.</p><a className="text-link" href="/projects">Explore our studio showcases <ArrowIcon /></a></div></div></section>
    <HomeFooter homePath="/" topId="page-top" />
  </main>;
}
