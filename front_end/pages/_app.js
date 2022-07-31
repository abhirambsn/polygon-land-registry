import { LRProvider } from "../context/LRContext";
import { MoralisProvider } from "react-moralis";
import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
  return (
    <MoralisProvider
      appId={process.env.NEXT_PUBLIC_MORALIS_APPID}
      serverUrl={process.env.NEXT_PUBLIC_MORALIS_URL}
    >
      <LRProvider>
        <Component {...pageProps} />
      </LRProvider>
    </MoralisProvider>
  );
}

export default MyApp;
