import React, { useState } from "react";
import { LogoutIcon } from "@heroicons/react/outline";
import { useRouter } from "next/router";
import { useWeb3 } from "@3rdweb/hooks";
import { formatAddress } from "../lib/constants";

const AdminSidebar = ({ data, owner = false }) => {
  const [full, setFull] = useState(false);
  const { address, disconnectWallet } = useWeb3();
  const router = useRouter();
  return (
    <div className="flex flex-col w-64 h-screen py-8 bg-white border-r dark:bg-gray-800 dark:border-gray-600">
      <h2 className="text-3xl font-semibold text-center text-gray-800 dark:text-white">
        HeptagonLR
      </h2>

      <div className="flex flex-col items-center mt-6 -mx-2">
        <img
          className="object-cover w-24 h-24 mx-2 rounded-full"
          src="https://avatars.dicebear.com/api/adventurer/tommydaad.svg"
          alt="avatar"
        />
        <h4 className="mx-2 mt-2 font-medium text-gray-800 dark:text-gray-200 hover:underline">
          {data?.name}
        </h4>
        <p
          onClick={() => setFull(!full)}
          className="mx-2 mt-1 text-sm break-all text-center font-medium text-gray-600 cursor-pointer dark:text-gray-400 hover:underline"
        >
          {!full ? formatAddress(address) : address}
        </p>
      </div>

      <div className="flex flex-col justify-between flex-1 mt-6">
        <nav>
          <a
            className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200"
            href="#"
            onClick={() =>
              !owner ? router.push("/executor/") : router.push("/owner/")
            }
          >
            <svg
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M19 11H5M19 11C20.1046 11 21 11.8954 21 13V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V13C3 11.8954 3.89543 11 5 11M19 11V9C19 7.89543 18.1046 7 17 7M5 11V9C5 7.89543 5.89543 7 7 7M7 7V5C7 3.89543 7.89543 3 9 3H15C16.1046 3 17 3.89543 17 5V7M7 7H17"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

            <span className="mx-4 font-medium">Dashboard</span>
          </a>

          {address && (
            <a
              className="flex items-center px-4 py-2 mt-5 text-red-600 transition-colors duration-200 transform dark:text-red-400 hover:bg-gray-200 dark:hover:bg-gray-700 dark:hover:text-red-200 hover:text-red-700"
              href="#"
              onClick={disconnectWallet}
            >
              <LogoutIcon className="h-6 w-6" />
              <span className="mx-4 font-medium">Logout</span>
            </a>
          )}
        </nav>
      </div>
    </div>
  );
};

export default AdminSidebar;
