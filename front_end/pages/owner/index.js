import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
import AdminSidebar from "../../components/AdminSidebar";
import { LRContext } from "../../context/LRContext";
import CurrencyFormat from "../../components/CurrencyFormat";
import { ethers } from "ethers";
import { FadeLoader } from "react-spinners";
import Modal from "react-modal";
import { customModalStyles, formatAddress } from "../../lib/constants";

function OwnerPage() {
  const {
    isOwner,
    noUsers,
    addExecutor,
    getLastSale,
    getContractBalance,
    withdrawBalance,
    address
  } = useContext(LRContext);
  const router = useRouter();
  const [contractBalance, setContractBalance] = useState("");
  const [loading, setLoading] = useState(false);
  const [maticData, setMaticData] = useState({});
  const [nUsers, setNUsers] = useState(0);
  const [lastSale, setLastSale] = useState([]);
  const [modalLoading, setModalLoading] = useState(true);

  // Executor Input States
  const [name, setName] = useState("");
  const [execAddr, setExecAddr] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Modal States
  const [loadingModal, setLoadingModal] = useState(false);
  const [execModalIp, setExecModalIp] = useState(false);

  const handleProcessWithdrawl = async () => {
    setLoadingModal(true);
    setModalLoading(true);
    console.log(await withdrawBalance());
    setModalLoading(false);
  };

  const addExecutorHandler = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setModalLoading(true);
    try {
      const msg = await addExecutor(name, execAddr);
      if (!msg) {
        alert("Error"); // TODO: Replace All Alert by toaster from react-hot-toast
        console.error(msg);
        return;
      }
      alert(`Executor Added, Name: ${name}, addr: ${formatAddress(execAddr)}`);
      return;
    } catch (err) {
      console.error(err);
      alert("error occured :(");
    } finally {
      setName("");
      setExecAddr("");
      setSubmitting(false);
      setModalLoading(false);
    }
  };

  const handleCancel = () => {
    setName("");
    setExecAddr("");
    setSubmitting(false);
    setModalLoading(false);
    setExecModalIp(false);
  };
  useEffect(() => {
    setLoading(true);
    (async () => {
      if (typeof window === "undefined" ) return;
      if (!address) {
        router.push('/owner/login');
        return;
      }
      const isOwn = await isOwner();
      if (!isOwn) {
        alert("Unauthenticated");
        router.push("/owner/login");
      }
      const url =
        "https://api.coingecko.com/api/v3/coins/matic-network?localization=false&community_data=false&developer_data=false&sparkline=false";
      const req = await fetch(url);
      const data = await req.json();
      setMaticData({
        value: data?.market_data?.current_price?.inr,
        change: data?.market_data?.price_change_24h_in_currency?.inr,
      });
      const noUsersData = await noUsers();
      const lastSaleData = await getLastSale();
      setNUsers(noUsersData.toString());
      setLastSale(lastSaleData);
      const cBal = await getContractBalance();
      setContractBalance(cBal);
      setLoading(false);
    })();
  }, [address]);

  return (
    <>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="flex space-x-4">
          <AdminSidebar data={{ name: "Owner", address }} owner />
          <div className="flex flex-col">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mt-4">
              <div className="card w-84 h-48 bg-violet-300 text-black">
                <div className="card-body">
                  <h2 className="card-title">Total Users</h2>
                  {nUsers && <p>{nUsers} User(s)</p>}
                </div>
              </div>
              <div className="card w-84 h-48 bg-green-300 text-black">
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
              <div className="card w-84 h-48 bg-blue-300 text-black">
                <div className="card-body">
                  <h2 className="card-title">Contract Balance</h2>
                  {contractBalance && (
                    <div>
                      <CurrencyFormat
                        value={ethers.utils.formatEther(contractBalance)}
                      />
                    </div>
                  )}
                </div>
              </div>
              <div className="card w-84 h-48 bg-yellow-300 text-black">
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
                disabled={false}
                onClick={handleProcessWithdrawl}
                className="text-white bg-blue-600 hover:bg-blue-800 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mr-2 mb-2"
              >
                Withdraw Balance from Contract to Wallet
              </button>
              <button
                type="button"
                onClick={() => setExecModalIp(true)}
                className="text-white bg-blue-600 hover:bg-blue-800 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-2 py-1 text-center mr-2 mb-2"
              >
                Add Executor
              </button>
            </div>
          </div>
        </div>
      )}
      <Modal
        isOpen={execModalIp}
        onRequestClose={() => setExecModalIp(false)}
        style={{ ...customModalStyles, width: "600px" }}
        contentLabel="Add Executor"
      >
        <div className="flex flex-col items-center h-full space-y-2">
          <h3 className="text-center text-2xl text-blue-500 font-bold">
            Add Executor
          </h3>
          <form
            onSubmit={addExecutorHandler}
            className="flex flex-col space-y-4 w-full"
          >
            <div className="relative z-0 mb-6 w-full group mt-2">
              <input
                type="text"
                value={name}
                name="floating_name"
                id="floating_name"
                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=" "
                required
                onChange={(e) => setName(e.target.value)}
              />
              <label
                for="floating_name"
                className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
              >
                Name
              </label>
            </div>
            <div className="relative z-0 mb-6 w-full group mt-2">
              <input
                type="text"
                value={execAddr}
                name="floating_addr"
                id="floating_addr"
                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=" "
                required
                onChange={(e) => setExecAddr(e.target.value)}
              />
              <label
                for="floating_addr"
                className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
              >
                Wallet Address (0x...)
              </label>
            </div>
            <div className="w-full z-0 relative flex space-between">
              <button
                className={`mt-2 w-full ${
                  submitting && "disabled"
                } text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800`}
                type="submit"
                disabled={submitting}
              >
                Add Executor
              </button>
              <button
                onClick={handleCancel}
                className={`mt-2 w-full ${
                  submitting && "disabled"
                } text-white bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-blue-800`}
                type="button"
                disabled={submitting}
              >
                Close
              </button>
            </div>
            {/* TODO: Add Loading Toast Here */}
          </form>
        </div>
      </Modal>
      <Modal
        isOpen={loadingModal}
        onRequestClose={() => null}
        style={{ ...customModalStyles, width: "600px" }}
        contentLabel="Withdraw Loading..."
      >
        <div className="flex flex-col items-center h-full justify-center space-y-2">
          {modalLoading ? (
            <>
              <FadeLoader />
              <h3 className="text-xl text-center text-green-400">
                Processing Withdrawl
              </h3>
            </>
          ) : (
            <>
              <h3 className="text-3xl text-center text-green-600">
                Withdrawl Successful
              </h3>
              <button onClick={() => setLoadingModal(false)}>Close</button>
            </>
          )}
        </div>
      </Modal>
    </>
  );
}

export default OwnerPage;
