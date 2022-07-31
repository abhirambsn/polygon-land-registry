import { createContext, useEffect, useState } from "react";
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "../lib/constants";
import { useRouter } from "next/router";

export const LRContext = createContext();

export const LRProvider = ({ children }) => {
  const router = useRouter();

  return (
    <LRContext.Provider value={{}}>
      {children}
    </LRContext.Provider>
  );
};
