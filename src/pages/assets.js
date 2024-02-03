import AddAssets from "@/Components/AddAssets";
import EditAssets from "@/Components/EditAssets";
import React, { useEffect, useState } from "react";

const Assets = () => {
  const [isEditBtnClicked, setIsEditBtnClicked] = useState(false);

  return (
    <div className="bg-gray-100 min-h-screen py-6 sm:py-12">
      {!isEditBtnClicked ? (
        <AddAssets
          isEditBtnClicked={isEditBtnClicked}
          setIsEditBtnClicked={setIsEditBtnClicked}
        />
      ) : (
        <EditAssets
          isEditBtnClicked={isEditBtnClicked}
          setIsEditBtnClicked={setIsEditBtnClicked}
        />
      )}
    </div>
  );
};

export default Assets;
