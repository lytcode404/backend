import { auth, db } from "@/db/firebase";
import { fetchCurrentUserData } from "@/redux/currentUserData";
import { collection, getDocs, query, where } from "firebase/firestore";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
const Sidebar = ({
  displayName,
  sideNavActive,
  setSideNavActive,
  isSidebarOpen,
}) => {
  return (
    <>
      {isSidebarOpen && (
        <aside className=" z-20 overflow-y-auto text-black bg-white shadow-xl border-gray-500 border-r-2 h-screen">
          <div className="">
            <ul className="mt-6">
              <li className="relative px-6 py-3">
                <span
                  className="absolute inset-y-0 left-0 w-1 bg-white rounded-tr-lg rounded-br-lg"
                  aria-hidden="true"
                ></span>
                <Link
                  className="inline-flex items-center w-full text-sm font-semibold -800 transition-colors duration-150 hover:-800 dark2hover:-200 dark2-100"
                  href="/"
                >
                  <svg
                    className="w-5 h-5"
                    aria-hidden="true"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                  </svg>
                  <span className="ml-4">Dashboard</span>
                </Link>
              </li>
            </ul>
            <ul>
              <li className="relative px-6 py-3">
                <Link
                  className="inline-flex items-center w-full text-sm font-semibold transition-colors duration-150 hover:-800 dark2hover:-200"
                  href="/charts"
                >
                  <svg
                    className="w-5 h-5"
                    aria-hidden="true"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
                  </svg>
                  <span className="ml-4">Charts</span>
                </Link>
              </li>
              <li className="relative px-6 py-3">
                <Link
                  className="inline-flex items-center w-full text-sm font-semibold transition-colors duration-150 hover:-800 dark2hover:-200"
                  href="/notifications"
                >
                  <svg
                    className="w-5 h-5"
                    aria-hidden="true"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
                  </svg>
                  <div className="relative w-fit">
                    <span className="ml-4">Notifications</span>
                    <span
                      aria-hidden="true"
                      className="absolute top-0 -right-4 inline-block w-3 h-3 transform translate-x-1 -translate-y-1 bg-red-600 border-2 border-white rounded-full dark2border-gray-800"
                    ></span>
                  </div>
                </Link>
              </li>
              <li className="relative px-6 py-3">
                <Link
                  className="inline-flex items-center w-full text-sm font-semibold transition-colors duration-150 hover:-800 dark2hover:-200"
                  href="/profile"
                >
                  <svg
                    className="w-5 h-5"
                    aria-hidden="true"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
                  </svg>
                  <span className="ml-4">Profile</span>
                </Link>
              </li>
              <li className="relative px-6 py-3">
                <Link
                  className="inline-flex items-center w-full text-sm font-semibold transition-colors duration-150 hover:-800 dark2hover:-200"
                  href="/assets"
                >
                  <svg
                    className="w-5 h-5"
                    aria-hidden="true"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
                  </svg>
                  <span className="ml-4">Assets</span>
                </Link>
              </li>
              <li className="relative px-6 py-3">
                <Link
                  className="inline-flex items-center w-full text-sm font-semibold transition-colors duration-150 hover:-800 dark2hover:-200"
                  href="/UploadFields"
                >
                  <svg
                    className="w-5 h-5"
                    aria-hidden="true"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
                  </svg>
                  <span className="ml-4">Upload Fields</span>
                </Link>
              </li>
              <li className="relative px-6 py-3">
                <Link
                  className="inline-flex items-center w-full text-sm font-semibold transition-colors duration-150 hover:-800 dark2hover:-200"
                  href="/UploadCategories"
                >
                  <svg
                    className="w-5 h-5"
                    aria-hidden="true"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
                  </svg>
                  <span className="ml-4">Upload Categories</span>
                </Link>
              </li>
              <li className="relative px-6 py-3">
                <button className="inline-flex items-center w-full text-sm font-semibold transition-colors duration-150 hover:-800 dark2hover:-200">
                  <svg
                    className="w-5 h-5"
                    aria-hidden="true"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
                  </svg>
                  <span className="ml-4">Logout</span>
                </button>
              </li>
            </ul>
            <div className="px-6 my-6">
              <Link
                href="/AddProduct"
                className="flex items-center justify-between w-full px-4 py-2 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-violet-500 border border-transparent rounded-lg hover:bg-violet-600 focus:outline-none focus:shadow-outline-purple capitalize"
              >
                Add New Product
                <span className="ml-2" aria-hidden="true">
                  +
                </span>
              </Link>
            </div>
          </div>
        </aside>
      )}
    </>
  );
};

export default Sidebar;
