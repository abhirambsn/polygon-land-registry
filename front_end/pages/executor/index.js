import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
import { LRContext } from "../../context/LRContext";
import AdminSidebar from "../../components/AdminSidebar";
import { ethers } from "ethers";
import {
  customModalStyles,
  formatAddress,
  saleTypeMap,
} from "../../lib/constants";
import IPFSLandRegisterForm from "../../forms/IPFSLandRegisterForm";
import Modal from "react-modal";
import NewSaleForm from "../../forms/NewSaleForm";
import CurrencyFormat from "../../components/CurrencyFormat";
import OwnershipData from "../../components/OwnershipData";
import UserDetails from "../../components/UserDetails";

function ExecutorDashboard() {
  const router = useRouter();
  const { address, getExecutorDetail, checkExecutor, getLastSale, noUsers, userData } =
    useContext(LRContext);
  const [value, setValue] = useState(0);
  const [maticData, setMaticData] = useState({});
  const [lastSale, setLastSale] = useState([]);
  const [nUsers, setNUsers] = useState(0);
  const [loading, setLoading] = useState(false);

  // Modal States
  const [ipfsModal, setIpfsModal] = useState(false);
  const [saleModal, setSaleModal] = useState(false);
  const [ownershipModal, setOwnershipModal] = useState(false);
  const [userDataModal, setUserDataModal] = useState(false);

  useEffect(() => {
    setLoading(true);
    (async () => {
      if (typeof window === "undefined") return;
      if (!address) {
        router.replace("/executor/login");
        return;
      }
      if (!(await checkExecutor())) {
        router.replace("/executor/login");
        return;
      }
      const url =
        "https://api.coingecko.com/api/v3/coins/matic-network?localization=false&community_data=false&developer_data=false&sparkline=false";
      const req = await fetch(url);
      const data = await req.json();
      setMaticData({
        value: data?.market_data?.current_price?.inr,
        change: data?.market_data?.price_change_24h_in_currency?.inr,
      });
      await getExecutorDetail();
      const lastSaleData = await getLastSale();
      const noUsersData = await noUsers();
      setLastSale(lastSaleData);
      setNUsers(noUsersData.toString());
      setLoading(false);
    })();
  }, [address]);
  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="flex space-x-4">
          <AdminSidebar data={userData} />
          <div className="flex flex-col">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
              <div className="card w-96 h-48 bg-violet-300 text-black">
                <div className="card-body">
                  <h2 className="card-title">Total Users</h2>
                  {nUsers && <p>{nUsers} User(s)</p>}
                </div>
              </div>
              <div className="card w-96 h-48 bg-blue-300 text-black">
                <div className="card-body">
                  <h2 className="card-title">Last Sale Value</h2>
                  {lastSale?.salePrice && (
                    <div>
                      <CurrencyFormat
                        value={ethers.utils.formatEther(lastSale.salePrice)}
                      />
                    </div>
                  )}
                </div>
              </div>
              <div className="card w-96 h-48 bg-yellow-300 text-black">
                <div className="card-body">
                  <h2 className="card-title">MATIC Price Value</h2>
                  <div className="space-y-1 flex flex-col">
                    <span className="font-bold">INR {maticData?.value}</span>
                    <span
                      className={`font-bold ${
                        maticData?.change > 0
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {maticData?.change > 0 && "+"}{" "}
                      {maticData?.change?.toFixed(2)} %
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <h3 className="text-2xl font-bold mt-4">Actions</h3>
            <div className="grid grid-cols-1 lg:grid-cols-4 mt-4 gap-4">
              <button
                type="button"
                onClick={() => setIpfsModal(true)}
                className="text-white bg-blue-600 hover:bg-blue-800 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mr-2 mb-2"
              >
                Register New Land
              </button>
              <button
                type="button"
                onClick={() => setSaleModal(true)}
                className="text-white bg-teal-600 hover:bg-teal-800 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-teal-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mr-2 mb-2"
              >
                New Sale
              </button>
              <button
                type="button"
                onClick={() => setOwnershipModal(true)}
                className="text-gray-900 bg-lime-300 hover:bg-lime-400 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-lime-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mr-2 mb-2"
              >
                Get Ownership Details
              </button>
              <button
                type="button"
                onClick={() => setUserDataModal(true)}
                className="text-white bg-purple-700 hover:bg-purple-800 transition-all duration-200 hover:bg-gradient-to-br focus:outline-none focus:ring-4 focus:ring-purple-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mb-2"
              >
                Get User Details
              </button>
            </div>
          </div>
        </div>
      )}
      <Modal
        isOpen={ipfsModal}
        onRequestClose={() => setIpfsModal(false)}
        style={customModalStyles}
        contentLabel="IPFS Modal"
      >
        <div className="divide-y-2">
          <h2 className="text-2xl font-bold text-center my-2">
            Register New Land
          </h2>
          <IPFSLandRegisterForm closeModal={() => setIpfsModal(false)} />
        </div>
      </Modal>
      <Modal
        isOpen={saleModal}
        onRequestClose={() => setSaleModal(false)}
        style={customModalStyles}
        contentLabel="Sale Modal"
      >
        <div className="divide-y-2">
          <h2 className="text-2xl font-bold text-center my-2">Execute Sale</h2>
          <NewSaleForm closeModal={() => setSaleModal(false)} />
        </div>
      </Modal>
      <Modal
        isOpen={ownershipModal}
        onRequestClose={() => setOwnershipModal(false)}
        style={customModalStyles}
        contentLabel="Ownership Details Modal"
      >
        <div className="divide-y-2">
          <h2 className="text-2xl font-bold text-center my-2">
            Ownership Details
          </h2>
          <OwnershipData closeModal={() => setOwnershipModal(false)} />
        </div>
      </Modal>
      <Modal
        isOpen={userDataModal}
        onRequestClose={() => setUserDataModal(false)}
        style={customModalStyles}
        contentLabel="User Details Modal"
      >
        <div className="divide-y-2">
          <h2 className="text-2xl font-bold text-center my-2">User Details</h2>
          <UserDetails closeModal={() => setUserDataModal(false)} />
        </div>
      </Modal>
    </div>
  );
}

export default ExecutorDashboard;
