import { fetchCurrentUserData } from "@/redux/currentUserData";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";

const EditAssets = ({ isEditBtnClicked, setIsEditBtnClicked }) => {
  const [bannerImage, setBannerImage] = useState(null);
  const [logoImage, setLogoImage] = useState(null);
  const [isFormValid, setIsFormValid] = useState(false);

  const [userData, setUserData] = useState([]);

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
    setUserData(uData);
  }, [uData]);

  useEffect(() => {
    setIsFormValid(bannerImage !== null && logoImage !== null);
  }, [bannerImage, logoImage]);

  const handleBannerImageChange = (e) => {
    if (e.target.files[0]) {
      setBannerImage(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleLogoImageChange = (e) => {
    if (e.target.files[0]) {
      setLogoImage(URL.createObjectURL(e.target.files[0]));
    }
  };
  return (
    <div>
      <div className="flex gap-4 justify-center items-center mb-8">
        {userData?.assets && (
          <div
            key={userData.id}
            className=" bg-gray-200 flex justify-center items-center gap-4 w-full p-4"
          >
            <Image
              height={844}
              width={844}
              src={userData.assets.bannerImg}
              alt={`Image banner`}
              className="w-44 h-44"
            />
            <Image
              height={844}
              width={844}
              src={userData.assets.logoImg}
              alt={`Image logo`}
              className="w-44 h-44"
            />
          </div>
        )}
      </div>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-3xl font-semibold mb-6">Edit Your Assets</h1>
          <div className="space-y-8">
            <div>
              <h2 className="text-xl font-semibold mb-3">Edit Your Banner</h2>
              <div className="bg-gray-200 p-4 rounded-lg">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  id="bannerUpload"
                  onChange={handleBannerImageChange}
                />
                <label
                  htmlFor="bannerUpload"
                  className="cursor-pointer bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
                >
                  Select Image
                </label>
              </div>
              {bannerImage && (
                <img
                  src={bannerImage}
                  alt="Banner Preview"
                  className="mt-3 w-32 h-32 object-cover rounded-lg"
                />
              )}
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-3">Edit Your Logo</h2>
              <div className="bg-gray-200 p-4 rounded-lg">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  id="logoUpload"
                  onChange={handleLogoImageChange}
                />
                <label
                  htmlFor="logoUpload"
                  className="cursor-pointer bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
                >
                  Select Image
                </label>
              </div>
              {logoImage && (
                <img
                  src={logoImage}
                  alt="Logo Preview"
                  className="mt-3 w-32 h-32 object-cover rounded-lg"
                />
              )}
            </div>
          </div>
          <button
            className={`block w-full px-4 py-2 mt-4 text-sm font-medium leading-5 text-center text-white transition-colors duration-150 bg-blue-600 border border-transparent rounded-lg ${
              isFormValid
                ? "active:bg-blue-600 hover:bg-blue-700 focus:outline-none focus:shadow-outline-purple"
                : "cursor-not-allowed opacity-50"
            }`}
            disabled={!isFormValid}
          >
            Update
          </button>
          <hr className="my-4" />
          <p className="mt-4">
            <button
              onClick={() => {
                setIsEditBtnClicked(false);
              }}
              className="text-sm font-medium text-blue-500 hover:underline"
            >
              Add Assets
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default EditAssets;
