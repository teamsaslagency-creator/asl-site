import { services, servicePath } from '@/lib/services';
import ArrowIcon from './ArrowIcon';

export default function ServiceDirectory() {
  return <section className="service-directory home-shell" aria-labelledby="service-directory-title">
    <div className="service-directory-heading"><h2 id="service-directory-title">Find your starting point.</h2><p>Explore the scope, approach and possibilities behind each service.</p></div>
    <ul>{services.map(service => <li key={service.slug}><a href={servicePath(service.slug)}><span>{service.name}</span><ArrowIcon /></a><p>{service.headline}</p></li>)}</ul>
  </section>;
}
