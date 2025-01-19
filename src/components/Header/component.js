import React, { useState } from 'react';
import './style.scss';
import Logo from '../../images/logo.svg';
import GitHubIcon from '../../images/icons/github.svg';

const HeaderComponent = () => {
    const [hover, setHover] = useState(false);

    return (
        <div className="header">
            <div className="container" style={{
              display: 'flex',
              justifyContent: 'space-between'
            }}>
                <div className="logo">
                  <a href="/" title="IPv6-adresse.dk" alt="Link to Home" style={{
                    color: 'light-dark(#333, #ccc)',
                    textDecoration: 'none',
                  }}>
                    <Logo height={"30px"} style={{
                      verticalAlign: 'middle',
                    }} />
                    <span style={{
                      marginLeft: '10px',
                      verticalAlign: 'middle',
                    }}>
                      IPv6-adresse.dk
                    </span>
                  </a>
                </div>
                <div className="contribute">
                  <a href="https://www.github.com/emilstahl/ipv6" title="Hjælp os med at forbedre siden!">
                    <GitHubIcon
                      onMouseEnter={()=>setHover(true)}
                      onMouseLeave={()=>setHover(false)}
                      style={hover ? {opacity: 1, verticalAlign: 'middle'} : {opacity: 0.75, verticalAlign: 'middle'}}
                    />
                  </a>
                </div>
            </div>
        </div>
    )
}

export default HeaderComponent
