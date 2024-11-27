import React from "react";
import { Line } from "react-chartjs-2";
import { useTheme } from "../../context/theme-provider";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register the chart components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const LineChart = ({ data, label }) => {
  const { theme } = useTheme();

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const chartData = {
    labels: months,
    datasets: [
      {
        label: label,
        data: data,
        borderColor: theme === "light" ? "#3749A6" : "#ffffff",
        backgroundColor: "rgba(55, 73, 166, 0.3)",
        borderWidth: 3,
        fill: true,
        pointBackgroundColor: "#ffffff",
        pointBorderColor: "#3749A6",
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: theme === "light" ? "#3749A6" : "#ffffff",
          font: { size: 14 },
        },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return `${context.dataset.label}: ${context.parsed.y}`;
          },
        },
        backgroundColor: "#3749A6",
        titleColor: "#ffffff",
        bodyColor: "#ffffff",
        borderWidth: 1,
        borderColor: "#717cb6",
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: {
          color: theme === "light" ? "#3749A6" : "#ffffff",
        },
      },
      y: {
        grid: { color: "#f0f0f0" },
        ticks: {
          color: theme === "light" ? "#3749A6" : "#ffffff",
          callback: (value) => value.toLocaleString(),
        },
      },
    },
  };

  return <Line data={chartData} options={options} />;
};

export default LineChart;
