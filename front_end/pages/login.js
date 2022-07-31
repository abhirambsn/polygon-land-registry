import { useRouter } from "next/router";
import React, { useContext, useEffect } from "react";
import { LRContext } from "../context/LRContext";

function LoginPage() {
  const {
    loginWithMetamask,
    loginWithWalletConnect,
    loginWithWeb3Auth,
    isAuthenticated,
    user,
    setAccount
  } = useContext(LRContext);
  const router = useRouter();
  useEffect(() => {
    if (isAuthenticated) {
      setAccount(user.get('ethAddress'));
      router.push("/dashboard");
    }
  }, []);
  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center bg-gradient-to-br from-cyan-500 to-blue-500">
      <div className="flex flex-col p-8 px-32 items-center rounded-lg bg-white space-y-8">
        <h2 className="text-3xl text-center text-cyan-500">
          Heptagon Land Registry
        </h2>
        <button
          onClick={loginWithWalletConnect}
          type="button"
          className="text-gray-900 flex space-x-3 items-center justify-center bg-gradient-to-r from-teal-200 to-lime-200 hover:bg-gradient-to-l hover:from-teal-200 hover:to-lime-200 focus:ring-4 focus:outline-none focus:ring-lime-200 dark:focus:ring-teal-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
        >
          <img
            src="https://raw.githubusercontent.com/WalletConnect/walletconnect-assets/master/svg/circle/walletconnect-circle-blue.svg"
            className="h-8 w-8"
            alt="WalletConnect Logo"
          />
          <span>Login With Wallet Connect</span>
        </button>
        <button
          onClick={loginWithMetamask}
          type="button"
          className="text-white flex space-x-3 items-center justify-center bg-gradient-to-br from-pink-500 to-orange-400 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
        >
          <img
            src="https://raw.githubusercontent.com/MetaMask/brand-resources/master/SVG/metamask-fox.svg"
            className="h-8 w-8"
            alt="Metamask Logo"
          />
          <span>Login With Metamask</span>
        </button>
        <button
          onClick={loginWithWeb3Auth}
          type="button"
          className="text-white flex items-center justify-center space-x-3 bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
        >
          <img
            src="https://web3auth.io/images/w3a-D-Favicon-1.svg"
            className="h-8 w-8"
            alt="Web3Auth Logo"
          />
          <span>Login With Web3Auth.io</span>
        </button>
      </div>
    </div>
  );
}

export default LoginPage;
