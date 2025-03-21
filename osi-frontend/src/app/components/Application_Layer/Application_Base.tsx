"use client";

import { useEffect, useState } from "react";
import DnsLookup from "./DnsLookup";
import HttpHeaderAnimation from "./HttpRequestAnimation"
import { motion } from "framer-motion";
import axios from "axios";
type DnsLookupProps = {
    domain: string;
  };
const ApplicationBase = ({ domain }: DnsLookupProps) => {
  const [showHttpHeader, setShowHttpHeader] = useState(false);
  const [protocol, setProtocol] = useState<string | null>(null);
  const [extractedDomain, setExtractedDomain] = useState<string | null>(null);
  const [path, setPath] = useState<string | null>(null);

  useEffect(() => {
    if (!domain) return;

    const fetchUrlDetails = async () => {
      try {
        const cleanDomain = domain.replace(/(^\w+:|^)\/\//, "");
        const response = await axios.post<{
          protocol: string;
          domain: string;
          path: string;
        }>(
          `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/url-details`,
          { domain: cleanDomain }
        );

        setProtocol(response.data.protocol);
        setExtractedDomain(response.data.domain);
        setPath(response.data.path);
      } catch (error) {
        console.error("Failed to fetch URL details:", error);
      }
    };

    fetchUrlDetails();
  }, [domain]);

  return (
    <div className="flex flex-col items-center justify-center w-full p-6 bg-gray-900 text-white rounded-lg">
      <h1 className="text-3xl font-bold mb-6">🌐 OSI Layer Visualization</h1>

      <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full flex flex-col items-center">

        {showHttpHeader ? <HttpHeaderAnimation domain={domain}/> : <DnsLookup domain={domain}/>}
      </div>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setShowHttpHeader((prev) => !prev)}
        className="mt-6 bg-blue-600 text-white px-4 py-2 rounded-md shadow-md"
      >
        {showHttpHeader ? "🔄 Restart DNS Lookup" : "➡️ Proceed to HTTP Header"}
      </motion.button>

      <p className="text-lg mt-4 font-semibold text-blue-700">
        🌐 Protocol: <span className="text-white">{protocol || "N/A"}</span>
      </p>
      <p className="text-lg font-semibold text-green-700">
        🏠 Domain: <span className="text-white">{extractedDomain || "N/A"}</span>
      </p>
      <p className="text-lg font-semibold text-purple-700">
        📍 Path: <span className="text-white">{path || "N/A"}</span>
      </p>
    </div>
  );
};

export default ApplicationBase;
