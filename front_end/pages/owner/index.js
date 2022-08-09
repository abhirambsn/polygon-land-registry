import { useWeb3 } from "@3rdweb/hooks";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
import AdminSidebar from "../../components/AdminSidebar";
import { LRContext } from "../../context/LRContext";
import CurrencyFormat from "../../components/CurrencyFormat";
import { ethers } from "ethers";
import { FadeLoader } from "react-spinners";
import Modal from "react-modal";
import { customModalStyles } from "../../lib/constants";

function OwnerPage() {
  const { isOwner, noUsers, getLastSale, getContractBalance, withdrawBalance } =
    useContext(LRContext);
  const router = useRouter();
  const { address } = useWeb3();
  const [contractBalance, setContractBalance] = useState("");
  const [loading, setLoading] = useState(false);
  const [maticData, setMaticData] = useState({});
  const [nUsers, setNUsers] = useState(0);
  const [lastSale, setLastSale] = useState([]);
  const [processWithdrawl, setProcessWithdrawl] = useState(true);

  // Modal States
  const [loadingModal, setLoadingModal] = useState(false);

  const handleProcessWithdrawl = async () => {
    setLoadingModal(true);
    setProcessWithdrawl(true);
    console.log(await withdrawBalance());
    setProcessWithdrawl(false);
  }
  useEffect(() => {
    setLoading(true);
    (async () => {
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
                onClick={handleProcessWithdrawl}
                className="text-white bg-blue-600 hover:bg-blue-800 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mr-2 mb-2"
              >
                Withdraw Balance from Contract to Wallet
              </button>
            </div>
          </div>
        </div>
      )}
      <Modal
        isOpen={loadingModal}
        onRequestClose={() => null}
        style={{...customModalStyles, width: '600px'}}
        contentLabel="Withdraw Loading..."
      >
        
          <div className="flex flex-col items-center h-full justify-center space-y-2">
            {processWithdrawl ? (
              <>
              <FadeLoader />
            <h3 className="text-xl text-center text-green-400">Processing Withdrawl</h3></>
            ) : (
              <>
              <h3 className="text-3xl text-center text-green-600">Withdrawl Successful</h3>
              <button onClick={() => setLoadingModal(false)}>Close</button>
              </>
            )}
          </div>
      </Modal>
    </>
  );
}

export default OwnerPage;
