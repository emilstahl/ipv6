import React, { useState } from 'react'
import store from '../../store/default'
import './style.scss'

import Spinner from '../../images/icons/spinner.svg'
import Checkmark from '../../images/icons/checkmark.svg'
import Error from '../../images/icons/error.svg'

const sendData = () => {
    alert('Tak!')
}

const DoIHaveIPv6 = () => {
    const [loading, setLoading] = useState(true)

    const [ipv6, setIPv6] = useState(null)
    const [ipv4, setIPv4] = useState(null)
    const [isp, setISP] = useState(null)

    store.subscribe(() => {
      const state = store.getState();

      setIPv6(state.userIPv6Data.ipv6Address);
      setIPv4(state.userIPv6Data.ipv4Address);
      setISP(state.userIPv6Data.ispName);

      setLoading(false);
    })

    return (
        <div className="DoIHaveIPv6">
            <p className="heading">Har jeg IPv6?</p>
            {loading && (<>
                <p className="result">Vi tjekker om du har IPv6...</p>
                <Spinner className="loader" />
            </>)}
            {!loading && (<>
                {ipv6 && (<>
                  <Checkmark height="64px" className="statusIcon" />
                  <p className="result">Ja! Du har IPv6 &ndash; sikke en first mover!</p>
                </>)}
                {!ipv6 && (<>
                  <Error height="66px" width="66px" className="statusIcon" />
                  <p className="result">Øv! Du har desværre ikke IPv6</p>
                </>)}

                <br/>

                <p className="details">
                    {ipv6 && (<>Din IPv6-adresse er <b>{ipv6}</b><br/></>)}
                    {ipv4 && (<>Din IPv4-adresse er <b>{ipv4}</b><br/></>)}
                    {isp && (<>Din udbyder er <b>{isp}</b><br/></>)}
                </p>

                <p className="wannaShare">
                    Vil du dele dit resultat anonymt til vores statistik? Vi indsamler kun om du har IPv6, din udbyder, din IP-adresses lokation og netværkskategori.
                    <br/>
                    <a href="#" onClick={sendData} className="btn">Send anonymt data til statistik</a>
                </p>
            </>)}
        </div>
    )
}

export default DoIHaveIPv6
