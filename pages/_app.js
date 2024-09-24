import '../styles/globals.css';
import '../styles/Home.module.css'; // 여기로 이동

function MyApp({ Component, pageProps }) {
    return <Component {...pageProps} />;
}

export default MyApp;
