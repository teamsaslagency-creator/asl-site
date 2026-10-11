'use client';

import { useState } from 'react';
import ArrowIcon from './ArrowIcon';

const socialChannels = ['Instagram', 'LinkedIn', 'Facebook', 'WhatsApp'];

export default function HomeFooter({ homePath = '' }: { homePath?: string }) {
  const [channelStatus, setChannelStatus] = useState('Our contact channels are coming soon.');

  return <footer className="home-footer premium-footer home-shell">
    <div className="footer-layout">
      <div className="footer-brand">
        <a className="wordmark footer-logo" href={`${homePath}#home`} aria-label="ASL home"><img src="/asl-logo.svg" width="76" height="72" alt="" /></a>
        <p>Distinctive websites. Purposeful apps.<br />Intelligence that connects the work.</p>
        <span className="footer-studio-label">Creative technology studio</span>
      </div>
      <nav className="footer-explore" aria-label="Footer navigation">
        <h2>Explore</h2>
        <a href={`${homePath}#capabilities`}>Services <span aria-hidden="true"><ArrowIcon /></span></a>
        <a href="/projects">Projects <span aria-hidden="true"><ArrowIcon /></span></a>
        <a href={`${homePath}#studio`}>Studio <span aria-hidden="true"><ArrowIcon /></span></a>
        <a href={`${homePath}#contact`}>Start a project <span aria-hidden="true"><ArrowIcon /></span></a>
      </nav>
      <div className="footer-connect">
        <h2>Stay connected</h2>
        <button className="footer-email" type="button" onClick={() => setChannelStatus('This is an example email. Our real address is coming soon.')} aria-label="Example email address, coming soon">example@gmail.com <span aria-hidden="true"><ArrowIcon /></span></button>
        <div className="footer-socials" aria-label="Social media and WhatsApp">
          {socialChannels.map(channel => <button type="button" key={channel} onClick={() => setChannelStatus(`${channel} link coming soon.`)}>{channel}<span aria-hidden="true"><ArrowIcon /></span></button>)}
        </div>
        <p className="footer-channel-status" role="status">{channelStatus}</p>
      </div>
    </div>
    <div className="footer-brand-signature" aria-hidden="true"><span>ASL</span><i /></div>
    <div className="footer-bottom"><span>© 2026 ASL</span><span>Design. Software. Intelligence.</span><a href={homePath ? '#projects-top' : '#home'}>Back to top <span aria-hidden="true">↑</span></a></div>
  </footer>;
}
