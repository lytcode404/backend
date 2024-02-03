import React, { useEffect, useState } from 'react'
import { Bar, Pie } from "react-chartjs-2";
import { ArcElement } from "chart.js";
import Chart from "chart.js/auto";
const barChartOptions = {
    plugins: {
      legend: {
        position: "top",
        align: "center",
        labels: {
          usePointStyle: true,
          color: "white",
        },
      },
    },
    scales: {
      x: {
        stacked: true,
        grid: {
          display: false,
        },
      },
      y: {
        stacked: true,
        beginAtZero: true,
      },
    },
  };
const Chart1 = ({data}) => {

    const [barChartData, setBarChartData] = useState({
        labels: [],
        datasets: [
          {
            label: "no. of diseases",
            data: [],
            backgroundColor: ["rgba(75, 192, 192, 0.6)"],
          },
          {
            label: "no. of ingredients",
            data: [],
            backgroundColor: ["rgba(255, 99, 12, 0.6)"],
          },
        ],
      });

    useEffect(() => {
        const classes = Object.keys(data);
        const diseaseCounts = [];
        const ingredientCounts = [];
    
        classes.forEach((className) => {
          const diseasesInClass = Object.keys(data[className]).length;
    
          let ingredientsInClass = 0;
          for (const diseaseName in data[className]) {
            ingredientsInClass +=
              data[className][diseaseName].remedyIngredients.length;
          }
    
          diseaseCounts.push(diseasesInClass);
          ingredientCounts.push(ingredientsInClass);
        });
        setBarChartData({
          labels: classes,
          datasets: [
            {
              label: "no. of diseases in class",
              data: diseaseCounts,
              backgroundColor: ["rgba(75, 192, 192, 0.6)"],
            },
            {
              label: "no. of ingredients in class",
              data: ingredientCounts,
              backgroundColor: ["rgba(255, 99, 12, 0.6)"],
            },
          ],
        });
      }, [data]);
    
// console.log(barChartData)
  return (
    <>{barChartData && <Bar data={barChartData} options={barChartOptions} />}</>
  )
}

export default Chart1