"use client";

import { motion } from "framer-motion";

const HttpRequestAnimation = () => {
  return (
    <div className="flex p-6 my-2 w-full flex-col items-center justify-center bg-gray-900 rounded-lg text-white">
      <h1 className="text-xl font-bold mb-4">Creating HTTP Request</h1>

      {/* Request Header Section */}
      <div className="bg-gray-800 w-full flex flex-col items-center justify-center p-4 rounded-lg shadow-lg w-80">
        <h2 className="text-lg font-semibold mb-2">📝 HTTP Request Header</h2>
        <motion.p
          className="text-sm text-green-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          GET /index.html HTTP/1.1
        </motion.p>
        <motion.p
          className="text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          Host: www.example.com
        </motion.p>
        <motion.p
          className="text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          User-Agent: Chrome/120.0
        </motion.p>
        <motion.p
          className="text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
        >
          Accept: text/html
        </motion.p>
      </div>

      {/* Request Sending Animation */}
      <div className="relative flex items-center justify-center h-32 w-full bg-gray-800 text-white mt-6">
        {/* Browser */}
        <div className="absolute left-10 flex flex-col items-center">
          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-lg font-bold">
            🌍
          </div>
          <p className="mt-2 text-sm">Browser</p>
        </div>

        {/* Server */}
        <div className="absolute right-10 flex flex-col items-center">
          <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center text-lg font-bold">
            🖥️
          </div>
          <p className="mt-2 text-sm">Server</p>
        </div>

        {/* Packet Animation */}
        <motion.div
          className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center text-lg font-bold"
          initial={{ x: -200, opacity: 0 }}
          animate={{ x: 200, opacity: 1 }}
          transition={{ delay: 2.5, repeat: Infinity, duration: 2, ease: "easeInOut" }}
        >
          📩
        </motion.div>
      </div>
    </div>
  );
};

export default HttpRequestAnimation;
