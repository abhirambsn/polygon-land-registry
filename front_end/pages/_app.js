import { LRProvider } from "../context/LRContext";
import {ThirdwebWeb3Provider} from '@3rdweb/hooks'
import "../styles/globals.css";

import "regenerator-runtime/runtime";

function MyApp({ Component, pageProps }) {
  const supportedChains = [80001, 4];
  const connectors = {
    injected: {}
  }
  return (
    <ThirdwebWeb3Provider supportedChainIds={supportedChains} connectors={connectors}>
      <LRProvider>
        <Component {...pageProps} />
      </LRProvider>
      </ThirdwebWeb3Provider>
  );
}

export default MyApp;
