import React, { useContext, useState } from "react";
import {LogoutIcon} from '@heroicons/react/outline'
import { LRContext } from "../context/LRContext";
import { useRouter } from "next/router";

const formatAddress = addr => addr.slice(0,5) + "..." + addr.slice(-5)

const SidebarComponent = ({data}) => {
  const [full, setFull] = useState(false);
  const {logOut} = useContext(LRContext)
  const router = useRouter();
  
  return (
    <div className="flex flex-col w-64 h-screen py-8 bg-white border-r dark:bg-gray-800 dark:border-gray-600">
      <h2 className="text-3xl font-semibold text-center text-gray-800 dark:text-white">
        HeptagonLR
      </h2>

      <div className="flex flex-col items-center mt-6 -mx-2">
        <img
          className="object-cover w-24 h-24 mx-2 rounded-full"
          src="https://avatars.dicebear.com/api/adventurer/tommys.svg"
          alt="avatar"
        />
        <h4 className="mx-2 mt-2 font-medium text-gray-800 dark:text-gray-200 hover:underline">
          {data?.name}
        </h4>
        <p onClick={() => setFull(!full)} className="mx-2 mt-1 text-sm break-all text-center font-medium text-gray-600 cursor-pointer dark:text-gray-400 hover:underline">
          {!full ? formatAddress(data?.account) : data?.account}
        </p>
      </div>

      <div className="flex flex-col justify-between flex-1 mt-6">
        <nav>
          <a
            className="flex items-center px-4 py-2 text-gray-700 bg-gray-200 dark:bg-gray-700 dark:text-gray-200"
            href="#"
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

          <a
            className="flex items-center px-4 py-2 mt-5 text-gray-600 transition-colors duration-200 transform dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 dark:hover:text-gray-200 hover:text-gray-700"
            href="#"
            onClick={() => router.push('/assets')}
          >
            <svg
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12 14C8.13401 14 5 17.134 5 21H19C19 17.134 15.866 14 12 14Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

            <span className="mx-4 font-medium">My Registered Lands</span>
          </a>

          <a
            className="flex items-center px-4 py-2 mt-5 text-gray-600 transition-colors duration-200 transform dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 dark:hover:text-gray-200 hover:text-gray-700"
            href="#"
          >
            <svg
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M15 5V7M15 11V13M15 17V19M5 5C3.89543 5 3 5.89543 3 7V10C4.10457 10 5 10.8954 5 12C5 13.1046 4.10457 14 3 14V17C3 18.1046 3.89543 19 5 19H19C20.1046 19 21 18.1046 21 17V14C19.8954 14 19 13.1046 19 12C19 10.8954 19.8954 10 21 10V7C21 5.89543 20.1046 5 19 5H5Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

            <span className="mx-4 font-medium">Sale Record</span>
          </a>

          <a
            className="flex items-center px-4 py-2 mt-5 text-red-600 transition-colors duration-200 transform dark:text-red-400 hover:bg-gray-200 dark:hover:bg-gray-700 dark:hover:text-red-200 hover:text-red-700"
            href="#"
            onClick={logOut}
          >
            <LogoutIcon className="h-6 w-6" />
            <span className="mx-4 font-medium">Logout</span>
          </a>
        </nav>
      </div>
    </div>
  );
};

export default SidebarComponent;
