import { ethers } from "ethers";
import React, { useContext, useState } from "react";
import { LRContext } from "../context/LRContext";
import { CONTRACT_ADDRESS, formatAddress, saleTypeMap } from "../lib/constants";
import axios from "axios";
import Link from "next/link";

const OwnershipData = ({ closeModal }) => {
  const { getLandDataFromId, getLandParticulars } = useContext(LRContext);
  const [formState, setFormState] = useState({ landToken: "" });
  const [submitting, setSubmitting] = useState(false);
  const [data, setData] = useState({});
  const [error, setError] = useState("");
  const handleChangeLandId = (e) => {
    setFormState({ ...formState, landToken: e.target.value });
    setError("");
  };
  const handleSubmit = async (e) => {
    setSubmitting(true);
    e.preventDefault();
    try {
      const landData = await getLandDataFromId(formState.landToken);
      if (!landData) {
        setError("Land ID Does not Exist");
        setSubmitting(false);
        return;
      }
      const data_2 = await getLandParticulars(formState.landToken);
      if (!data_2) {
        setError("Land ID Does not Exist");
        setSubmitting(false);
        return;
      }
      const uri = data_2.uri;
      console.log(uri);
      const data_3 = await axios.get(uri);
      const data_3_json = data_3.data;

      console.log(data_3_json);
      setData({
        seller: {
          name: landData?.seller?.name,
          resAddr: landData?.seller?.resAddress,
          addr: landData?.seller?.addr,
          care_of: landData?.seller?.care_of,
        },
        buyer: {
          name: landData?.buyer?.name,
          resAddr: landData?.buyer?.resAddress,
          addr: landData?.buyer?.addr,
          care_of: landData?.buyer?.care_of,
        },
        landId: landData.landId.toString(),
        salePrice: ethers.utils.formatEther(landData.salePrice),
        saleType: saleTypeMap[landData.saleType],
        fee: ethers.utils.formatEther(landData.fee),
        ownerSignature: landData?.ownerSignature,
        land: {
          name: data_3_json.name,
          description: data_3_json.description,
          image: data_3_json.image,
          area: data_3_json.attributes[0].value,
          address: data_3_json.attributes[1].value,
          plot_no: data_3_json.attributes[2].value,
        },
      });
      setError("");
    } catch (err) {
      console.log(err);
      return;
    }
    setFormState({ landToken: "" });
    setSubmitting(false);
    console.log(data);
  };
  return (
    <div className="mt-4">
      {error.length >= 0 && Object.keys(data).length <= 0 && (
        <form onSubmit={handleSubmit} className="flex flex-col space-y-3">
          <div className="relative z-0 mb-6 mt-2 w-full group">
            <input
              type="number"
              value={formState.landToken}
              name="floating_landToken"
              id="floating_landToken"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
              required
              onChange={handleChangeLandId}
            />
            <label
              for="floating_landToken"
              className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Land Token ID
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
            Land Details of ID # {data?.landId}
          </h2>
          <div className="flex items-center justify-around">
            <div className="flex flex-col space-y-1">
              <h4 className="text-lg font-bold text-center">Buyer Details</h4>
              <p>
                <span className="font-bold">Name:</span> {data?.buyer?.name}
              </p>
              <p>
                <span className="font-bold">Care of:</span>{" "}
                {data?.buyer?.care_of}
              </p>
              <p>
                <span className="font-bold">Res. Address:</span>{" "}
                {data?.buyer?.resAddr}
              </p>
              <p>
                <span className="font-bold">Wallet Address:</span>{" "}
                {formatAddress(data?.buyer?.addr)}
              </p>
            </div>
            <div className="flex flex-col space-y-1">
              <h4 className="text-lg font-bold text-center">Seller Details</h4>
              <p>
                <span className="font-bold">Name:</span> {data?.seller?.name}
              </p>
              <p>
                <span className="font-bold">Care of:</span>{" "}
                {data?.seller?.care_of}
              </p>
              <p>
                <span className="font-bold">Res. Address:</span>{" "}
                {data?.seller?.resAddr}
              </p>
              <p>
                <span className="font-bold">Wallet Address:</span>{" "}
                {formatAddress(data?.seller?.addr)}
              </p>
            </div>
          </div>
          <div className="mt-2">
            <h4 className="text-lg font-bold text-center">Land Particulars</h4>
            <div className="flex items-center justify-around space-x-2">
              <div className="flex flex-col space-y-2">
                <p>
                  <span className="font-bold">Registered Name: </span>
                  {data?.land?.name}
                </p>
                <p>
                  <span className="font-bold">Description: </span>
                  {data?.land?.description}
                </p>
                <p>
                  <span className="font-bold">Area: </span>
                  {data?.land?.area} sft.
                </p>
                <p>
                  <span className="font-bold">Address: </span>
                  {data?.land?.address}
                </p>
                <p>
                  <span className="font-bold">Plot/Unit No: </span>
                  {data?.land?.plot_no}
                </p>
                <p>
                  <span className="font-bold">Sale Price: </span>
                  {data?.salePrice} MATIC
                </p>
                <Link
                  passHref
                  href={`https://testnet.rarible.com/token/polygon/${CONTRACT_ADDRESS}:${data?.landId}`}
                >
                  <a target="_blank">
                    <span className="italic font-bold text-blue-500 hover:cursor-pointer hover:underline">
                      View on Rarible
                    </span>
                  </a>
                </Link>
              </div>
              <div className="flex items-center justify-around">
                <img
                  src={data?.land?.image}
                  alt={`${data?.land?.name} Image`}
                  className="h-64 w-64"
                />
              </div>
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

export default OwnershipData;
