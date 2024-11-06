import '../styles/globals.css';
import '../styles/Home.module.css';

import { AuthProvider } from './AuthContext'; // AuthContext.js 파일의 실제 경로로 수정하세요

function MyApp({ Component, pageProps }) {
    return (
        <AuthProvider>
            <Component {...pageProps} />
        </AuthProvider>
    );
}

export default MyApp;