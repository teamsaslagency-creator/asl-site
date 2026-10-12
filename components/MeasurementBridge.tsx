'use client';

import { useEffect } from 'react';
import { emitMeasurement } from '@/lib/measurement';
import { serviceLinks } from '@/lib/service-links';
import { projects } from '@/lib/projects';

export default function MeasurementBridge() {
  useEffect(() => {
    const click = (event: MouseEvent) => {
      const element = event.target instanceof Element ? event.target.closest<HTMLElement>('a,button') : null;
      if (!element || element.matches(':disabled')) return;
      const project = element.dataset.project;
      if (project && projects.some(item => item.id === project)) emitMeasurement('portfolio_open', { project });
      if (!(element instanceof HTMLAnchorElement)) return;
      if (element.protocol === 'mailto:') emitMeasurement('email_contact_click');
      if (element.origin !== location.origin || element.hash !== '#contact') return;
      const service = element.dataset.service;
      if (service && serviceLinks.some(item => item.href === `/services/${service}`)) emitMeasurement('service_enquiry', { service });
      else emitMeasurement('project_enquiry_click');
    };
    document.addEventListener('click', click);
    return () => document.removeEventListener('click', click);
  }, []);
  return null;
}
