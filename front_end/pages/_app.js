import { LRProvider } from "../context/LRContext";
import "../styles/globals.css";

import "regenerator-runtime/runtime";

function MyApp({ Component, pageProps }) {
  return (
      <LRProvider>
        <Component {...pageProps} />
      </LRProvider>
  );
}

export default MyApp;
