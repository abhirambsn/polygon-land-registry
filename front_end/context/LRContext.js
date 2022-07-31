import { createContext, useEffect, useState } from "react";
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "../lib/constants";
import { useRouter } from "next/router";
import { useMoralis } from "react-moralis";

export const LRContext = createContext();

export const LRProvider = ({ children }) => {
  const router = useRouter();
  const {
    web3,
    Moralis,
    authenticate,
    isAuthenticated,
    logout,
    isWeb3Enabled,
    enableWeb3,
    user,
  } = useMoralis();
  const [account, setAccount] = useState("");
  const [userData, setUserData] = useState([]);

  useEffect(() => {
    (async () => {
      if (!isWeb3Enabled) {
        await enableWeb3();
      }
    })();
  }, []);

  const loginWithMetamask = async () => {
    if (!isAuthenticated) {
      const user = await authenticate({
        signingMessage: "User Authentication",
      });
      setAccount(user?.get("ethAddress"));
      router.replace("/dashboard");
    } else {
      await logout();
    }
  };
  const loginWithWalletConnect = async () => {
    if (!isAuthenticated) {
      const user = await authenticate({
        provider: "walletconnect",
        signingMessage: "User Authentication",
      });
      setAccount(user?.get("ethAddress"));
      router.replace("/dashboard");
    }
  };
  const loginWithWeb3Auth = async () => {
    if (!isAuthenticated) {
      const user = await authenticate({
        provider: "web3Auth",
        clientId: process.env.NEXT_PUBLIC_WEB3AUTH_KEY,
        chainId: 0x13881,
        signingMessage: "User Authentication",
      });
      setAccount(user?.get("ethAddress"));
      router.replace("/dashboard");
    }
  };

  const getUserDetail = async () => {
    if (!isAuthenticated) await authenticate();
    if (!isWeb3Enabled) await enableWeb3();
    
    let options = {
      contractAddress: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI,
      functionName: "getUserDetails",
    };
    
    const msg = await Moralis.executeFunction(options);
    if (msg?.name === "") {
      router.push("/register");
    }
    console.log(msg);
    setUserData(msg);
    return msg;
  };

  const registerUser = async (name, cof, resAddr, gender) => {
    if (!isAuthenticated) {
      alert("Unauthenticated");
      return;
    }
    let genderText = "";
    if (gender?.male) genderText = "Male";
    else if (gender?.female) genderText = "Female";
    let options = {
      contractAddress: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI,
      functionName: "registerUserInRegistry",
      params: {
        _name: name,
        _cof: cof,
        _resAddress: resAddr,
        _gender: genderText,
      },
    };

    const registration = await Moralis.executeFunction(options);
    console.log(registration);
    router.push("/dashboard");
  };

  const executorLogin = async (provider) => {
    if (isAuthenticated) {
      await logout();
    }
    const user = await authenticate({
      provider,
      signingMessage: "Executor Authentication",
    });
    setAccount(user?.get("ethAddress"));
    const etherProvider = await enableWeb3();
    const ethers = Moralis.web3Library;
    const signer = etherProvider.getSigner();
    const LandRegistry = new ethers.Contract(
      CONTRACT_ADDRESS,
      CONTRACT_ABI,
      signer
    );
    const isAuth = await LandRegistry.executors(user?.get("ethAddress"));
    if (isAuth?.isVal) {
      router.replace("/executor/");
    } else {
      alert("Access Denied, Check if you signing with correct account");
      router.replace("/executor/login");
    }
  };

  const getOwnedLands = async () => {
    if (!isAuthenticated) await authenticate();
    if (!isWeb3Enabled) await enableWeb3();

    let options = {
      contractAddress: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI,
      functionName: "getOwnedAssets"
    }

    const assets = await Moralis.executeFunction(options);
    return assets;
  };

  const logOut = async () => {
    await logout();
    setAccount("");
  };
  return (
    <LRContext.Provider
      value={{
        loginWithMetamask,
        loginWithWalletConnect,
        loginWithWeb3Auth,
        executorLogin,
        logOut,
        account,
        getUserDetail,
        isAuthenticated,
        registerUser,
        userData,
        user,
        setAccount,
        getOwnedLands,
      }}
    >
      {children}
    </LRContext.Provider>
  );
};
