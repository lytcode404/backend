import { auth, db } from "@/db/firebase";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { collection, getDocs, query, where } from "firebase/firestore";

export const fetchCurrentUserData = createAsyncThunk(
  "currentUserData/fetchCurrentUserData",
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
      return userData;
    } catch (error) {
      throw error;
    }
  }
);

// currentUserData Slice
export const currentUserDataSlice = createSlice({
  name: "currentUserData",
  initialState: {
    data: null,
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCurrentUserData.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCurrentUserData.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload;
      })
      .addCase(fetchCurrentUserData.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});
