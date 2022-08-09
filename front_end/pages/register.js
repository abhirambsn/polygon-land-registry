import { useWeb3 } from "@3rdweb/hooks";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
import { LRContext } from "../context/LRContext";
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "../lib/constants";

function RegisterPage() {
  const { userData, getUserDetail, registerUser } = useContext(LRContext);
  const {address} = useWeb3();

  const router = useRouter();
  const [name, setName] = useState("");
  const [cof, setCof] = useState("");
  const [gender, setGender] = useState({ male: 0, female: 0 });
  const [resAddr, setResAddr] = useState("");

  

  useEffect(() => {
    if (!address) {
      router.replace("/login");
    }
    (async () => {
      await getUserDetail();
      if (userData?.name !== "") {
        router.replace("/dashboard");
      }
    })();
  }, []);

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-500 to-blue-500">
      <div className="flex flex-col p-8 px-32 items-center rounded-lg bg-white space-y-6">
        <h2 className="text-3xl text-center text-cyan-500">
          Heptagon Land Registry
        </h2>
        <h4 className="text-xl text-center">Complete Registration Details</h4>
        <form className="flex flex-col gap-4 w-full">
          <div className="form-control w-full max-w-xs">
            <label className="label">
              <span className="label-text">Account Address</span>
            </label>
            <input
              className="input input-bordered w-full max-w-xs"
              id="accountAddr"
              type="text"
              placeholder="0x"
              disabled={true}
              value={address}
            />
          </div>

          <div className="form-control w-full max-w-xs">
            <label className="label">
              <span className="label-text">Name</span>
            </label>
            <input
              className="input input-bordered w-full max-w-xs"
              id="name"
              type="text"
              placeholder="Enter Name"
              required={true}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="form-control w-full max-w-xs">
            <label className="label">
              <span className="label-text">Father/Husband/Guardian Name</span>
            </label>
            <input
              className="input input-bordered w-full max-w-xs"
              id="cof"
              type="text"
              placeholder="Enter Father/Husband/Guardian Name"
              required={true}
              value={cof}
              onChange={(e) => setCof(e.target.value)}
            />
          </div>
          <div className="form-control w-full max-w-xs">
            <label className="label">
              <span className="label-text">Residential Address</span>
            </label>
            <textarea
              className="textarea textarea-bordered h-24"
              placeholder="Enter Residential Address"
              required={true}
              rows={4}
              value={resAddr}
              onChange={(e) => setResAddr(e.target.value)}
            ></textarea>
          </div>
          <div>
            <div className="flex">
              <div className="form-control">
                <label className="label cursor-pointer gap-2">
                  <span className="label-text">Male</span>
                  <input
                    type="radio"
                    name="gender"
                    className="radio checked:bg-blue-500"
                    value={gender?.male}
                    onChange={(e) =>
                      setGender({ female: 0, male: e.target.value })
                    }
                  />
                </label>
              </div>
              <div className="form-control">
                <label className="label cursor-pointer gap-2">
                  <span className="label-text">Female</span>
                  <input
                    type="radio"
                    name="gender"
                    value={gender.female}
                    onChange={(e) =>
                      setGender({ male: 0, female: e.target.value })
                    }
                    className="radio checked:bg-pink-500"
                  />
                </label>
              </div>
            </div>
          </div>
          <button
            onClick={() => registerUser(name, cof, resAddr, gender)}
            type="button"
            className="text-white flex space-x-3 items-center justify-center bg-gradient-to-br from-green-500 to-blue-400 hover:bg-gradient-to-tl transition-all duration-100 ease-in-out focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
          >
            <span>Register</span>
          </button>
        </form>
      </div>
    </div>
  );
}

export default RegisterPage;
