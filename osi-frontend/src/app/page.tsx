"use client";

import { useState } from "react";
import axios from "axios";
import ThreeWayHandshake from "./components/ThreeWayHandshake";
import RouterVisualization from "./components/RouterVisualization";
import DnsLookup from "./components/DnsLookup";

export default function App() {
  const [url, setUrl] = useState<string>("");
  const [osiData, setOsiData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [currentHop, setCurrentHop] = useState<number>(-1);
  const [isp, setIsp] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!url) return alert("Enter a valid URL");
    setLoading(true);
    setError("");
    setOsiData(null);
    setCurrentStep(0);
    setCurrentHop(-1);
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

      // Simulate hop-by-hop animation
      let hop = -1;
      const hopInterval = setInterval(() => {
        hop++;
        setCurrentHop(hop);
        if (hop === response.data.Layer3_Network.Routers.length) clearInterval(hopInterval);
      }, 1000);
    } catch (err) {
      setError("Error fetching data. Please check the URL.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const osiLayers = [
    { title: "Application Layer", info: <DnsLookup domain={url} /> },
    { title: "Presentation Layer", info: "SSL/TLS Encryption" },
    { title: "Session Layer", info: "TCP Handshake Verified" },
    { title: "Transport Layer", info: <ThreeWayHandshake /> },
    {
      title: "Network Layer",
      info: (
        <>
          <p className="text-gray-700">🌍 Destination IP: {osiData?.Layer3_Network.IP}</p>
          <p className="text-gray-700">🛜 Total Hops: {osiData?.Layer3_Network.Hops}</p>
          {isp && <p className="text-gray-700 font-medium">🌐 Your ISP: {isp}</p>}
          <p className="font-semibold text-gray-900 mt-2">📍 Packet Journey:</p>
          <RouterVisualization routers={osiData?.Layer3_Network.Routers}  />
        </>
      ),
    },
    { title: "Data Link Layer", info: "MAC Address Info" },
    { title: "Physical Layer", info: "Network Interface Info" },
  ];

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold mb-4 text-blue-600">OSI Layer Visualizer</h1>
      <div className="flex gap-2 mt-2">
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter website URL"
          className="p-2 border-2 border-blue-500 rounded-lg w-80 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-700 placeholder-gray-500 text-gray-700"
        />
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition disabled:bg-gray-400"
        >
          {loading ? "Analyzing..." : "Visualize"}
        </button>
      </div>
      {error && <p className="text-red-500 mt-2">{error}</p>}

      {osiData && (
        <div className="mt-6 w-full max-w-4xl bg-gray-200 p-4 rounded-lg shadow-md">
          {osiLayers.map((layer, index) => (
            <div
              key={index}
              className={`p-4 my-2 bg-gray-200 border border-gray-400 rounded-lg transition-all duration-700 ${currentStep >= index + 1 ? "opacity-100" : "opacity-50"
                }`}
            >
              <p className="font-semibold text-gray-900">{layer.title}:</p>
              <div className="text-sm text-gray-700">{layer.info}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
