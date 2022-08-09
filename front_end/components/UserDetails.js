import React, { useContext, useState } from "react";
import { LRContext } from "../context/LRContext";
import { formatAddress } from "../lib/constants";

const UserDetails = ({ closeModal }) => {
  const { getOwnedAssetsByAddress, getUserDetailsByAddress } =
    useContext(LRContext);
  const [formState, setFormState] = useState({ walletAddress: "" });
  const [submitting, setSubmitting] = useState(false);
  const [data, setData] = useState({});
  const [error, setError] = useState("");
  const handleSubmit = async (e) => {
    setSubmitting(true);
    e.preventDefault();
    const data = await getUserDetailsByAddress(formState.walletAddress);
    const data_2 = await getOwnedAssetsByAddress(formState.walletAddress);
    const dt = {
      name: data?.name,
      resAddress: data?.resAddress,
      care_of: data?.care_of,
      gender: data?.gender,
      address: data?.addr,
      ownedAssets: data_2?.length ? data_2.length : 0,
    };
    setData(dt);
    setSubmitting(false);
  };
  const handleChangeWalletAddress = (e) => {
    setFormState({ ...formState, walletAddress: e.target.value });
    setError("");
  };
  return (
    <div className="mt-4">
      {error.length >= 0 && Object.keys(data).length <= 0 && (
        <form onSubmit={handleSubmit} className="flex flex-col space-y-3">
          <div className="relative z-0 mb-6 mt-2 w-full group">
            <input
              type="text"
              value={formState.walletAddress}
              name="floating_walletAddr"
              id="floating_walletAddr"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
              required
              onChange={handleChangeWalletAddress}
            />
            <label
              for="floating_walletAddr"
              className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Wallet Address
            </label>
          </div>
          <button
            className={`my-2 text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800`}
            type="submit"
            disabled={submitting}
          >
            Get Details
          </button>
        </form>
      )}
      {error.length > 0 && (
        <h3 className="font-bold text-red-500 my-3 text-2xl text-center">
          {error}
        </h3>
      )}
      {error.length <= 0 && Object.keys(data).length > 0 && (
        <div className="flex flex-col mt-4 space-y-3">
          <h2 className="text-center text-2xl ">
            Details of User w/ Addr: <strong>{formatAddress(data?.address)}</strong>
          </h2>

          <div className="mt-2">
            <div className="flex flex-col items-center space-y-2">
              {/* Image */}
              <img
                className="object-cover w-24 h-24 mx-2 rounded-full"
                src={`https://avatars.dicebear.com/api/adventurer/${data?.name}.svg`}
                alt="User Image"
              />
              <table className="table mx-auto w-full my-2">
                <tr>
                  <th>Name</th>
                  <td>{data?.name}</td>
                </tr>
                <tr>
                  <th>Care of</th>
                  <td>{data?.care_of}</td>
                </tr>
                <tr>
                  <th>Residential Address</th>
                  <td>{data?.resAddress}</td>
                </tr>
                <tr>
                  <th>Wallet Address</th>
                  <td>{data?.address}</td>
                </tr>
                <tr>
                  <th>Owned Assets</th>
                  <td>{data?.ownedAssets}</td>
                </tr>
              </table>
            </div>
          </div>
          <button
            className="mt-2 text-white bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 font-medium transition-all duration-100 rounded-full text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
            onClick={() => setData({})}
          >
            Find Another
          </button>
        </div>
      )}
    </div>
  );
};

export default UserDetails;
