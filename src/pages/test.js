import { fetchAllProductsData } from "@/redux/allProductsData";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const Test = () => {
  const [data, setData] = useState([]);
  const dispatch = useDispatch();
  const productsData = useSelector((state) => state.allProducts.data);
  const status = useSelector((state) => state.allProducts.status);
  const error = useSelector((state) => state.allProducts.error);

  useEffect(() => {
    dispatch(fetchAllProductsData());
  }, [dispatch]);

  useEffect(() => {
    setData(productsData);
    console.log(productsData);
  }, [productsData]);

  return (
    <div>
      {status === "loading" && <p>Loading...</p>}
      {status === "failed" && <p>Error: {error}</p>}
      {productsData == null && "null"}
    </div>
  );
};

export default Test;
