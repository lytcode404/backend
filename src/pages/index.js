import { db } from "@/db/firebase";
import { fetchAllProductsData } from "@/redux/allProductsData";
import { deleteDoc, doc } from "firebase/firestore";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ITEMS_PER_PAGE = 10;

const Home = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState([]);
  const [fetchedData, setFetchedData] = useState([]);

  const dispatch = useDispatch();
  const productsData = useSelector((state) => state.allProducts.data);
  const status = useSelector((state) => state.allProducts.status);
  const error = useSelector((state) => state.allProducts.error);

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch(fetchAllProductsData());
      } catch (error) {
        console.error("Error fetching data:", error.message);
      }
    };

    fetchData();
  }, [dispatch]);

  useEffect(() => {
    setFetchedData(productsData || []); // Ensure productsData is not undefined
    // console.log(productsData);
  }, [productsData]);

  useEffect(() => {
    try {
      // Check if fetchedData is not null or undefined
      if (fetchedData) {
        // Convert object to array
        const dataArray = Object.values(fetchedData);

        // Calculate the range of data to display based on the current page
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE;

        // Get the subset of data to display
        const paginatedData = dataArray.slice(startIndex, endIndex);
        // console.log(paginatedData);
        setData(paginatedData);
      }
    } catch (error) {
      console.error("Error processing data:", error.message);
    }
  }, [currentPage, fetchedData]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  if (!data) {
    return "Loading...";
  }
  // prodSlug={product.name + product.id}
  // brand={brand.companyName}
  // genre={brand.genre}
  // productId={product.id}
  // brandId={brand.userId}
  // brand={brand.companyName}
  // /products/${prodSlug}?brand=${brand}&genre=${genre}&productId=${productId}&brandId=${brandId}&brandName=${brand}
  return (
    <>
      {status === "loading" && <p>Loading...</p>}
      {status === "failed" && <p>Error: {error}</p>}
      <div className="w-full overflow-hidden rounded-lg shadow-xs">
        <Table data={data} />
        <Pagination
          totalItems={fetchedData ? Object.keys(fetchedData).length : 0}
          itemsPerPage={ITEMS_PER_PAGE}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
      </div>
    </>
  );
};

export default Home;
const Table = ({ data }) => {
  // console.log(data);
  const handleDelete = async (id, collection) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this item?"
    );
    if (confirmDelete) {
      try {
        const compDoc = doc(db, collection, id);
        await deleteDoc(compDoc);
        toast.success("Data deleted successfully!", {
          autoClose: 1000,
        });
        setTimeout(() => {
          window.location.reload();
        }, 100);
      } catch (error) {
        console.error("Error deleting document: ", error);
        toast.error("Error deleting data. Please try again.");
      }
    }
  };

  return (
    <>
      <div className="w-full overflow-x-auto">
        <table className="w-full whitespace-no-wrap">
          <thead>
            <tr className="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b dark::border-gray-700 bg-gray-50 dark::text-gray-400 dark::bg-gray-800">
              <th className="px-4 py-3">Client</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Sales</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y dark::divide-gray-700 dark::bg-gray-800">
            {data.map((client) => (
              <tr key={client.id} className="text-gray-700 dark::text-gray-400">
                <td className="px-4 py-3">
                  <div className="flex items-center text-sm">
                    <div className="relative hidden w-8 h-8 mr-3 rounded-full md:block">
                      <Image
                        height={500}
                        width={500}
                        className="object-cover w-full h-full rounded-full"
                        src={client.imageUrls[0] || `/vercel.svg`}
                        alt=""
                        loading="lazy"
                      />
                      <div
                        className="absolute inset-0 rounded-full shadow-inner"
                        aria-hidden="true"
                      />
                    </div>
                    <div>
                      <p className="font-semibold capitalize">{client.name}</p>
                      <p className="text-xs text-gray-600 dark::text-gray-400">
                        {client.role}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm">
                  {client.price} {client.currency}
                </td>
                <td className="px-4 py-3 text-xs">
                  <span
                    className={`px-2 py-1 font-semibold leading-tight ${
                      client.sales <= 0
                        ? "text-red-700 bg-red-100"
                        : "text-green-700 bg-green-100"
                    } rounded-full dark::bg-green-700 dark::text-green-100`}
                  >
                    {client.sales}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm">{client.date}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center space-x-4 text-sm">
                    <Link
                      href={`/update/${client.id}`}
                      className="flex items-center justify-between px-2 py-2 text-sm font-medium leading-5 text-purple-600 rounded-lg dark::text-gray-400 focus:outline-none focus:shadow-outline-gray"
                      aria-label="Edit"
                    >
                      <svg
                        className="w-5 h-5"
                        aria-hidden="true"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                      </svg>
                    </Link>
                    <button
                      onClick={() =>
                        handleDelete(
                          client.id,
                          client.businessName + client.businessId
                        )
                      }
                      className="flex items-center justify-between px-2 py-2 text-sm font-medium leading-5 text-purple-600 rounded-lg dark::text-gray-400 focus:outline-none focus:shadow-outline-gray"
                      aria-label="Delete"
                    >
                      <svg
                        className="w-5 h-5"
                        aria-hidden="true"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ToastContainer />
    </>
  );
};

const Pagination = ({
  totalItems,
  itemsPerPage,
  currentPage,
  onPageChange,
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <div className="grid px-4 py-3 text-xs font-semibold tracking-wide text-gray-500 uppercase border-t  bg-gray-50 sm:grid-cols-9 dark::text-gray-400">
      <span className="flex items-center col-span-3">
        Showing {(currentPage - 1) * itemsPerPage + 1}-
        {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems}
      </span>
      <span className="col-span-2" />
      <span className="flex col-span-4 mt-2 sm:mt-auto sm:justify-end">
        <nav aria-label="Table navigation">
          <ul className="inline-flex items-center">
            <li>
              <button
                className="px-3 py-1 rounded-md rounded-l-lg focus:outline-none focus:shadow-outline-purple"
                aria-label="Previous"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <svg
                  className="w-4 h-4 fill-current"
                  aria-hidden="true"
                  viewBox="0 0 20 20"
                >
                  <path
                    d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                    clipRule="evenodd"
                    fillRule="evenodd"
                  />
                </svg>
              </button>
            </li>
            {pages.map((page) => (
              <li key={page}>
                <button
                  className={`px-3 py-1 rounded-md focus:outline-none focus:shadow-outline-purple ${
                    currentPage === page ? "bg-purple-600 text-white" : ""
                  }`}
                  onClick={() => onPageChange(page)}
                >
                  {page}
                </button>
              </li>
            ))}
            <li>
              <button
                className="px-3 py-1 rounded-md focus:outline-none focus:shadow-outline-purple"
                aria-label="Next"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                <svg
                  className="w-4 h-4 fill-current"
                  aria-hidden="true"
                  viewBox="0 0 20 20"
                >
                  <path
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10l-3.293-3.293a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                    fillRule="evenodd"
                  />
                </svg>
              </button>
            </li>
          </ul>
        </nav>
      </span>
    </div>
  );
};
