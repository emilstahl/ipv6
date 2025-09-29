import React from 'react'
import './style.scss'

const Footer = () => {
  return (
    <div className="footer container">
      <hr/>
      <div className="grid">
        <p className="left">
          &copy; 2013 - { new Date().getUTCFullYear() } IPv6-adresse.dk
          <span className="sep">·</span>
          <a href="https://x.com/ipv6dk" title="@ipv6dk på Twitter" target="_blank" rel="noreferrer">@ipv6dk</a>
          <span className="sep">·</span>
          <a href="mailto:ipv6@ipv6-adresse.dk" title="Send en mail!">ipv6@ipv6-adresse.dk</a>
        </p>
        <p className="right">
          Et projekt af <a href="https://emilstahl.dk" title="Emils hjemmeside" target="_blank" rel="noreferrer">Emil Stahl</a>
          <span className="sep">·</span>
          <a href="https://twitter.com/emilstahl" title="@emilstahl på Twitter" target="_blank" rel="noreferrer">@emilstahl</a>
        </p>
      </div>
    </div>
  );
}

export default Footer;
