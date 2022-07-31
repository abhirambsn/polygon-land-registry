import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
import SidebarComponent from "../components/SidebarComponent";
import { LRContext } from "../context/LRContext";

function DashboardPage() {
  const { getUserDetail, isAuthenticated, userData, account } =
    useContext(LRContext);

  const [loading, setLoading] = useState(false);
  const router = useRouter();
  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/login");
    }
    (async () => {
      setLoading(true);
      await getUserDetail();
      setLoading(false);
    })();
  }, [isAuthenticated]);
  return (
    <div>
      {loading ? (
        <p>Loading....</p>
      ) : (
        <div className="flex space-x-4">
          <SidebarComponent data={{ ...userData, account }} />
          
        </div>
      )}
    </div>
  );
}

export default DashboardPage;
