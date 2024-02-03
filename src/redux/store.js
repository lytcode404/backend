import { configureStore } from "@reduxjs/toolkit";
import { allProductsSlice, productSlice } from "./allProductsData";
import { currentUserDataSlice } from "./currentUserData";
import { specificProductSlice } from "./specificProductData";

// Configure the Redux store
const store = configureStore({
  reducer: {
    currentUserData: currentUserDataSlice.reducer,
    allProducts: allProductsSlice.reducer,
    specificProduct: specificProductSlice.reducer, // Add the product reducer to the store
  },
});

export default store;
