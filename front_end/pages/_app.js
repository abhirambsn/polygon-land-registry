import { LRProvider } from "../context/LRContext";
import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
  return (
    <LRProvider>
      <Component {...pageProps} />
    </LRProvider>
  );
}

export default MyApp;
