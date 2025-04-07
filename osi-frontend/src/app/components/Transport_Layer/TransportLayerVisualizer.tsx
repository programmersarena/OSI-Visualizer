"use client";
import { useState } from "react";
import TcpVisualizer from "./TcpVisualizer";
import UdpVisualizer from "./UdpVisualizer";

type Props = {
  url: string;
};

export default function TransportLayer({ url }: Props) {
  const [mode, setMode] = useState<"TCP" | "UDP">("TCP");

  return (
    <div className="bg-gray-900  text-white p-6">
      <h1 className="text-3xl font-bold text-blue-400 mb-6">
        Transport Layer Visualization
      </h1>

      <div className="flex justify-center mb-6">
        <button
          onClick={() => setMode("TCP")}
          className={`px-4 py-2 rounded-l-lg ${
            mode === "TCP" ? "bg-blue-500" : "bg-gray-700"
          }`}
        >
          TCP
        </button>
        <button
          onClick={() => setMode("UDP")}
          className={`px-4 py-2 rounded-r-lg ${
            mode === "UDP" ? "bg-yellow-500 text-black" : "bg-gray-700"
          }`}
        >
          UDP
        </button>
      </div>

      {mode === "TCP" ? <TcpVisualizer url={url} /> : <UdpVisualizer url={url} />}
      
    </div>
  );
}
