"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function TcpConnectionTermination() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const sequenceLength = 4; // 4 steps in termination
    if (step < sequenceLength) {
      const timer = setTimeout(() => setStep(step + 1), 1500);
      return () => clearTimeout(timer);
    }
  }, [step]);

  return (
    <div className="relative bg-gray-800 p-6 rounded-xl shadow-lg space-y-4 text-sm font-mono text-white min-h-[230px] overflow-hidden">

      {step >= 0 && (
        <motion.div
          className="absolute left-0 bg-purple-400 px-4 py-2 rounded shadow"
          initial={{ x: "-100%" }}
          animate={{ x: "800%" }}
          transition={{ duration: 1 }}
        >
          FIN →
        </motion.div>
      )}

      {step >= 1 && (
        <motion.div
          className="absolute right-0 bg-green-400 text-black px-4 py-2 rounded shadow mt-12"
          initial={{ x: "100%" }}
          animate={{ x: "-800%" }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          ACK ←
        </motion.div>
      )}

      {step >= 2 && (
        <motion.div
          className="absolute right-0 bg-purple-400 px-4 py-2 rounded shadow mt-24"
          initial={{ x: "100%" }}
          animate={{ x: "-800%" }}
          transition={{ duration: 1, delay: 1 }}
        >
          FIN ←
        </motion.div>
      )}

      {step >= 3 && (
        <motion.div
          className="absolute left-0 bg-green-400 text-black px-4 py-2 rounded shadow mt-36"
          initial={{ x: "-100%" }}
          animate={{ x: "800%" }}
          transition={{ duration: 1, delay: 1.5 }}
        >
          ACK →
        </motion.div>
      )}
    </div>
  );
}
