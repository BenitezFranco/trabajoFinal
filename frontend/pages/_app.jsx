import '../styles/globals.css';
import Head from 'next/head';

function MyApp({ Component, pageProps }) {
    return (
        <>
            <Head>
                <title>Foodbook</title> {/* Cambia el título según tu proyecto */}
                <link rel="icon" href="/icono.png" type="image/png" />
            </Head>
            <Component {...pageProps} />
        </>
    );
}

export default MyApp;
