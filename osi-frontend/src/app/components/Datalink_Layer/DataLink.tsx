"use client";

import { useState, useEffect } from "react";
import axios from "axios";
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const DataLinkLayer = () => {
  const [macInfo, setMacInfo] = useState<{ clientMac: string; gatewayMac: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMacAddresses = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/mac/mac-info`);
        setMacInfo(response.data);
      } catch (err) {
        setError(`Failed to fetch MAC addresses: ${err}`);
      } finally {
        setLoading(false);
      }
    };

    fetchMacAddresses();
  }, []);

  return (
    <div className="border p-4 rounded-lg bg-gray-900 shadow-md">
      {/* <h2 className="text-xl font-bold text-gray-700 mb-3"></h2> */}

      {loading && <p className="text-gray-500">Fetching MAC addresses...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {macInfo && (
        <div className="mt-4 p-3 bg-gray-600 rounded-lg">

          <p className="font-semibold text-gray-200">🔵 Source MAC (Your Machine):</p>
          <p className="text-gray-300">{macInfo.clientMac}</p>

          <p className="font-semibold text-gray-200 mt-4">🟢 Destination MAC (Gateway Router):</p>
          <p className="text-gray-300">{macInfo.gatewayMac}</p>
        </div>
      )}
    </div>
  );
};

export default DataLinkLayer;
