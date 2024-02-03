import React, { useState } from "react";

const DynamicFields = ({ tempFields, setTempFields, categoryFields }) => {
  const handleFieldChange = (category, value) => {
    setTempFields((prevTempFields) => ({
      ...prevTempFields,
      [category]: value,
    }));
  };

  return (
    <div className="w-full mx-auto mt-8 p-4 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-semibold mb-4">Dynamic Fields</h2>
      {categoryFields?.map((category) => (
        <div key={category} className="mb-4">
          <label
            htmlFor={category}
            className="block text-gray-600 font-semibold mb-2"
          >
            {category}
          </label>
          <input
            type="text"
            id={category}
            value={tempFields[category] || ""}
            onChange={(e) => handleFieldChange(category, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
          />
        </div>
      ))}
    </div>
  );
};

export default DynamicFields;
