import { fetchCurrentUserData } from "@/redux/currentUserData";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import Modal from "react-modal";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { db, storage } from "@/db/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { ToastContainer, toast } from "react-toastify";
import Image from "next/image";
const AddAssets = ({ isEditBtnClicked, setIsEditBtnClicked }) => {
  const [bannerImage, setBannerImage] = useState(null);
  const [logoImage, setLogoImage] = useState(null);
  const [isFormValid, setIsFormValid] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [userData, setUserData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
    const files = Array.from(e.target.files);
    const file = files[0];

    if (e.target.files[0]) {
      setBannerImage(file);
    }
  };

  const handleLogoImageChange = (e) => {
    const files = Array.from(e.target.files);
    const file = files[0];

    if (e.target.files[0]) {
      setLogoImage(file);
    }
  };

  const handleUploadImages = () => {
    setIsModalOpen(true);
  };

  const confirmUpload = async () => {
    try {
      setIsModalOpen(false);
      setIsButtonDisabled(true);

      const userFolder = `${userData.userName}-${userData.id}`;

      const bannerRef = ref(storage, `${userFolder}/assets/bannerImg.jpg`);
      await uploadBytes(bannerRef, bannerImage);
      const bannerImageUrl = await getDownloadURL(bannerRef);

      const logoRef = ref(storage, `${userFolder}/assets/logo.png`);
      await uploadBytes(logoRef, logoImage);
      const logoImageUrl = await getDownloadURL(logoRef);

      const currentUserRef = doc(db, "users", userData.id);
      await updateDoc(currentUserRef, {
        assets: {
          bannerImg: bannerImageUrl,
          logoImg: logoImageUrl,
        },
      });

      toast.success("User Assets uploaded successfully!");
      setIsButtonDisabled(true);
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error("Error during image upload:", error);
      toast.error(`Error: ${error.message}`);
      setIsModalOpen(false);
    }
  };

  const cancelUpload = () => {
    setIsButtonDisabled(false);
    setIsModalOpen(false);
  };
  return (
    <>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-3xl font-semibold mb-6">Upload Your Assets</h1>
          <div className="space-y-8">
            <div>
              <h2 className="text-xl font-semibold mb-3">Upload Your Banner</h2>
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
                <Image
                  height={844}
                  width={844}
                  src={URL.createObjectURL(bannerImage)}
                  alt={`Image`}
                  className="mt-3 w-32 h-32 object-cover rounded-lg"
                />
              )}
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-3">Upload Your Logo</h2>
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
                <Image
                  height={844}
                  width={844}
                  src={URL.createObjectURL(logoImage)}
                  alt={`logo`}
                  className="mt-3 w-32 h-32 object-cover rounded-lg"
                />
              )}
            </div>
          </div>
          <button
            onClick={handleUploadImages}
            className={`block w-full px-4 py-2 mt-4 text-sm font-medium leading-5 text-center text-white transition-colors duration-150 bg-blue-600 border border-transparent rounded-lg ${
              isFormValid && !isButtonDisabled
                ? "active:bg-blue-600 hover:bg-blue-700 focus:outline-none focus:shadow-outline-purple"
                : "cursor-not-allowed opacity-50"
            }`}
            disabled={!isFormValid && isButtonDisabled}
          >
            {isButtonDisabled ? "Uploading..." : "Upload Assets"}
          </button>
          <hr className="my-4" />
          <p className="mt-4">
            <button
              onClick={() => {
                setIsEditBtnClicked(true);
              }}
              className="text-sm font-medium text-blue-500 hover:underline"
            >
              Edit Assets
            </button>
          </p>
        </div>
      </div>
      {/* Modal for the warning */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={cancelUpload}
        contentLabel="Upload Warning"
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg p-6 shadow-md w-96"
      >
        <div className="text-center">
          <p className="text-lg font-bold mb-4">Upload Images</p>
          <p className="text-sm text-gray-600 mb-4">
            Are you sure you want to upload these images?
          </p>
          <div className="flex justify-center space-x-4">
            <button
              onClick={confirmUpload}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 focus:outline-none"
            >
              Yes
            </button>
            <button
              onClick={cancelUpload}
              className="bg-gray-300 text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-400 focus:outline-none"
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>
      <ToastContainer />
    </>
  );
};

export default AddAssets;
