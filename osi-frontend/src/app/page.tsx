"use client";

import { useState } from "react";
import axios from "axios";
import InputForm from "./components/Osi_Components/InputForm"
import OsiVisualization from "./components/Osi_Components/OsiVisualization";

interface NetworkLayerData {
  IP: string;
  Hops: number;
  Routers: string[];
}

interface OsiData {
  Layer3_Network: NetworkLayerData;
}

export default function App() {
  const [url, setUrl] = useState<string>("https://");
  const [osiData, setOsiData] = useState<OsiData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isp, setIsp] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!url) return alert("Enter a valid URL");
    setLoading(true);
    setError("");
    setOsiData(null);
    setCurrentStep(0);
    setIsp(null);

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/analyze`,
        { url }
      );
      setOsiData(response.data);

      // Fetch ISP details
      const { data: ipData } = await axios.get("https://api64.ipify.org?format=json");
      const { data: ispData } = await axios.get(`https://ipinfo.io/${ipData.ip}/json`);
      setIsp(ispData.org || "Unknown ISP");

      // Simulate OSI layer visualization
      let step = 0;
      const osiInterval = setInterval(() => {
        step++;
        setCurrentStep(step);
        if (step === 7) clearInterval(osiInterval);
      }, 800);
    } catch (err) {
      setError("Error fetching data. Please check the URL.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold mb-4 text-blue-600">OSI Layer Visualizer</h1>
      <InputForm url={url} setUrl={setUrl} handleSubmit={handleSubmit} loading={loading} />
      {error && <p className="text-red-500 mt-2">{error}</p>}

      {osiData && <OsiVisualization osiData={osiData} url={url} currentStep={currentStep} isp={isp} />}
    </div>
  );
}
