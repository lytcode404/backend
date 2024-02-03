import { fetchCurrentUserData } from "@/redux/currentUserData";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const Profile = () => {
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.currentUserData.data);
  const status = useSelector((state) => state.currentUserData.status);
  const error = useSelector((state) => state.currentUserData.error);

  useEffect(() => {
    // Dispatch the fetchUserData action when the component mounts
    dispatch(fetchCurrentUserData());
  }, [dispatch]);
  return (
    <div>
      profile{" "}
      <div>
        {status === "loading" && <p>Loading...</p>}
        {status === "failed" && <p>Error: {error}</p>}
        {status === "succeeded" && (
          <div>
            <h2>User Profile</h2>
            <p>Name: {userData.userName}</p>
            <p>ID: {userData.id}</p>
            <p>Company: {userData.companyName}</p>
            <p>Country: {userData.country}</p>
            {/* Add other fields as needed */}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
