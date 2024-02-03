import { auth } from "@/db/firebase";
import { fetchCurrentUserData } from "@/redux/currentUserData";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";

const Header = ({ photoUrl, isSidebarOpen, setIsSidebarOpen }) => {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const [fetchedData, setFetchedData] = useState([]);
  const [data, setData] = useState([]);
  const dispatch = useDispatch();
  const usersData = useSelector((state) => state.currentUserData.data);
  const status = useSelector((state) => state.currentUserData.status);
  const error = useSelector((state) => state.currentUserData.error);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Only fetch data when the status is "idle"
        if (status === "idle") {
          dispatch(fetchCurrentUserData());
        }
      } catch (error) {
        console.error("Error fetching data:", error.message);
      }
    };

    fetchData();
  }, [dispatch]);

  useEffect(() => {
    if (usersData) {
      // Update fetchedData with usersData
      setFetchedData(usersData);
      // console.log("Fetched Data:", fetchedData);
    }
  }, [usersData, fetchedData]);

  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };

  const closeProfileMenu = () => {
    setIsProfileMenuOpen(false);
  };

  return (
    <header className="bg-white fixed z-10 w-full container mx-auto py-4 shadow-md">
      <div className="container flex items-center justify-between h-full px-6 mx-auto  dark2text-purple-300 text-black">
        <Link href={`/`} className="text-xl font-bold">
          Phoenix
        </Link>

        {/* <!-- Search input --> */}
        {/* <div className="flex justify-center flex-1 lg:mr-32 ">
          <div className="relative w-full max-w-xl text-gray-400 mr-6 focus-within:text-gray-500 h-12 p-1">
            <div className="absolute inset-y-0 flex items-center pl-2">
              <svg
                className="w-4 h-4"
                aria-hidden="true"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </div>
            <input
              className="w-full h-full pl-8 pr-2 text-sm text-gray-700 placeholder-gray-600 bg-gray-200 border-0 rounded-md  focus:placeholder-gray-500 focus:bg-gray-150  focus:outline-none "
              type="text"
              placeholder="Search"
              aria-label="Search"
            />
          </div>
        </div> */}
        <ul className="flex items-center flex-shrink-0 space-x-6">
          {/* <!-- Sidebar door --> */}
          <li className="flex">
            <button
              className="rounded-md focus:outline-none focus:shadow-outline-purple"
              aria-label="Toggle color mode"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              {isSidebarOpen ? (
                <Image
                  src={`/opened-door.png`}
                  alt=""
                  height={44}
                  width={44}
                  className="h-4 w-4"
                />
              ) : (
                <Image
                  src={`/closed-door.png`}
                  alt=""
                  height={24}
                  width={24}
                  className="h-4 w-4"
                />
              )}
            </button>
          </li>
          {/* <!-- Notifications menu --> */}
          <li className="relative">
            <Link
              href={`/notifications`}
              className="relative align-middle rounded-md focus:outline-none focus:shadow-outline-purple"
              aria-label="Notifications"
              aria-haspopup="true"
            >
              <svg
                className="w-5 h-5"
                aria-hidden="true"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z"></path>
              </svg>
              {/* <!-- Notification badge --> */}
              <span
                aria-hidden="true"
                className="absolute top-0 right-0 inline-block w-3 h-3 transform translate-x-1 -translate-y-1 bg-red-600 border-2 border-white rounded-full dark2border-gray-800"
              ></span>
            </Link>
          </li>
          {/* <!-- Profile menu --> */}
          <li className="relative">
            <button
              className="align-middle rounded-full focus:shadow-outline-purple focus:outline-none"
              onClick={toggleProfileMenu}
              onKeyDown={closeProfileMenu}
              aria-label="Account"
              aria-haspopup="true"
            >
              <div className="flex items-center text-sm">
                <div className="relative w-5 h-5 mr-3 rounded-full">
                  <div className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-400">
                    <p className="text-white text-sm">
                      {fetchedData?.userName?.charAt(0).toUpperCase()}
                    </p>
                  </div>
                  <div
                    className="absolute inset-0 rounded-full shadow-inner"
                    aria-hidden="true"
                  />
                </div>
              </div>
            </button>
            {isProfileMenuOpen && (
              <ul
                className="absolute right-0 w-56 p-2 mt-2 space-y-2 text-gray-600 bg-white border border-gray-100 rounded-md shadow-md dark2border-gray-700 dark2text-gray-300 dark2bg-gray-700"
                aria-label="submenu"
              >
                <li className="flex">
                  <Link
                    className="inline-flex items-center w-full px-2 py-1 text-sm font-semibold transition-colors duration-150 rounded-md hover:bg-gray-100 hover:text-gray-800 dark2hover:bg-gray-800 dark2hover:text-gray-200"
                    href=""
                  >
                    <svg
                      className="w-4 h-4 mr-3"
                      aria-hidden="true"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                    </svg>
                    <span>Profile</span>
                  </Link>
                </li>
                <li className="flex">
                  <a
                    className="inline-flex items-center w-full px-2 py-1 text-sm font-semibold transition-colors duration-150 rounded-md hover:bg-gray-100 hover:text-gray-800 dark2hover:bg-gray-800 dark2hover:text-gray-200"
                    href="#"
                  >
                    <svg
                      className="w-4 h-4 mr-3"
                      aria-hidden="true"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                      <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    </svg>
                    <span>Settings</span>
                  </a>
                </li>
                <li className="flex">
                  <Link
                    className="inline-flex items-center w-full px-2 py-1 text-sm font-semibold transition-colors duration-150 rounded-md hover:bg-gray-100 hover:text-gray-800 dark2hover:bg-gray-800 dark2hover:text-gray-200"
                    href=""
                  >
                    <svg
                      className="w-4 h-4 mr-3"
                      aria-hidden="true"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path>
                    </svg>
                    <span onClick={() => auth.signOut()}>Logout</span>
                  </Link>
                </li>
              </ul>
            )}
          </li>
        </ul>
      </div>
    </header>
  );
};

export default Header;
