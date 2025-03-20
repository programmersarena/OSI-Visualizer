"use client";

import { motion } from "framer-motion";
import { useState } from "react";

const HttpsRequestAnimation = () => {
  const [sent, setSent] = useState(false);

  const requestLines = [
    "POST /api/data HTTP/1.1",
    "Host: chatgpt.com",
    "User-Agent: Mozilla/5.0",
    "Content-Type: application/json",
    "Content-Length: 49",
    "Connection: keep-alive",
    "",
    '{ "message": "Hello, HTTPS!" }'
  ];

  return (
    <div className="flex p-6 my-2 w-full flex-col items-center justify-center bg-gray-900 rounded-lg text-white">
      <h2 className="text-3xl font-bold mb-6">🔒 HTTPS Request Creation</h2>

      <div className="bg-gray-800 w-full flex flex-col items-center justify-center p-6 rounded-lg shadow-lg w-[400px]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-lg font-mono text-blue-400"
        >
          HTTPS Request:
        </motion.div>

        <div className="mt-2">
          {requestLines.map((line, index) => (
            <motion.p
              key={index}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.3, duration: 0.5 }}
              className={`text-sm font-mono ${
                index === requestLines.length - 1 ? "text-green-400" : "text-gray-300"
              }`}
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
              onClick={() => setSent(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-md shadow-md"
            >
              Send HTTPS Request 🚀
            </motion.button>
          </motion.div>
        ) : (
          <motion.p
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="mt-4 text-green-400 text-center font-mono"
          >
            ✅ Request Sent Securely!
          </motion.p>
        )}
      </div>
    </div>
  );
};

export default HttpsRequestAnimation;
