import InnerHeader from '@/components/InnerHeader';
import { contactEmail } from '@/lib/projects';

export default function NotFound() {
  return <main className="asl-home service-page" id="page-top"><InnerHeader /><section className="service-hero home-shell"><p className="section-kicker">ASL / 404</p><h1>This page hasn’t taken shape.</h1><p className="service-lead">The address may have changed or the page may not exist. Explore our services or tell us what you have in mind.</p><div className="not-found-links"><a className="primary-link" href="/">Return home</a><a className="text-link" href="/services">Explore services</a><a className="text-link" href={`mailto:${contactEmail}`}>Email ASL</a></div></section></main>;
}
