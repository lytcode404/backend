import { fetchCurrentUserData } from "@/redux/currentUserData";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import Modal from "react-modal";
import { ToastContainer, toast } from "react-toastify";
import { db, storage } from "@/db/firebase";
import { doc, updateDoc } from "firebase/firestore";
const UploadFields = () => {
  const [fields, setFields] = useState([{ id: 1, value: "" }]);
  const [categoryFields, setcategoryFields] = useState([]);
  const [userData, setUserData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

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
    if (uData?.categoryFields) {
      setFields(
        uData.categoryFields.map((category, index) => ({
          id: index + 1,
          value: category,
        }))
      );
    }
  }, [uData]);

  const handleAddField = () => {
    setFields([...fields, { id: fields.length + 1, value: "" }]);
  };

  const handleDeleteField = (id) => {
    setFields((prevFields) =>
      prevFields
        .filter((field) => field.id !== id)
        .map((field, index) => ({ ...field, id: index + 1 }))
    );
  };

  const handleChange = (id, value) => {
    setFields((prevFields) =>
      prevFields.map((field) => (field.id === id ? { ...field, value } : field))
    );
  };

  const handleSubmit = async () => {
    setIsModalOpen(true);
    // console.log("Submitted Values:", filledValues);
  };

  const confirmUpload = async () => {
    const filledValues = fields
      ?.filter((field) => field.value.trim() !== "")
      .map((field) => field.value);

    if (filledValues.length <= 0) {
      toast.error("Please fill all the fields");
      return;
    }

    try {
      setIsModalOpen(false);
      setIsButtonDisabled(true);

      setcategoryFields(filledValues);
      console.log("Submitted Values:", filledValues);

      const currentUserRef = doc(db, "users", userData.id);
      await updateDoc(currentUserRef, {
        categoryFields: filledValues,
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
      <div className="bg-gray-100 min-h-screen py-6 sm:py-12">
        <div className="max-w-md mx-auto p-6 bg-white rounded-md shadow-md">
          {fields.map((field) => (
            <div key={field.id} className="mb-4 flex items-center">
              <input
                type="text"
                value={field.value}
                onChange={(e) => handleChange(field.id, e.target.value)}
                className="flex-grow px-4 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
                placeholder="Enter a value"
              />
              <button
                onClick={() => handleDeleteField(field.id)}
                className="ml-2 px-4 py-2 bg-red-500 text-white rounded-md focus:outline-none"
              >
                Delete
              </button>
            </div>
          ))}
          <button
            onClick={handleAddField}
            className="w-full mt-4 px-4 py-2 bg-green-500 text-white rounded-md focus:outline-none"
          >
            Add Option
          </button>
          <button
            onClick={handleSubmit}
            className="w-full mt-4 px-4 py-2 bg-blue-500 text-white rounded-md focus:outline-none"
          >
            Submit
          </button>
          {categoryFields.length > 0 && (
            <div className="mt-4">
              <p className="font-semibold">Submitted Values:</p>
              <ul>
                {categoryFields.map((value, index) => (
                  <li key={index}>{value}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={cancelUpload}
        contentLabel="Upload Warning"
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg p-6 shadow-md w-96"
      >
        <div className="text-center">
          <p className="text-lg font-bold mb-4">Upload Images</p>
          <p className="text-sm text-gray-600 mb-4">
            Are you sure you want to upload these Fields?
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

export default UploadFields;
