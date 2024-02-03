import UpdateImages from "@/Components/UpdateImages";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import Modal from "react-modal";
import "react-toastify/dist/ReactToastify.css";
import {
  deleteObject,
  getDownloadURL,
  getMetadata,
  list,
  ref,
  uploadBytes,
} from "firebase/storage";
import { db, storage } from "@/db/firebase";
import { doc, setDoc, updateDoc } from "firebase/firestore";
import Image from "next/image";
import { fetchSpecificProduct } from "@/redux/specificProductData";
import { fetchCurrentUserData } from "@/redux/currentUserData";

Modal.setAppElement("#__next"); // Set the root element for the modal

const EditImages = () => {
  const [images, setImages] = useState([]);
  const [userData, setUserData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const router = useRouter();
  const prodId = router.query.id;

  const dispatch = useDispatch();
  const prodData = useSelector((state) => state.specificProduct.data);
  const uData = useSelector((state) => state.currentUserData.data);

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch(fetchSpecificProduct(prodId));
        dispatch(fetchCurrentUserData());
      } catch (error) {
        console.error("Error fetching product data:", error.message);
      }
    };

    fetchData();
  }, [dispatch, prodId]);

  useEffect(() => {
    // console.log("product data", prodData);
    // console.log("userData", uData);
    setUserData(uData);
  }, [uData, prodData]);

  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    const imageFiles = files.filter((file) => {
      const extension = file.name.split(".").pop();
      return ["jpg", "jpeg", "png", "gif", "bmp"].includes(
        extension.toLowerCase()
      );
    });
    setImages((prevImages) => [...prevImages, ...imageFiles]);
  };

  const handleUploadImages = () => {
    setIsModalOpen(true);
  };

  const confirmUpload = async () => {
    try {
      setIsModalOpen(false);
      const userFolder = `${userData.userName}-${userData.id}`;
      const productFolder = prodId;
      const path = `${userFolder}/${productFolder}/`;
      const folderRef = ref(storage, path);

      try {
        // Check if the folder reference exists
        // await getMetadata(folderRef);

        // List all items (files and subfolders) in the folder
        const result = await list(folderRef);

        // Delete each item in the folder
        const deletePromises = result.items.map((itemRef) =>
          deleteObject(itemRef)
        );

        // Wait for all delete operations to complete
        await Promise.all(deletePromises);

        console.log("All items in the folder have been deleted successfully");
      } catch (error) {
        if (error.code === "storage/object-not-found") {
          console.log("Folder does not exist in storage.");
        } else {
          console.error("Error getting metadata:", error);
        }
      }

      const imageUrls = await Promise.all(
        images.map(async (image, index) => {
          const imageRef = ref(
            storage,
            `${userFolder}/${productFolder}/image${index + 1}.jpg`
          );
          await uploadBytes(imageRef, image);
          const imageUrl = await getDownloadURL(imageRef);
          return imageUrl;
        })
      );

      const productRef = doc(db, userData.userName + userData.id, prodId);
      await updateDoc(productRef, {
        imageUrls: imageUrls,
      });

      toast.success("Product images uploaded successfully!");
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
    setIsModalOpen(false);
  };

  return (
    <div>
      <div className="flex gap-4 justify-center items-center mb-8">
        {prodData?.imageUrls &&
          prodData?.imageUrls.map((url, index) => (
            <div
              key={index}
              className=" bg-gray-200 flex justify-center items-center"
            >
              <Image
                height={844}
                width={844}
                src={url}
                alt={`Image ${index + 1}`}
                className="w-44 h-44"
              />
            </div>
          ))}
      </div>

      <UpdateImages images={images} setImages={setImages} />
      <div>
        <h1 className="w-full font-bold text-black text-start my-4 text-2xl capitalize">
          Add new images
        </h1>
        <input
          type="file"
          multiple
          onChange={handleFileSelect}
          className="w-full md:w-auto"
        />
      </div>

      <div>
        <button
          type="button"
          onClick={handleUploadImages}
          disabled={images.length === 0}
          className={`bg-blue-500 w-full text-white p-2 rounded-md mt-4 focus:outline-none hover:bg-blue-600 ${
            images.length === 0 && "opacity-50 cursor-not-allowed"
          }`}
        >
          Upload Images
        </button>
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
    </div>
  );
};

export default EditImages;
