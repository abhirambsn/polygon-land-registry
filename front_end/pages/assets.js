import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
import SidebarComponent from "../components/SidebarComponent";
import { LRContext } from "../context/LRContext";
import { ethers } from "ethers";
import Link from "next/link";
import { CONTRACT_ADDRESS } from "../lib/constants";
import { saleTypeMap } from "../lib/constants";

function OwnedAssetsPage() {
  const { userData, account, address, getOwnedLands, getLandDataFromId } =
    useContext(LRContext);
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      if (typeof window === 'undefined') return;
      if (!address) {
        router.replace("/login");
        return;
      }
      const lands = await getOwnedLands();
      let landData = [];
      for (const landId in lands) {
        const data = await getLandDataFromId(landId);
        landData.push(data);
      }
      setAssets(landData);
      setLoading(false);
    })();
  }, [address]);
  return (
    <div>
      <div className="flex space-x-4">
        <SidebarComponent data={{ ...userData, account }} />
        <div className="flex flex-col mt-4">
          <h3 className="text-3xl">My Assets</h3>
          {loading ? (
            <p>Loading....</p>
          ) : (
            <div className="table w-full my-4">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Seller</th>
                  <th>Sale Price</th>
                  <th>Sale Type</th>
                  <th>Rarible Link</th>
                </tr>
              </thead>
              <tbody>
                {assets?.map((asset, id) => (
                  <tr key={id}>
                    <td>{asset?.landId?.toString()}</td>
                    <td>{asset?.seller?.name}</td>
                    <td>
                      {ethers.utils.formatEther(asset?.salePrice || "0")} MATIC
                    </td>
                    <td>{saleTypeMap[asset?.sale]}</td>
                    <td>
                      <Link
                        passHref
                        href={`https://testnet.rarible.com/token/polygon/${CONTRACT_ADDRESS}:${asset?.landId?.toString()}`}
                      >
                        <a
                          target="_blank"
                          className="hover:underline hover:cursor-pointer text-blue-600"
                        >
                          View on Rarible
                        </a>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default OwnedAssetsPage;
