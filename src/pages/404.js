import * as React from "react"
import { Link }   from "gatsby"
import { Helmet } from "react-helmet";

const styles = {
    hero: {
        width: '100%',
        height: '100vh',
        padding: '4rem',
        backgroundColor: '#5cb85c',
        color: 'white'
    },
    btn: {
        display: 'inline-block',
        padding: '1rem',
        backgroundColor: 'white',
        color: '#5cb85c',
        textDecoration: 'none',
        borderRadius: '4px',
        marginTop: '1rem',
        "&:hover": {
            backgroundColor: 'red'
        }
    },
    footer: {
        fontSize: '10pt',
        marginTop: '2rem',
    }
}

// markup
const NotFoundPage = () => {
    return (
        <div style={styles.hero}>
          <Helmet>
            <title>Siden blev ikke fundet — IPv6-adresse.dk</title>
          </Helmet>
            <h1>Siden blev ikke fundet :(</h1>
            <p>IPv6-adresse.dk har kun én side, og det er forsiden. Så jeg sender dig lige derhen.</p>
            <Link to="/" style={styles.btn}>Klik her for at komme til forsiden</Link>
            <footer style={styles.footer}>
                &copy; {(new Date()).getFullYear()} IPv6-adresse.dk
            </footer>
        </div>
    )
}

export default NotFoundPage
