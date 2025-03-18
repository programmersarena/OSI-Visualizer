"use client";
import { useState, useEffect, JSX } from "react";
import { motion } from "framer-motion";

export default function TlsHandshake(): JSX.Element {
  const [step, setStep] = useState<number>(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStep((prev) => (prev < 3 ? prev + 1 : 0));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col w-full p-6 items-center bg-gray-900 p-4 h-full">
      <h1 className="text-2xl font-bold pb-3 text-blue-400">TLS Handshake</h1>

      {/* Container for handshake steps */}
      <div className="flex flex-col items-center w-full max-w-3xl border border-gray-700 p-4 rounded-lg bg-gray-800 shadow-md gap-4">
        
        {/* Step 1: Client Hello */}
        <div className="flex flex-row justify-between items-center w-full p-3 border border-gray-600 rounded-lg bg-gray-700">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-blue-500 text-white flex items-center justify-center rounded-full">🌍</div>
            <p className="text-gray-300">Browser</p>
          </div>
          <div className="relative flex-1 flex justify-center">
            {step === 1 && (
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: "100%" }}
                transition={{ duration: 1 }}
                className="text-sm p-2 bg-green-500 text-black font-semibold rounded-lg shadow-md"
              >
                Client Hello →
              </motion.div>
            )}
          </div>
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-red-500 text-white flex items-center justify-center rounded-full">🖥️</div>
            <p className="text-gray-300">Server</p>
          </div>
        </div>

        {/* Step 2: Server Hello */}
        <div className="flex flex-row justify-between items-center w-full p-3 border border-gray-600 rounded-lg bg-gray-700">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-blue-500 text-white flex items-center justify-center rounded-full">🌍</div>
            <p className="text-gray-300">Browser</p>
          </div>
          <div className="relative flex-1 flex justify-center">
            {step === 2 && (
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: "-100%" }}
                transition={{ duration: 1 }}
                className="text-sm p-2 bg-yellow-500 text-black font-semibold rounded-lg shadow-md"
              >
                ← Server Hello
              </motion.div>
            )}
          </div>
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-red-500 text-white flex items-center justify-center rounded-full">🖥️</div>
            <p className="text-gray-300">Server</p>
          </div>
        </div>

        {/* Step 3: Key Exchange */}
        <div className="flex flex-row justify-between items-center w-full p-3 border border-gray-600 rounded-lg bg-gray-700">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-blue-500 text-white flex items-center justify-center rounded-full">🌍</div>
            <p className="text-gray-300">Browser</p>
          </div>
          <div className="relative flex-1 flex justify-center">
            {step === 3 && (
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: "100%" }}
                transition={{ duration: 1 }}
                className="text-sm p-2 bg-blue-500 text-black font-semibold rounded-lg shadow-md"
              >
                Key Exchange →
              </motion.div>
            )}
          </div>
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-red-500 text-white flex items-center justify-center rounded-full">🖥️</div>
            <p className="text-gray-300">Server</p>
          </div>
        </div>
      </div>
    </div>
  );
}
