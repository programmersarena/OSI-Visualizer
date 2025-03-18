import { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { FaDesktop, FaServer } from "react-icons/fa"; // Icons for PC & DNS Server

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

        setIp(response.data.ip);
        setProtocol(response.data.protocol);
        setExtractedDomain(response.data.domain);
        setPath(response.data.path);

        // Get User's Public IP
        const userIpResponse = await axios.get("https://api64.ipify.org?format=json");
        setUserIp(userIpResponse.data.ip);

        let stepCounter = 0;
        const interval = setInterval(() => {
          stepCounter++;
          setStep(stepCounter);
          if (stepCounter === 3) clearInterval(interval);
        }, 800);
      } catch (err) {
        setError("DNS lookup failed");
      } finally {
        setLoading(false);
      }
    };

    fetchDnsLookup();
  }, [domain]);

  return (
    <div className="w-full flex flex-col items-start space-y-2">
      {/* Display Protocol, Domain, and Path Outside Lookup Box */}
      <p className="text-lg mt-4 font-semibold text-blue-700">
        🌐 Protocol: <span className="text-gray-800">{protocol || "N/A"}</span>
      </p>
      <p className="text-lg font-semibold text-green-700">
        🏠 Domain: <span className="text-gray-800">{extractedDomain || "N/A"}</span>
      </p>
      <p className="text-lg font-semibold text-purple-700">
        📍 Path: <span className="text-gray-800">{path || "N/A"}</span>
      </p>

      {/* DNS Lookup Box */}
      <div className="w-full h-full flex flex-col mt-2 items-center justify-center bg-gray-100 p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold text-blue-600 mb-4">DNS Lookup</h2>

        <div className="relative w-full h-48 flex items-center justify-between px-10">
          {/* PC (Left Side) */}
          <div className="flex flex-col items-center">
            <FaDesktop className="text-5xl text-blue-600" />
            <p className="mt-2 text-gray-700 font-semibold">💻 My PC</p>
            {userIp && <p className="text-sm text-gray-500">IP: {userIp}</p>}
          </div>

          {/* Request Packet Animation */}
          {step >= 1 && (
            <motion.div
              initial={{ x: -150, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 1 }}
              className="absolute top-10 left-1/4 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md"
            >
              📨 "Hey DNS! I need IP for {domain}"
            </motion.div>
          )}

          {/* DNS Server (Right Side) */}
          <div className="flex flex-col items-center">
            <FaServer className="text-5xl text-yellow-600" />
            <p className="mt-2 text-gray-700 font-semibold">🌐 DNS Server</p>
          </div>

          {/* Response Packet Animation */}
          {step >= 3 && ip && (
            <motion.div
              initial={{ x: 150, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 1 }}
              className="absolute bottom-10 right-1/4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-md"
            >
              ✅ "Here’s the IP: {ip}"
            </motion.div>
          )}
        </div>

        {/* Status Messages */}
        {loading && <p className="text-gray-500 mt-4">🔄 Resolving...</p>}
        {error && <p className="text-red-500 mt-4">{error}</p>}
      </div>

      {/* Important Note */}
      <p className="text-sm text-gray-700 font-semibold bg-yellow-100 p-2 mt-2 rounded-lg border-l-4 border-yellow-500">
        ⚠️ Important Note: If your requested domain isn’t chilling in the local DNS cache, your request goes on a world tour! 🌍 
        First stop: Root DNS. Then, it hops to the TLD DNS, and finally, the Authoritative DNS—where the real answers live. 
        It’s like asking around until you find someone who actually knows the address! 😆
      </p>
    </div>
  );
}
