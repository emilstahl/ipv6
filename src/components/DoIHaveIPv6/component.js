import React, { useEffect, useState } from 'react'
import ipv6Check from '../../services/checkipv6status'
import './style.scss'

import Spinner from '../../images/icons/spinner.svg'
import Checkmark from '../../images/icons/checkmark.svg'
import Error from '../../images/icons/error.svg'

const DoIHaveIPv6 = () => {
    const [result, setResult] = useState(null)

    useEffect(() => {
        // The check may already have resolved before this mounted; .then still
        // fires either way. Null means SSR, where there is nothing to show.
        let alive = true;
        ipv6Check.then(r => { if (alive && r) setResult(r) });
        return () => { alive = false };
    }, [])

    return (
        <div className="DoIHaveIPv6">
            <p className="heading">Har jeg IPv6?</p>
            {!result && (<>
                <p className="result">Vi tjekker om du har IPv6...</p>
                <Spinner className="loader" />
            </>)}
            {result && result.failed && (<>
                <Error height="66px" width="66px" className="statusIcon" />
                <p className="result">Vi kunne desværre ikke teste om du har IPv6</p>
            </>)}
            {result && !result.failed && (<>
                {result.ipv6Address ? (<>
                  <Checkmark height="64px" className="statusIcon" />
                  <p className="result">Ja! Du har IPv6 &ndash; sikke en first mover!</p>
                </>) : (<>
                  <Error height="66px" width="66px" className="statusIcon" />
                  <p className="result">Øv! Du har desværre ikke IPv6</p>
                </>)}

                <br/>

                <p className="details">
                    {result.ipv6Address && (<>Din IPv6-adresse er <b>{result.ipv6Address}</b><br/></>)}
                    {result.ipv4Address && (<>Din IPv4-adresse er <b>{result.ipv4Address}</b><br/></>)}
                    {result.ispName && (<>Din udbyder er <b>{result.ispName}</b><br/></>)}
                </p>
            </>)}
        </div>
    )
}

export default DoIHaveIPv6
