import React, { useEffect, useState } from 'react'
import store from '../../store/default'
import './style.scss'

import Spinner from '../../images/icons/spinner.svg'
import Checkmark from '../../images/icons/checkmark.svg'
import Error from '../../images/icons/error.svg'

const DoIHaveIPv6 = () => {
    const [result, setResult] = useState(null)

    useEffect(() => {
        const read = () => {
            const state = store.getState().userIPv6Data;
            if (state.testRun) setResult(state);
        };
        read(); // the check may have finished before this component mounted
        return store.subscribe(read);
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
