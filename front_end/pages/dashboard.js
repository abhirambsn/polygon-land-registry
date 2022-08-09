import { useWeb3 } from "@3rdweb/hooks";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
import CurrencyFormat from "../components/CurrencyFormat";
import SidebarComponent from "../components/SidebarComponent";
import { LRContext } from "../context/LRContext";

function DashboardPage() {
  const { userData, getUserDetail, getOwnedLands, getLandValue } =
    useContext(LRContext);

  const { address } = useWeb3();

  const [loading, setLoading] = useState(false);
  const [landsOwned, setLandsOwned] = useState(0);
  const [value, setValue] = useState(0);
  const [maticData, setMaticData] = useState({});
  const router = useRouter();
  useEffect(() => {
    if (!address) {
      router.replace("/login");
      return;
    }
    setLoading(true);
    (async () => {
      const url =
        "https://api.coingecko.com/api/v3/coins/matic-network?localization=false&community_data=false&developer_data=false&sparkline=false";
      const req = await fetch(url);
      const data = await req.json();
      setMaticData({
        value: data?.market_data?.current_price?.inr,
        change: data?.market_data?.price_change_24h_in_currency?.inr,
      });
      await getUserDetail();
      const dt = await getOwnedLands();
      const val = await getLandValue(dt);
      setLandsOwned(dt?.length);
      setLoading(false);
    })();
  }, []);
  return (
    <div>
      {loading ? (
        <p>Loading....</p>
      ) : (
        <div className="flex space-x-4">
          <SidebarComponent data={{ ...userData, account: address }} />
          <div className="flex flex-col">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
              <div className="card w-96 h-48 bg-violet-300 text-black">
                <div className="card-body">
                  <h2 className="card-title">Lands Owned</h2>
                  <p>{landsOwned} Land(s) Owned</p>
                </div>
              </div>
              <div className="card w-96 h-48 bg-blue-300 text-black">
                <div className="card-body">
                  <h2 className="card-title">Portfolio Value</h2>
                  <div>
                    <CurrencyFormat value={value} />
                  </div>
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
                      {maticData?.change > 0 ? "+" : "-"} {maticData?.change} %
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <h3 className="text-2xl font-bold mt-4">Recent Sale</h3>
            <table className="table w-full my-4">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Seller</th>
                  <th>Sale Price</th>
                  <th>Sale Type</th>
                </tr>
              </thead>
              <tbody>
                <tr></tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default DashboardPage;
