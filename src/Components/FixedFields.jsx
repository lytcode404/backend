import { fetchCurrentUserData } from "@/redux/currentUserData";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";

const FixedFields = ({
  setName,
  setPrice,
  setStrikePrice,
  setAvailability,
  setShortDescription,
  setDescription,
  setCategory,
}) => {
  const [AllCategories, setAllCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");

  const dispatch = useDispatch();
  const uData = useSelector((state) => state.currentUserData.data);

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch(fetchCurrentUserData());
      } catch (error) {
        console.error("Error fetching product data:", error.message);
      }
    };

    fetchData();
  }, [dispatch]);

  useEffect(() => {
    setAllCategories(uData?.AllCategories ? uData?.AllCategories : []);
  }, [uData]);

  const handleSelect = (event) => {
    const selectedValue = event.target.value;
    setSelectedCategory(selectedValue);
    setCategory(selectedValue);
  };

  return (
    <div className="bg-white p-4 rounded-md shadow-md">
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Name:
        </label>
        <input
          type="text"
          className="border border-gray-300 p-2 w-full rounded-md focus:outline-none focus:border-blue-500"
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Price:
        </label>
        <input
          type="number"
          className="border border-gray-300 p-2 w-full rounded-md focus:outline-none focus:border-blue-500"
          onChange={(e) => setPrice(e.target.value)}
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          strike Price:
        </label>
        <input
          type="number"
          className="border border-gray-300 p-2 w-full rounded-md focus:outline-none focus:border-blue-500"
          onChange={(e) => setStrikePrice(e.target.value)}
        />
      </div>

      <div className="relative w-full text-left mb-6">
        <select
          value={selectedCategory}
          onChange={handleSelect}
          className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        >
          <option value="" disabled>
            Select a category
          </option>
          {AllCategories &&
            AllCategories.map((category, index) => (
              <option key={index} value={category}>
                {category}
              </option>
            ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="flex items-center text-gray-700 text-sm font-bold mb-2">
          <input
            type="checkbox"
            className="form-checkbox mr-2 h-4 w-4 text-blue-500"
            onChange={(e) => setAvailability(e.target.checked)}
          />
          Availability
        </label>
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Short Description:
        </label>
        <textarea
          className="border border-gray-300 p-2 w-full rounded-md focus:outline-none focus:border-blue-500"
          onChange={(e) => setShortDescription(e.target.value)}
        />
      </div>

      <div>
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Description:
        </label>
        <textarea
          className="border border-gray-300 p-2 w-full rounded-md focus:outline-none focus:border-blue-500"
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
    </div>
  );
};

export default FixedFields;
