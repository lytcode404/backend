import { auth, db } from "@/db/firebase";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { collection, getDocs, query, where } from "firebase/firestore";
// Async Thunk for fetching product data
export const fetchAllProductsData = createAsyncThunk(
  "allProducts/fetchAllProductsData",
  async () => {
    try {
      const currentUserId = auth.currentUser.uid;
      const usersCollection = collection(db, "users");
      const q = query(usersCollection, where("id", "==", currentUserId));

      const usersSnapshot = await getDocs(q);

      if (usersSnapshot.empty) {
        // User not found
        return null;
      }

      // Extract user data from the document
      const userData = usersSnapshot.docs[0].data();

      // Check if userData exists
      if (!userData) {
        // Handle the case where there's no user data (e.g., user not found)
        return {};
      }

      const ref = userData.userName + userData.id;
      const productsCollection = collection(db, ref);
      const productsSnapshot = await getDocs(productsCollection);

      // Create an object where the document IDs act as keys
      const productsData = {};
      productsSnapshot.docs.forEach((doc) => {
        productsData[doc.id] = {
          id: doc.id,
          businessName: userData.userName,
          businessId: userData.id,
          ...doc.data(),
        };
      });

      return productsData;
    } catch (error) {
      throw error;
    }
  }
);

// Product Slice
export const allProductsSlice = createSlice({
  name: "allProducts",
  initialState: {
    data: null,
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllProductsData.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAllProductsData.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload;
      })
      .addCase(fetchAllProductsData.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});
