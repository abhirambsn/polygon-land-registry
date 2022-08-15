import { createContext, useEffect, useState } from "react";
import { CONTRACT_ABI, CONTRACT_ADDRESS, saleTypeMap } from "../lib/constants";
import { useRouter } from "next/router";
import { ethers } from "ethers";
import { useWeb3 } from "@3rdweb/hooks";

export const LRContext = createContext();

export const LRProvider = ({ children }) => {
  const router = useRouter();

  const [userData, setUserData] = useState([]);
  const { provider, address, disconnectWallet, connectWallet } = useWeb3();

  const getContract = async () => {
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
    const msg = await landContract.users(address);
    if (msg?.name === "") {
      router.push("/register");
    }
    setUserData(msg);
    return msg;
  };

  const getExecutorDetail = async () => {
    const LandRegistry = await getContract();
    const msg = await LandRegistry.executors(address);
    setUserData(msg);
    return msg;
  };

  const getOwnedLands = async () => {
    const landContract = await getContract();
    const assets = await landContract.getOwnedLands(address);
    return assets;
  };

  const getLandValue = async (ids) => {
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
    await LandRegistry.registerUserInRegistry(name, cof, resAddr, genderText);
    router.push("/dashboard");
  };

  const addExecutor = async (name, addr) => {
    if (!address) {
      return null;
    }
    try {
      const LandRegistry = await getContract();
      const msg = await LandRegistry.addExecutor(name, addr);
      return msg;
    } catch (err) {
      return null;
    }
  };

  const executorLogin = async () => {
    await connectWallet("injected");
    const LandRegistry = await getContract();
    const isAuth = await LandRegistry.executors(address);
    if (isAuth?.isVal) {
      router.replace("/executor/");
    } else {
      alert("Access Denied, Check if you signing with correct account");
      router.replace("/executor/login");
    }
  };

  const ownerLogin = async () => {
    await connectWallet("injected");
    const LandRegistry = await getContract();
    const isAuth = await LandRegistry.owner();
    if (isAuth === address) {
      router.replace("/owner/");
    } else {
      alert("Access Denied, Check if you signing with correct account");
      router.replace("/owner/login");
    }
  };

  const checkExecutor = async () => {
    const LandRegistry = await getContract();
    const isAuth = await LandRegistry.executors(address);
    console.log(isAuth);
    return isAuth?.isVal;
  };

  const registerLand = async (_uri, builder, _price) => {
    try {
      const LandRegistry = await getContract();
      const msg = await LandRegistry.registerLand(_uri, builder, _price);
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
      const LandRegistry = await getContract();
      await LandRegistry.lands(_landToken);
      let fee = ethers.BigNumber.from("10000000");
      const _sp = ethers.BigNumber.from(_salePrice);
      if (_saleType === 0 || _saleType === 1) {
        fee = fee.add((_sp.div(1000)).mul(1));
      } else if (_saleType == 2) {
        fee = fee.add((_sp.div(1000)).mul(5));
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
      return msg;
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  const getLastSale = async () => {
    const LandRegistry = await getContract();
    const msg = await LandRegistry.getLastSale();
    return msg;
  };

  const noUsers = async () => {
    const LandRegistry = await getContract();
    const msg = await LandRegistry.getUsers();
    return msg;
  };

  const isOwner = async () => {
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
      }}
    >
      {children}
    </LRContext.Provider>
  );
};
