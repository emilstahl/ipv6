import React from 'react';
import './style.scss';
import Logo from '../../images/logo.svg';

const HeaderComponent = () => {
    return (
        <div className="header">
            <div className="container">
                <div className="logo">
                  <a href="/" title="IPv6-adresse.dk" alt="Link to Home" style={{
                    color: '#333',
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
                  <a href="" title="Hjælp os med at forbedre siden!"></a>
                </div>
            </div>
        </div>
    )
}

export default HeaderComponent
