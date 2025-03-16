"use client";
import { useState, useEffect, JSX } from "react";
import { motion } from "framer-motion";

export default function ThreeWayHandshake(): JSX.Element {
  

  const [step, setStep] = useState<number>(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStep((prev) => (prev < 3 ? prev + 1 : 0));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center bg-gray-100 p-4 flex-grow h-full">
      <h1 className="text-2xl font-bold text-blue-600">3-Way Handshake</h1>

      {/* Container for handshake steps */}
      <div className="flex flex-col items-center w-full max-w-3xl border border-gray-300 p-4 rounded-lg bg-white shadow-md gap-4">
        
        {/* Step 1: SYN */}
        <div className="flex flex-row justify-between items-center w-full p-3 border border-gray-400 rounded-lg bg-gray-50">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-blue-500 text-white flex items-center justify-center rounded-full">💻</div>
            <p className="text-gray-700">Your PC</p>
          </div>
          <div className="relative flex-1 flex justify-center">
            {step === 1 && (
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: "100%" }}
                transition={{ duration: 1 }}
                className="text-sm p-2 bg-yellow-400 text-black font-semibold rounded-lg shadow-md"
              >
                SYN →
              </motion.div>
            )}
          </div>
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-red-500 text-white flex items-center justify-center rounded-full">🌍</div>
            <p className="text-gray-700">Target Server</p>
          </div>
        </div>

        {/* Step 2: SYN-ACK */}
        <div className="flex flex-row justify-between items-center w-full p-3 border border-gray-400 rounded-lg bg-gray-50">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-blue-500 text-white flex items-center justify-center rounded-full">💻</div>
            <p className="text-gray-700">Your PC</p>
          </div>
          <div className="relative flex-1 flex justify-center">
            {step === 2 && (
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: "-100%" }}
                transition={{ duration: 1 }}
                className="text-sm p-2 bg-green-400 text-black font-semibold rounded-lg shadow-md"
              >
                ← SYN-ACK
              </motion.div>
            )}
          </div>
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-red-500 text-white flex items-center justify-center rounded-full">🌍</div>
            <p className="text-gray-700">Target Server</p>
          </div>
        </div>

        {/* Step 3: ACK */}
        <div className="flex flex-row justify-between items-center w-full p-3 border border-gray-400 rounded-lg bg-gray-50">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-blue-500 text-white flex items-center justify-center rounded-full">💻</div>
            <p className="text-gray-700">Your PC</p>
          </div>
          <div className="relative flex-1 flex justify-center">
            {step === 3 && (
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: "100%" }}
                transition={{ duration: 1 }}
                className="text-sm p-2 bg-red-400 text-black font-semibold rounded-lg shadow-md"
              >
                ACK →
              </motion.div>
            )}
          </div>
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-red-500 text-white flex items-center justify-center rounded-full">🌍</div>
            <p className="text-gray-700">Target Server</p>
          </div>
        </div>

      </div>
    </div>
  );
}
