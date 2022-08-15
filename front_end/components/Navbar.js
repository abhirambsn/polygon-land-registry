import React from "react";
import { useRouter } from "next/router";

const Navbar = () => {
  const router = useRouter();
  return (
    <div className="navbar bg-base-100">
      <div className="navbar-start">
        <div className="dropdown">
          <label tabIndex="0" className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </label>
          <ul
            tabIndex="0"
            className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
          >
            <li>
              <a className="text-lg" onClick={() => router.push("/executor/login")}>
                Executor Login
              </a>
            </li>
            <li>
              <a className="text-lg" onClick={() => router.push("/owner/login")}>Owner Login</a>
            </li>
            <li>
              <a className="text-lg" onClick={() => router.push("/login")}>User Login</a>
            </li>
          </ul>
        </div>
        <a className="btn no-animation btn-ghost normal-case text-xl">
          HeptagonLR
        </a>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal p-0">
          <li>
            <a
              className="btn btn-ghost no-animation"
              onClick={() => router.push("/executor/login")}
            >
              Executor Login
            </a>
          </li>
          <li>
            <a
              className="btn btn-ghost no-animation"
              onClick={() => router.push("/owner/login")}
            >
              Owner Login
            </a>
          </li>
          <li>
            <a
              className="btn btn-ghost no-animation"
              onClick={() => router.push("/login")}
            >
              User Login
            </a>
          </li>
        </ul>
      </div>
      <div className="navbar-end">
        <a
          onClick={() => router.push("/about")}
          className="btn border-none bg-gradient-to-br from-cyan-500 to-blue-500 hover:bg-gradient-to-tl focus:outline-none"
        >
          About Us
        </a>
      </div>
    </div>
  );
};

export default Navbar;
