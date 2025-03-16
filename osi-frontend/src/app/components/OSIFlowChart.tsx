"use client";

import { Bar } from "react-chartjs-2";
import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface OSIFlowChartProps {
  osiData: Record<string, number>;
}

export default function OSIFlowChart({ osiData }: OSIFlowChartProps) {
  const labels = Object.keys(osiData);
  const data = {
    labels,
    datasets: [
      {
        label: "Data Packets at Each Layer",
        data: Object.values(osiData),
        backgroundColor: "rgba(54, 162, 235, 0.6)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="mt-6 w-full max-w-2xl bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold text-gray-700 mb-2">OSI Layer Data Flow</h2>
      <Bar data={data} />
    </div>
  );
}
