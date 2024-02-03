import React, { useEffect, useState } from "react";
import Chart1 from "./Chart1";
import Chart2 from "./Chart2";

const ChartComp = ({ data }) => {
  const [ingredientDetails, setIngredientDetails] = useState({});

  const trimIngredientName = (ingredient) => {
    const closingBracketIndex = ingredient.indexOf(")");
    if (closingBracketIndex !== -1) {
      return ingredient.substring(0, closingBracketIndex + 1);
    }
    return ingredient;
  };

  useEffect(() => {
    const details = {};

    Object.keys(data).forEach((classKey) => {
      const classObj = data[classKey];
      Object.keys(classObj).forEach((diseaseKey) => {
        const diseaseObj = classObj[diseaseKey];
        if (diseaseObj.hasOwnProperty("remedyIngredients")) {
          diseaseObj.remedyIngredients.forEach((ingredient) => {
            const trimmedIngredient = trimIngredientName(ingredient);
            if (!details[trimmedIngredient]) {
              details[trimmedIngredient] = {
                count: 1,
                classes: { [classKey]: [diseaseKey] },
              };
            } else {
              details[trimmedIngredient].count++;
              if (!details[trimmedIngredient].classes[classKey]) {
                details[trimmedIngredient].classes[classKey] = [diseaseKey];
              } else {
                details[trimmedIngredient].classes[classKey].push(diseaseKey);
              }
            }
          });
        }
      });
    });

    const detailsArray = Object.entries(details).map(([name, detail]) => ({
      name,
      ...detail,
    }));

    detailsArray.sort((a, b) => b.count - a.count);

    const sortedDetails = {};
    detailsArray.forEach((item) => {
      sortedDetails[item.name] = { ...item };
    });

    setIngredientDetails(sortedDetails);
  }, [data]);

  return (
    <div className="container mx-auto py-4 flex flex-col items-center justify-between">
      <div className="w-[85%] text-start mb-4">
        <h1 className="text-2xl font-bold mb-4">
          Ayurvedic Healing for Common Ailments
        </h1>
        <p>
          Nature&apos;s pharmacy holds the key to healing. Ayurveda illuminates
          the path to wellness, one holistic remedy at a time
        </p>
      </div>
      <Chart2 ingredientDetails={ingredientDetails} data={data} />
      <Chart1 ingredientDetails={ingredientDetails} data={data} />

      <div className="mt-4 w-full grid grid-cols-1 gap-3 justify-center items-center"></div>
    </div>
  );
};

export default ChartComp;
