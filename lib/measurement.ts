export type MeasurementEvent = 'contact_submit_success' | 'email_contact_click' | 'project_enquiry_click' | 'portfolio_open' | 'service_enquiry';

// Local integration hook only: no network request, cookies, storage or personal data.
// An owner-approved, consent-aware adapter may listen for this event later.
export function emitMeasurement(name: MeasurementEvent, context: { service?: string; project?: string } = {}) {
  window.dispatchEvent(new CustomEvent('asl:measurement', { detail: { name, ...context } }));
}
