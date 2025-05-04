"use client";

import { useState } from "react";
import axios from "axios";
import InputForm from "./components/Osi_Components/InputForm"
import OsiVisualization from "./components/Osi_Components/OsiVisualization";

interface NetworkLayerData {
  IP: string;
}

interface OsiData {
  Layer3_Network: NetworkLayerData;
}

interface IspDetails {
  ip: string;
  org: string;
  city: string;
  region: string;
}

export default function App() {
  const [url, setUrl] = useState<string>("https://");
  const [osiData, setOsiData] = useState<OsiData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isp, setIsp] = useState<IspDetails | null>(null);

  const handleSubmit = async () => {
    if (!url) return alert("Enter a valid URL");
    
    let normalizedUrl = url.trim();
    // Automatically add https:// if missing
    if (!/^https?:\/\//i.test(normalizedUrl)) {
      normalizedUrl = "https://" + normalizedUrl;
    }

    try {
      const parsed = new URL(normalizedUrl);
      normalizedUrl = `${parsed.protocol}//${parsed.hostname}`;
    } catch (e) {
      alert("Invalid URL");
      return;
    }
    
    setUrl(normalizedUrl);
    setLoading(true);
    setError("");
    setOsiData(null);
    setCurrentStep(0);
    setIsp(null);

    try {

      // Fetch ISP details
      const { data: ipData } = await axios.get("https://api64.ipify.org?format=json");
      const { data: ispData } = await axios.get(`https://ipinfo.io/${ipData.ip}/json`);
      setIsp({
        ip: ipData.ip || "Unknown IP",
        org: ispData.org || "Unknown ISP",
        city: ispData.city || "Unknown City",
        region: ispData.region || "Unknown Region",
      });

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/dns/analyze`,
        { url }
      );

      const osiDatas = {
        Layer1_Physical: "Physical Layer Details",
        Layer2_DataLink: "MAC Address Info",
        Layer3_Network: { IP: response.data },
        Layer4_Transport: "Transport Layer Details",
        Layer5_Session: "TCP Handshake Verified",
        Layer6_Presentation: "SSL/TLS Encryption",
        Layer7_Application: "Application layer details",
      };
      setOsiData(osiDatas);
      // Simulate OSI layer visualization
      let step = 0;
      const osiInterval = setInterval(() => {
        step++;
        setCurrentStep(step);
        if (step === 7) clearInterval(osiInterval);
      }, 800);
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError("Unexpected error occurred.");
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-br from-black via-indigo-100 to-black p-4 text-white">
      <h1 className="text-3xl font-bold mb-4 text-white-900">🚀 OSI Layer Visualizer</h1>
      <InputForm url={url} setUrl={setUrl} handleSubmit={handleSubmit} loading={loading} />
      {error && <p className="text-red-400 mt-2">{error}</p>}

      {osiData && <OsiVisualization osiData={osiData} url={url} currentStep={currentStep} isp={isp} />}
    </div>
  );


}  