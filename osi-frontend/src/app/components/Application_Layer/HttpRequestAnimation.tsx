"use client";

import { motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import axios from "axios";

type HttpHeaderAnimationProps = {
  domain: string;
};

const HttpHeaderAnimation = ({ domain }: HttpHeaderAnimationProps) => {
  const [requestLines, setRequestLines] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const fetchRequestHeaders = useCallback(async () => {
    setLoading(true);
    setError(null);
    setSent(false);
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/http/get-http-request`,
        { domain }
      );
      setRequestLines(response.data.requestLines);
      setSent(true);
    } catch (err) {
      console.error("Error fetching HTTP request headers:", err);
      setError("Failed to fetch request headers.");
    } finally {
      setLoading(false);
    }
  }, [domain]);
  useEffect(() => {
    fetchRequestHeaders();
  }, [fetchRequestHeaders]);

  return (
    <div className="flex p-6 my-2 w-full flex-col items-center justify-center bg-gray-900 rounded-lg text-white">
      <h2 className="text-3xl font-bold mb-6">🌐 HTTP Request Header</h2>
      <div className="bg-gray-800 w-full flex flex-col items-center justify-center p-6 rounded-lg shadow-lg w-[400px]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-lg font-mono text-blue-400"
        >
          HTTP Request:
        </motion.div>

        <div className="mt-2">
          {requestLines.map((line, index) => (
            <motion.p
              key={index}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.3, duration: 0.7 }}
              className="text-sm font-mono text-gray-300"
            >
              {line}
            </motion.p>
          ))}
        </div>

        {!sent ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: requestLines.length * 0.3, duration: 0.5 }}
            className="mt-4 text-center"
          >
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="bg-blue-600 text-white px-4 py-2 rounded-md shadow-md"
            >
              {loading ? "Fetching..." : "Send HTTP Request 🌍"}
            </motion.button>
          </motion.div>
        ) : (
          <motion.p
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="mt-6 text-green-400 text-center font-mono"
          >
            ✅ HTTP Request Sent!
          </motion.p>
        )}

        {error && <p className="text-red-400 mt-4">{error}</p>}
      </div>
    </div>
  );
};

export default HttpHeaderAnimation;
