import { useWeb3 } from "@3rdweb/hooks";
import { useRouter } from "next/router";
import React, { useContext, useEffect } from "react";
import { LRContext } from "../../context/LRContext";

function OwnerLoginPage() {
  const { ownerLogin, isOwner } = useContext(LRContext);
  const { address, error } = useWeb3();
  const router = useRouter();

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (address) {
      (async () => {
        if (typeof window === "undefined") return;
        if (await isOwner()) {
          router.push("/owner/");
        } else {
          alert('Unauthorized');
          router.replace('/');
          return;
        }
      })();
    }
    if (error) {
      alert(error);
    }
  }, [address, error]);

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#11998e] to-[#38ef7d]">
      <div className="flex flex-col p-8 px-32 items-center rounded-lg bg-white space-y-8">
        <h2 className="text-4xl text-center text-lime-700">
          Heptagon Land Registry
        </h2>
        <h4 className="text-2xl text-center text-green-600">Owner Login</h4>

        <button
          onClick={() => ownerLogin()}
          type="button"
          className="text-white flex space-x-3 items-center justify-center bg-gradient-to-br from-[#11998e] to-[#38ef7d] hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-[#38ef7d] dark:focus:ring-[#11998e] font-medium rounded-lg text-lg px-5 py-2.5 text-center mr-2 mb-2"
        >
          <img
            src="https://raw.githubusercontent.com/MetaMask/brand-resources/master/SVG/metamask-fox.svg"
            className="h-8 w-8"
            alt="Metamask Logo"
          />
          <span>Login With Metamask</span>
        </button>
        <button
          type="button"
          onClick={() => router.replace('/')}
          className="text-white flex space-x-3 items-center justify-center bg-gradient-to-br from-cyan-500 to-blue-400 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-200 dark:focus:ring-cyan-800 font-medium rounded-lg text-lg px-5 py-2.5 text-center mr-2 mb-2"
        >
          <span>Back</span>
        </button>
      </div>
    </div>
  );
}

export default OwnerLoginPage;
