import { createContext, useEffect, useState } from "react";
import { CONTRACT_ABI, CONTRACT_ADDRESS, saleTypeMap } from "../lib/constants";
import { useRouter } from "next/router";
import { ethers } from "ethers";
import { Web3Auth } from "@web3auth/web3auth";
export const LRContext = createContext();

export const LRProvider = ({ children }) => {
  const router = useRouter();
  const [userData, setUserData] = useState([]);
  const [provider, setProvider] = useState(null);
  const [address, setAddress] = useState("");
  const [web3auth, setWeb3Auth] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const web3Auth = new Web3Auth({
          clientId:
            "BBhwexn1BraUykrMYh6zxR3yN-24t7L9VJmSEspoOlApL2ySquJ0jnk43d8prd4q9Lp8ZzDR4-Oqn1DuxFURO1A",
          chainConfig: {
            chainNamespace: "eip155",
            chainId: "0x13881",
            rpcTarget:
              "https://polygon-mumbai.g.alchemy.com/v2/-GrjHwYBVNb_3kvcDazEmrDvN-wq58W1",
            displayName: "Polygon Mainnet",
            blockExplorer: "https://mumbai.polygonscan.com/",
            ticker: "MATIC",
            tickerName: "matic",
          },
        });
        setWeb3Auth(web3Auth);
        await web3Auth.initModal();
        if (web3Auth.provider) {
          setProvider(web3Auth.provider);
        }
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

  const getContract = async () => {
    if (!web3auth || !provider) {
      alert("Unauthenticated");
      return;
    }
    const signer = provider.getSigner();
    const LandRegistry = new ethers.Contract(
      CONTRACT_ADDRESS,
      CONTRACT_ABI,
      signer
    );
    return LandRegistry;
  };

  const getUserDetail = async () => {
    const landContract = await getContract();
    if (!landContract) {
      alert("Unauthenticated");
      return;
    }
    const msg = await landContract.users(address);
    if (msg?.name === "") {
      router.push("/register");
    }
    setUserData(msg);
    return msg;
  };

  const getExecutorDetail = async () => {
    if (!web3auth) return;
    const LandRegistry = await getContract();
    const msg = await LandRegistry.executors(address);
    setUserData(msg);
    return msg;
  };

  const getOwnedLands = async () => {
    if (!web3auth || !provider) return;
    const landContract = await getContract();
    const assets = await landContract.getOwnedLands(address);
    return assets;
  };

  const getLandValue = async (ids) => {
    if (!web3auth || !provider) return;
    const LandRegistry = await getContract();
    let total = ethers.BigNumber.from(0);
    for (let id in ids) {
      const val = await LandRegistry.landRegister(id);
      total = total.add(val?.salePrice);
    }
    const price = ethers.utils.formatEther(total);
    return price;
  };

  const getLandDataFromId = async (id) => {
    try {
      const LandRegistry = await getContract();
      const data = await LandRegistry.landRegister(id);
      if (data?.ownerSignature === "0x") {
        return null;
      }
      return data;
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  const getLandParticulars = async (id) => {
    try {
      const LandRegistry = await getContract();
      const data = await LandRegistry.lands(id);
      if (data?.builderSignature === "0x") {
        return null;
      }
      return data;
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  const getUserDetailsByAddress = async (addr) => {
    try {
      const LandRegistry = await getContract();
      const msg = await LandRegistry.users(addr);
      if (msg?.addr === "0x") {
        return null;
      }
      return msg;
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  const getOwnedAssetsByAddress = async (addr) => {
    try {
      const LandRegistry = await getContract();
      const msg = await LandRegistry.getOwnedLands(addr);
      return msg;
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  const getContractBalance = async () => {
    try {
      const LandRegistry = await getContract();
      const msg = await LandRegistry.getContractBalance();
      return msg;
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  const withdrawBalance = async () => {
    try {
      const LandRegistry = await getContract();
      const msg = await LandRegistry.withdrawBalance();
      await msg.wait(1);
      return msg;
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  const registerUser = async (name, cof, resAddr, gender) => {
    if (!address) {
      alert("Unauthenticated");
      router.get("/login");
      return;
    }
    let genderText = "";
    if (gender?.male) genderText = "Male";
    else if (gender?.female) genderText = "Female";

    const LandRegistry = await getContract();
    const txn = await LandRegistry.registerUserInRegistry(
      name,
      cof,
      resAddr,
      genderText
    );
    await txn.wait(1);
    router.push("/dashboard");
  };

  const getAddress = async () => {
    if (!provider) return;
    const signer = provider.getSigner();
    const address = await signer.getAddress();
    return address;
  };

  const addExecutor = async (name, addr) => {
    if (!address) {
      return null;
    }
    try {
      const LandRegistry = await getContract();
      const msg = await LandRegistry.addExecutor(name, addr);
      await msg.wait(1);
      return msg;
    } catch (err) {
      return null;
    }
  };

  const logout = async () => {
    if (!web3auth || !provider) {
      alert("Unauthenticated");
    }
    try {
      await web3auth.logout();
      setProvider(null);
      setAddress(null);
      router.replace("/");
    } catch (err) {
      router.replace("/");
      setAddress(null);
      setProvider(null);
    }
  };

  const executorLogin = async () => {
    if (!web3auth) {
      alert("Web3auth is Initializing or Uninitalized");
      return;
    }
    const web3authProvider = await web3auth.connect();
    const provider = new ethers.providers.Web3Provider(web3authProvider);
    setProvider(provider);
    const signer = provider.getSigner();
    const LandRegistry = new ethers.Contract(
      CONTRACT_ADDRESS,
      CONTRACT_ABI,
      signer
    );
    const g_address = await signer.getAddress();
    setAddress(g_address);
    const isAuth = await LandRegistry.executors(g_address);
    if (isAuth?.isVal) {
      router.replace("/executor/");
    } else {
      alert("Access Denied, Check if you signing with correct account");
      router.replace("/executor/login");
    }
  };

  const ownerLogin = async () => {
    if (!web3auth) {
      alert("Web3auth is Initializing or Uninitalized");
      return;
    }
    const web3authProvider = await web3auth.connect();
    const provider = new ethers.providers.Web3Provider(web3authProvider);
    setProvider(provider);
    const signer = provider.getSigner();
    const LandRegistry = new ethers.Contract(
      CONTRACT_ADDRESS,
      CONTRACT_ABI,
      signer
    );
    const g_address = await signer.getAddress();
    setAddress(g_address);
    const isAuth = await LandRegistry.owner();
    if (isAuth === address) {
      router.replace("/owner/");
    } else {
      alert("Access Denied, Check if you signing with correct account");
      router.replace("/owner/login");
    }
  };

  const userLogin = async () => {
    if (!web3auth) {
      alert("Web3auth is Initializing or Uninitalized");
      return;
    }
    const web3authProvider = await web3auth.connect();
    const provider = new ethers.providers.Web3Provider(web3authProvider);
    setProvider(provider);
    const signer = provider.getSigner();
    const g_address = await signer.getAddress();
    setAddress(g_address);
    router.push("/dashboard");
  };

  const checkExecutor = async () => {
    if (!web3auth) {
      alert("Web3Auth is uninitialized");
      return;
    }
    const LandRegistry = await getContract();
    if (!LandRegistry) return;
    const address = await getAddress();
    if (!address) return;
    const isAuth = await LandRegistry.executors(address);
    console.log(isAuth);
    return isAuth?.isVal;
  };

  const registerLand = async (_uri, builder, _price) => {
    try {
      if (!web3auth) {
        alert("Web3Auth is uninitialized");
        return;
      }
      const LandRegistry = await getContract();
      const msg = await LandRegistry.registerLand(_uri, builder, _price);
      await msg.wait(1);
      return msg;
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  const executeSale = async (
    _seller,
    _buyer,
    _landToken,
    _saleType,
    _salePrice
  ) => {
    try {
      if (!web3auth) {
        alert("Web3Auth is uninitialized");
        return;
      }
      const LandRegistry = await getContract();
      await LandRegistry.lands(_landToken);
      let fee = ethers.BigNumber.from("10000000");
      const _sp = ethers.BigNumber.from(_salePrice);
      if (_saleType === 0 || _saleType === 1) {
        fee = fee.add(_sp.div(1000).mul(1));
      } else if (_saleType == 2) {
        fee = fee.add(_sp.div(1000).mul(5));
      } else if (_saleType == 3) {
        fee = fee.add(_sp.div(1000).mul(8));
      }
      const msg = await LandRegistry.executeSale(
        _seller,
        _buyer,
        _landToken,
        _saleType,
        _salePrice,
        { value: fee }
      );
      await msg.wait(1);
      return msg;
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  const getLastSale = async () => {
    if (!web3auth) {
      alert("Web3Auth is uninitialized");
      return;
    }
    const LandRegistry = await getContract();
    const msg = await LandRegistry.getLastSale();
    return msg;
  };

  const noUsers = async () => {
    if (!web3auth) {
      alert("Web3Auth is uninitialized");
      return;
    }
    const LandRegistry = await getContract();
    const msg = await LandRegistry.getUsers();
    return msg;
  };

  const isOwner = async () => {
    if (!web3auth) {
      alert("Web3Auth is uninitialized");
      return;
    }
    const LandRegistry = await getContract();
    const msg = await LandRegistry.owner();
    console.log(msg);
    if (address === msg) {
      return true;
    }
    return false;
  };

  return (
    <LRContext.Provider
      value={{
        getUserDetail,
        getOwnedLands,
        getLandValue,
        userData,
        registerUser,
        setUserData,
        getLandDataFromId,
        executorLogin,
        checkExecutor,
        getExecutorDetail,
        getLastSale,
        noUsers,
        registerLand,
        executeSale,
        getLandParticulars,
        getUserDetailsByAddress,
        getOwnedAssetsByAddress,
        getContractBalance,
        withdrawBalance,
        isOwner,
        ownerLogin,
        addExecutor,
        address,
        logout,
        userLogin,
      }}
    >
      {children}
    </LRContext.Provider>
  );
};
