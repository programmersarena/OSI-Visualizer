import { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { FaDesktop, FaServer } from "react-icons/fa";
import HttpRequestAnimation from "./HttpRequestAnimation";
import TlsHandshake from "./TlsHandshake";

type DnsLookupProps = {
  domain: string;
};

export default function DnsLookup({ domain }: DnsLookupProps) {
  const [ip, setIp] = useState<string | null>(null);
  const [protocol, setProtocol] = useState<string | null>(null);
  const [extractedDomain, setExtractedDomain] = useState<string | null>(null);
  const [path, setPath] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<number>(0);
  const [userIp, setUserIp] = useState<string | null>(null);
  const [properDomain, setProperDomain] = useState<string | null>(null);

  useEffect(() => {
    if (!domain) return;
    setLoading(true);
    setError(null);
    setStep(0);

    const fetchDnsLookup = async () => {
      try {
        const cleanDomain = domain.replace(/(^\w+:|^)\/\//, "");
        const response = await axios.post<{
          ip: string;
          protocol: string;
          domain: string;
          path: string;
        }>(
          `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/dns-lookup`,
          { domain: cleanDomain }
        );
        setProperDomain(cleanDomain);
        setIp(response.data.ip);
        setProtocol(response.data.protocol);
        setExtractedDomain(response.data.domain);
        setPath(response.data.path);

        const userIpResponse = await axios.get("https://api64.ipify.org?format=json");
        setUserIp(userIpResponse.data.ip);

        let stepCounter = 0;
        const interval = setInterval(() => {
          stepCounter++;
          setStep(stepCounter);
          if (stepCounter === 3) clearInterval(interval);
        }, 800);
      } catch (err: unknown) {
        setError(`DNS lookup Failed: ${err}`);
      } finally {
        setLoading(false);
      }
    };

    fetchDnsLookup();
  }, [domain]);

  return (
    <div className="w-full flex flex-col items-start space-y-2">
      <p className="text-lg mt-4 font-semibold text-blue-700">
        🌐 Protocol: <span className="text-gray-800">{protocol || "N/A"}</span>
      </p>
      <p className="text-lg font-semibold text-green-700">
        🏠 Domain: <span className="text-gray-800">{extractedDomain || "N/A"}</span>
      </p>
      <p className="text-lg font-semibold text-purple-700">
        📍 Path: <span className="text-gray-800">{path || "N/A"}</span>
      </p>

      <div className="w-full h-full flex flex-col mt-2 items-center justify-center bg-gray-100 p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold text-blue-600 mb-4">DNS Lookup</h2>

        <div className="relative w-full h-48 flex items-center justify-between px-10">
          <div className="flex flex-col items-center">
            <FaDesktop className="text-5xl text-blue-600" />
            <p className="mt-2 text-gray-700 font-semibold">💻 My PC</p>
            {userIp && <p className="text-sm text-gray-500">IP: {userIp}</p>}
          </div>

          {step >= 1 && (
            <motion.div
              initial={{ x: -150, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 1 }}
              className="absolute top-10 left-1/4 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md"
            >
              📨 &apos;Hey Resolver! I need IP for {properDomain}&apos;
            </motion.div>
          )}

          <div className="flex flex-col items-center">
            <FaServer className="text-5xl text-yellow-600" />
            <p className="mt-2 text-gray-700 font-semibold">🌐 DNS Server</p>
          </div>

          {step >= 3 && ip && (
            <motion.div
              initial={{ x: 150, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 1 }}
              className="absolute bottom-10 right-1/4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-md"
            >
              ✅ &quot;Here&apos;s the IP: {ip}&quot;
            </motion.div>
          )}
        </div>

        {loading && <p className="text-gray-500 mt-4">🔄 Resolving...</p>}
        {error && <p className="text-red-500 mt-4">{error}</p>}
      </div>

      <div className="w-full p-6 mt-6 bg-yellow-50 border-l-4 border-yellow-500 rounded-lg shadow-md">
        <h3 className="text-lg font-bold text-yellow-700">⚠️ DNS Adventure Time! 🌍</h3>
        <p className="text-gray-800">Your browser tries to resolve the domain in a series of steps:</p>
        <ul className="list-disc list-inside text-gray-700 mt-2">
          <li>🧠 First, it checks its <span className="text-blue-600">cache</span> for the IP address.</li>
          <li>💻 Then it asks your <span className="text-green-600">OS</span> for help.</li>
          <li>🌐 Still no luck? It queries your <span className="text-purple-600">ISP&apos;s DNS server</span>.</li>
          <li>🚀 If needed, it goes on a <span className="text-blue-500">DNS World Tour</span>:<ul className="list-disc ml-5">
            <li>Root DNS → TLD DNS → Authoritative DNS</li>
            <li>Finally, it gets the IP address and returns it to your browser. 🎉</li>
          </ul></li>
        </ul>
      </div>

      {protocol === 'http' && <HttpRequestAnimation />}
      {protocol === 'https' && <TlsHandshake />}
    </div>
  );
}