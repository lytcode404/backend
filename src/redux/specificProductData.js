import { auth, db } from "@/db/firebase";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";

// Async Thunk for fetching a specific product data
export const fetchSpecificProduct = createAsyncThunk(
  "specificProduct/fetchSpecificProduct",
  async (productId) => {
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
      const productDocRef = doc(db, ref, productId);
      const productDocSnapshot = await getDoc(productDocRef);

      if (productDocSnapshot.exists()) {
        // Return the specific product data
        return {
          id: productDocSnapshot.id,
          ...productDocSnapshot.data(),
        };
      } else {
        // Handle the case where the product with the given ID is not found
        return {};
      }
    } catch (error) {
      throw error;
    }
  }
);

// specificProduct Slice
export const specificProductSlice = createSlice({
  name: "specificProduct",
  initialState: {
    data: null,
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSpecificProduct.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchSpecificProduct.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload;
      })
      .addCase(fetchSpecificProduct.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});
