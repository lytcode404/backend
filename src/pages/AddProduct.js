import DynamicFields from "@/Components/DynamicFields";
import FixedFields from "@/Components/FixedFields";
import ImagesList from "@/Components/ImagesList";
import UpdateImages from "@/Components/UpdateImages";
import { auth, db, storage } from "@/db/firebase";
import { fetchCurrentUserData } from "@/redux/currentUserData";
import { collection, doc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BarLoader } from "react-spinners";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const List = () => {
  const [product, setProduct] = useState({
    imageUrls: [],
    name: "",
    price: "",
    strikePrice: "",
    availability: false,
    shortDescription: "",
    description: "",
    category: "",
  });

  const [tempFields, setTempFields] = useState({});

  const [images, setimages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const dispatch = useDispatch();
  const userData = useSelector((state) => state.currentUserData.data);
  const status = useSelector((state) => state.currentUserData.status);
  const error = useSelector((state) => state.currentUserData.error);

  useEffect(() => {
    dispatch(fetchCurrentUserData());
  }, [dispatch]);

  const getRandomId = () => {
    return Math.floor(1000 + Math.random() * 9000);
  };

  const showFieldEmptyToast = (fieldName) => {
    toast.error(`Please fill in the ${fieldName} field.`);
  };

  const handleSubmit = async () => {
    if (product.name === "") {
      showFieldEmptyToast("Name");
      return;
    }
    if (product.price === "") {
      showFieldEmptyToast("Price");
      return;
    }
    if (product.strikePrice === "") {
      showFieldEmptyToast("Strike Price");
      return;
    }
    if (product.shortDescription === "") {
      showFieldEmptyToast("Short Description");
      return;
    }
    if (product.description === "") {
      showFieldEmptyToast("Description");
      return;
    }

    if (images.length === 0) {
      showFieldEmptyToast("images are empty");
      return;
    }
    setIsButtonDisabled(true);
    try {
      const productId = product.name + getRandomId();
      const storageRef = ref(storage);
      const userFolder = `${userData.userName}-${userData.id}`;
      const productFolder = productId;

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

      function getCurrentDate() {
        const today = new Date();
        const day = String(today.getDate()).padStart(2, "0"); // Get the day and pad with leading zero if needed
        const month = String(today.getMonth() + 1).padStart(2, "0"); // Get the month (months are zero-based) and pad with leading zero
        const year = today.getFullYear(); // Get the full year

        const formattedDate = `${day}/${month}/${year}`;
        return formattedDate;
      }

      const currentDate = getCurrentDate();

      const productRef = doc(db, userData.userName + userData.id, productId);
      await setDoc(productRef, {
        imageUrls: imageUrls,
        name: product.name,
        price: product.price,
        strikePrice: product.strikePrice,
        currency: userData.countryCurrency,
        availability: product.availability,
        category: product?.category ? product.category : "none",
        shortDescription: product.shortDescription,
        description: product.description,
        categoryFields: tempFields,
        date: currentDate,
        sales: 0,
        businessContact: {
          ph: userData.phoneNumber,
          emial: userData.email,
        },
      });
      setIsButtonDisabled(false);
      showSuccessToast();
      setTimeout(() => {
        window.location.reload();
      }, 100);
    } catch (error) {
      console.error(error);
      showErrorToast(error.message || "An error occurred");
    }
  };

  const showSuccessToast = () => {
    toast.success("Product uploaded successfully!");
  };

  const showErrorToast = (errorMessage) => {
    toast.error(`Error: ${errorMessage}`);
  };

  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    const imageFiles = files.filter((file) => {
      const extension = file.name.split(".").pop();
      return ["jpg", "jpeg", "png", "gif", "bmp"].includes(
        extension.toLowerCase()
      );
    });
    setimages((prevImages) => [...prevImages, ...imageFiles]);
  };

  return (
    <div className="w-ful">
      {status === "loading" && <p>Loading...</p>}
      {status === "failed" && <p>Error: {error}</p>}
      {loading && (
        <div className="text-center mt-4">
          <BarLoader color="#36D7B7" css={override} />
          Uploading...
        </div>
      )}
      {/* <ImagesList setImages={setimages} images={images} /> */}
      <UpdateImages images={images} setImages={setimages} />
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

      <div className="grid grid-cols-2 gap-4 justify-start">
        <FixedFields
          setName={(value) =>
            setProduct((prevProduct) => ({ ...prevProduct, name: value }))
          }
          setPrice={(value) =>
            setProduct((prevProduct) => ({ ...prevProduct, price: value }))
          }
          setStrikePrice={(value) =>
            setProduct((prevProduct) => ({
              ...prevProduct,
              strikePrice: value,
            }))
          }
          setAvailability={(value) =>
            setProduct((prevProduct) => ({
              ...prevProduct,
              availability: value,
            }))
          }
          setCategory={(value) =>
            setProduct((prevProduct) => ({ ...prevProduct, category: value }))
          }
          setShortDescription={(value) =>
            setProduct((prevProduct) => ({
              ...prevProduct,
              shortDescription: value,
            }))
          }
          setDescription={(value) =>
            setProduct((prevProduct) => ({
              ...prevProduct,
              description: value,
            }))
          }
        />
        <DynamicFields
          tempFields={tempFields}
          setTempFields={setTempFields}
          categoryFields={userData?.categoryFields && userData?.categoryFields}
        />
      </div>

      <ToastContainer />
      <div>
        <button
          type="button"
          onClick={handleSubmit}
          className={`bg-blue-500 w-full text-white p-2 rounded-md mt-4 focus:outline-none hover:bg-blue-600 ${
            isButtonDisabled ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={isButtonDisabled}
        >
          {isButtonDisabled ? "Uploading..." : "Upload Product"}
        </button>
      </div>
    </div>
  );
};

export default List;
