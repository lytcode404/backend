import React, { useEffect, useState } from 'react'
import { Bar, Pie } from "react-chartjs-2";
import { ArcElement } from "chart.js";
import Chart from "chart.js/auto";

const pieChartOptions = {
    plugins: {
      legend: {
        position: "top",
        align: "center",
        labels: {
          usePointStyle: true,
          color: "White",
        },
      },
    },
  };
const Chart2 = ({data, ingredientDetails}) => {

    const [barChartData2, setBarChartData2] = useState({
        labels: [],
        datasets: [
          {
            label: "frequncy of use as ingredient in diseases",
            data: [],
            backgroundColor: ["rgba(75, 192, 192, 0.6)"],
          },
          {
            label: "frequncy of classes",
            data: [],
            backgroundColor: ["rgba(255, 99, 12, 0.6)"],
          },
        ],
      });

    useEffect(() => {
        const top10Ingredients = Object.keys(ingredientDetails).slice(0, 10);
        const slicedObject = {};
        for (const key of top10Ingredients) {
          slicedObject[key] = ingredientDetails[key];
        }
        const frequencyOfClasses = top10Ingredients.map((ingredient) => {
          const normalizedIngredient = ingredient.trim();
          const classesObject = ingredientDetails[normalizedIngredient]?.classes;
          const classesLength = classesObject
            ? Object.keys(classesObject).length
            : 0;
          return classesLength;
        });
    
        const frequencyOfDiseases = Object.keys(slicedObject).map((ingredient) => {
          let count = 0;
          const ingredientData = slicedObject[ingredient];
          for (const diseaseList of Object.values(ingredientData.classes)) {
            count += diseaseList.length;
          }
    
          return count;
        });
    
        setBarChartData2({
            labels: top10Ingredients,
            datasets: [
              {
                label: "frequncy of use as ingredient in Classes",
                data: frequencyOfClasses,
                backgroundColor: ["rgba(75, 192, 192, 0.6)"],
              },
              {
                label: "frequncy of use as ingredient in Diseases",
                data: frequencyOfDiseases,
                backgroundColor: ["rgba(255, 99, 12, 0.6)"],
              },
            ],
          });
      }, [ingredientDetails]);

    //   console.log(barChartData2)
      
  return (
    <>   
    {barChartData2 && <Bar data={barChartData2} options={pieChartOptions} />}</>
  )
}

export default Chart2