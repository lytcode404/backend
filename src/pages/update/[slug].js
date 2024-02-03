import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

const Slug = () => {
  const router = useRouter();
  const prodId = router.query.slug;

  return (
    <div className="flex justify-center items-start h-screen pt-10 w-full">
      <div className="flex flex-col space-y-4">
        {/* Edit Images */}
        <Link legacyBehavior href={`/EditImages?id=${prodId}`}>
          <a className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Edit Images
          </a>
        </Link>

        {/* Edit Fixed Fields */}
        <Link legacyBehavior href={`/EditFixedFields?id=${prodId}`}>
          <a className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
            Edit Fields
          </a>
        </Link>

        {/* Edit Dynamic Fields */}
        {/* <Link legacyBehavior href={`/EditDynamicFields?id=${prodId}`}>
          <a className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded">
            Edit Dynamic Fields
          </a>
        </Link> */}
      </div>
    </div>
  );
};

export default Slug;
