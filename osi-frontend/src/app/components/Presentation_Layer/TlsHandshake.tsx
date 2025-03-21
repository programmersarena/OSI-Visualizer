"use client";
import { useState, useEffect, JSX } from "react";
import { motion } from "framer-motion";
import Encoding from "./Encoding";

type TlsHandshakeProps = {
  url: string;
};

export default function TlsHandshake({url} : TlsHandshakeProps): JSX.Element {
  const [step, setStep] = useState<number>(0);
  const [certStep, setCertStep] = useState<number>(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStep((prev) => (prev < 6 ? prev + 1 : 0)); // Cycle through all steps
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (step === 2) {
      setCertStep(0);
      const certInterval = setInterval(() => {
        setCertStep((prev) => (prev < 2 ? prev + 1 : 2));
      }, 800); // Change validation text every 800ms
      return () => clearInterval(certInterval);
    }
  }, [step]);

  const steps = [
    { text: "Client Hello →", color: "bg-green-500", from: "-100%", to: "100%" },
    { text: "← Server Hello + Certificate", color: "bg-yellow-500", from: "100%", to: "-80%" },
    {
      text: ["🔍 Checking Certificate...", "🔍 Verifying CA...", "✅ Certificate Valid"],
      color: "bg-orange-500",
      from: "-70%",
      to: "-70%",
    },
    { text: "Key Exchange →", color: "bg-blue-500", from: "-100%", to: "100%" },
    { text: "← Server Finished", color: "bg-red-500", from: "100%", to: "-100%" },
    { text: "Client Finished →", color: "bg-purple-500", from: "-100%", to: "100%" },
    { text: "🔒 Secure Communication Established", color: "bg-violet-500", from: "0%", to: "0%" },
  ];

  return (
    <div className="flex flex-col w-full p-6 items-center bg-gray-900 h-full">
      <Encoding url={url}/>
      <h1 className="text-2xl font-bold pb-3 text-blue-400">TLS Handshake</h1>

      <div className="flex flex-col items-center w-full max-w-3xl border border-gray-700 p-4 rounded-lg bg-gray-800 shadow-md gap-4">
        {steps.map((s, index) => (
          <div key={index} className="flex flex-row justify-between items-center w-full p-3 border border-gray-600 rounded-lg bg-gray-700">
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 bg-blue-500 text-white flex items-center justify-center rounded-full">🌍</div>
              <p className="text-gray-300">Browser</p>
            </div>
            <div className="relative flex-1 flex justify-center">
              {step === index && (
                <motion.div
                  initial={{ x: s.from, opacity: 0, scale: 0.8 }}
                  animate={{ x: s.to, opacity: 1, scale: 1 }}
                  transition={{ duration: 1 }}
                  className={`text-sm p-2 font-semibold rounded-lg shadow-md ${s.color} text-black`}
                >
                  {index === 2 ? (
                    <div
                      className="flex items-center justify-center text-center"
                      style={{ minWidth: "220px" }} // Uniform size only for step 2
                    >
                      {s.text[certStep]}
                    </div>
                  ) : (
                    s.text
                  )}
                </motion.div>
              )}
            </div>
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 bg-red-500 text-white flex items-center justify-center rounded-full">🖥️</div>
              <p className="text-gray-300">Server</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
