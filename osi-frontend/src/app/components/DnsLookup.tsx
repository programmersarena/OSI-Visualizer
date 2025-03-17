import { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";

type DnsLookupProps = {
  domain: string;
};

export default function DnsLookup({ domain }: DnsLookupProps) {
  const [ip, setIp] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<number>(0);

  useEffect(() => {
    if (!domain) return;
    setLoading(true);
    setError(null);
    setStep(0);

    const fetchDnsLookup = async () => {
      try {
        const cleanDomain = domain.replace(/(^\w+:|^)\/\//, "");
        const response = await axios.post<{ ip: string }>(
          `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/dns-lookup`,
          { domain:cleanDomain}
          
        );
        setIp(response.data.ip);

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
    <div className="p-4 border rounded-lg shadow-md bg-white w-full max-w-lg">
      <h2 className="text-lg font-bold text-blue-600">DNS Lookup</h2>
      {loading && <p className="text-gray-500 mt-2">🔄 Resolving...</p>}
      {error && <p className="text-red-500 mt-2">{error}</p>}
      {step >= 1 && <motion.p className="mt-2 text-gray-700" animate={{ opacity: 1 }} initial={{ opacity: 0 }}>🌐 Querying DNS Server...</motion.p>}
      {step >= 2 && <motion.p className="mt-2 text-gray-700" animate={{ opacity: 1 }} initial={{ opacity: 0 }}>🔍 Resolving {domain}...</motion.p>}
      {step >= 3 && ip && <motion.p className="mt-2 font-bold text-green-700" animate={{ opacity: 1 }} initial={{ opacity: 0 }}>✅ IP Address: {ip}</motion.p>}
    </div>
  );
}
