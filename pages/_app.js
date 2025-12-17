import { Toaster } from 'sonner';
import '../styles/globals.css'

function MyApp({ Component, pageProps }) {
    return (
        <>
            <Component {...pageProps} />
            <Toaster position="top-right" richColors />
        </>
    )
}

export default MyApp
