import React from 'react'

const styles = {
  link: {
    color: 'var(--accent)',
    textDecoration: 'none'
  },
  separator: {
    marginLeft: '.25rem',
    marginRight: '.25rem'
  }
}

const Footer = () => {
  return (
    <div className="container" style={{
      paddingBottom: '1rem',
      marginTop: '2rem',
      fontSize: '80%',
    }}>
      <hr/>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between'
      }}>
        <p className="left">
          &copy; 2013 - { new Date().getUTCFullYear() } IPv6-adresse.dk
          <span style={styles.separator}>·</span>
          <a style={styles.link} href="https://www.twitter.com/ipv6dk" title="@ipv6dk på Twitter" target="_blank">@ipv6dk</a>
          <span style={styles.separator}>·</span>
          <a style={styles.link} href="mailto:ipv6@ipv6-adresse.dk" title="Send en mail!">ipv6@ipv6-adresse.dk</a>
        </p>
        <p className="right">
          Et projekt af <a style={styles.link} href="https://www.emilstahl.dk" title="Emils hjemmeside" target="_blank">Emil Stahl</a>
          <span style={styles.separator}>·</span>
          <a style={styles.link} href="https://www.twitter.com/emilstahl" title="@emilstahl på Twitter" target="_blank">@emilstahl</a>
        </p>
      </div>
    </div>
  );
}

export default Footer;
