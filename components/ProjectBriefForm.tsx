'use client';

import { useEffect, useRef, useState, type FormEvent } from 'react';
import ArrowIcon from './ArrowIcon';
import { contactEmail, projectBriefEndpoint } from '@/lib/projects';
import { emitMeasurement } from '@/lib/measurement';

type Status = 'idle' | 'sending' | 'success' | 'error';

export default function ProjectBriefForm() {
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState('');
  const request = useRef<AbortController | null>(null);

  useEffect(() => () => request.current?.abort(), []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (request.current) return;
    const form = event.currentTarget;
    const data = new FormData(form);
    for (const name of ['name', 'email', 'idea']) {
      const field = form.elements.namedItem(name) as HTMLInputElement | HTMLTextAreaElement;
      const value = String(data.get(name) ?? '').trim();
      field.setCustomValidity(value ? '' : 'Please fill in this field.');
      if (!field.reportValidity()) return;
      data.set(name, value);
    }

    const controller = new AbortController();
    request.current = controller;
    const timeout = window.setTimeout(() => controller.abort(), 20000);
    setError('');
    setStatus('sending');
    try {
      const response = await fetch(projectBriefEndpoint, {
        method: 'POST',
        body: data,
        headers: { Accept: 'application/json' },
        signal: controller.signal,
      });
      if (!response.ok) {
        setError(response.status === 429
          ? 'We could not receive your brief just yet. Please try again in a little while, or email us directly.'
          : 'We could not receive your brief. Your details are still here—please try again, or email us directly.');
        setStatus('error');
        return;
      }
      const result: unknown = await response.json();
      // Formspree's success contract is a JSON object with a string `next`.
      // An HTTP 2xx alone cannot confirm that the provider accepted the brief.
      if (!result || typeof result !== 'object' || Array.isArray(result)
        || !('next' in result) || typeof result.next !== 'string'
        || 'error' in result || 'errors' in result) {
        throw new Error('Formspree did not confirm acceptance.');
      }
      form.reset();
      setStatus('success');
      emitMeasurement('contact_submit_success');
    } catch {
      setError('We could not confirm your brief was received. Your details are still here—please try again, or email us directly.');
      setStatus('error');
    } finally {
      window.clearTimeout(timeout);
      request.current = null;
    }
  }

  return <>
    <form action={projectBriefEndpoint} method="POST" onSubmit={submit} aria-busy={status === 'sending'} onInput={event => {
      const field = event.target;
      if (field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement) field.setCustomValidity('');
      if (status === 'success' || status === 'error') { setStatus('idle'); setError(''); }
    }}>
      <input type="hidden" name="_subject" value="ASL — New project brief" />
      <input type="text" name="_gotcha" tabIndex={-1} autoComplete="off" hidden />
      <fieldset className="project-brief-fields" disabled={status === 'sending'}>
        <div className="contact-field-row">
          <label>Your name<input name="name" autoComplete="name" placeholder="How should we call you?" required maxLength={100} /></label>
          <label>Email address<input name="email" type="email" autoComplete="email" placeholder="you@company.com" required maxLength={150} /></label>
        </div>
        <label>What would you like to build?<select name="service" defaultValue="Website / E-commerce">
          <option>Website / E-commerce</option><option>Mobile app / Software</option><option>AI agents / Automation</option><option>SEO / Performance</option><option>A little of everything</option>
        </select></label>
        <label>A little about your idea<textarea name="idea" placeholder="The ambition, the challenge, or the thing you can’t stop thinking about…" required maxLength={3000} rows={3} /></label>
        <button className="primary-link" type="submit" disabled={status === 'sending'}>
          {status === 'sending' ? 'Preparing your brief…' : 'Prepare my project brief'} <span aria-hidden="true"><ArrowIcon /></span>
        </button>
      </fieldset>
      <p className="contact-note">Share your idea with us. We’ll read your brief and get back to you by email. Your brief is sent through Formspree; please leave out sensitive information.</p>
    </form>
    <div role="status" aria-live="polite" aria-atomic="true">
      {status === 'sending' && <p className="contact-note">Your brief is on its way to us…</p>}
      {status === 'success' && <div className="brief-ready"><strong>Your idea is in good hands.</strong><p>Your project brief has been submitted through Formspree. We’ll be in touch by email.</p></div>}
    </div>
    {status === 'error' && <div className="brief-ready" role="alert"><strong>Let’s give that another try.</strong><p>{error}</p><a className="text-link" href={`mailto:${contactEmail}`}>Email us directly <span aria-hidden="true"><ArrowIcon /></span></a></div>}
  </>;
}
