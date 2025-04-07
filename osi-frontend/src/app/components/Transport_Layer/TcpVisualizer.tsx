"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ThreeWayHandshake from "./ThreeWayHandshake";
import { ChevronDown } from "lucide-react";
import TcpConnectionTermination from "./TcpConnectionTermination";

interface Props {
  url: string;
}

export default function TcpVisualizer({ url }: Props) {
  const [step, setStep] = useState(0); // Step controller
  const [showHandshake, setShowHandshake] = useState(false);
  const [showDataTransfer, setShowDataTransfer] = useState(false);
  const [showTermination, setShowTermination] = useState(false);



  // Simulate TCP segment sequence
  useEffect(() => {
    const sequence = [
      0, // SEQ:1000
      1, // ACK:1001
      2, // SEQ:1002 (lost)
      3, // Timer...
      4, // Retransmit SEQ:1002
      5, // ACK:1003
    ];

    if (step < sequence.length - 1) {
      const delay = step === 2 ? 1000 : 1500;
      const timer = setTimeout(() => setStep(step + 1), delay);
      return () => clearTimeout(timer);
    }
  }, [step]);

  useEffect(() => {
    if (!showDataTransfer) return;
  
    const stepsCount = 6;
    if (step < stepsCount - 1) {
      const delay = step === 2 || step === 3 ? 2000 : 1500; // Longer delays for lost & timer
      const timer = setTimeout(() => setStep((s) => s + 1), delay);
      return () => clearTimeout(timer);
    }
  }, [step, showDataTransfer]);



  return (
    <div className="space-y-6 overflow-x-hidden">
      <h2 className="text-2xl text-center font-semibold text-white-400">TCP: Reliable & Ordered</h2>
      <p className="text-white text-base leading-relaxed">
  TCP (Transmission Control Protocol) is a connection-oriented protocol that ensures reliable, ordered, and error-checked delivery of data between devices on a network. It establishes a connection using a 3-way handshake, manages data transmission with acknowledgments and retransmissions, and gracefully closes the connection with a 4-step termination process.
</p>

      {/* Toggle Button */}
      <button
        onClick={() => {
            setShowHandshake((prev) => {
              const newState = !prev;
              if (newState) {
                setShowDataTransfer(false);
                setShowTermination(false);
              }
              return newState;
            });
          }}
        className="w-full flex justify-center items-center gap-2 text-3xl font-bold text-white mb-6 py-3 px-6 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer"
      >
        <span>🔁 TCP 3-Way Handshake</span>
        <motion.div
          animate={{ rotate: showHandshake ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="origin-center"
          key={showHandshake ? "up" : "down"}
        >
          <ChevronDown size={28} />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {showHandshake && (
          <motion.div
            key="handshake"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <ThreeWayHandshake url={url} />
          </motion.div>
        )}
      </AnimatePresence>

        {/* Toggle Button: Data Transfer */}
<button
  onClick={() => {
  setShowDataTransfer((prev) => {
    const newState = !prev;
    if (newState) {
      setStep(0); // Reset step for animation
      setShowHandshake(false);
      setShowTermination(false);
    }
    return newState;
  });
}}

  className="w-full flex justify-center items-center gap-2 text-3xl font-bold text-white mb-6 py-3 px-6 rounded-xl bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer"
>
  <span>📦 TCP Data Transfer</span>
  <motion.div
    animate={{ rotate: showDataTransfer ? 180 : 0 }}
    transition={{ duration: 0.3 }}
    className="origin-center"
    key={showDataTransfer ? "up" : "down"}
  >
    <ChevronDown size={28} />
  </motion.div>
</button>
<AnimatePresence initial={false}>
  {showDataTransfer && (
    <motion.div
      key="data-transfer"
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="overflow-hidden"
    >
      
      <div className="bg-gray-800 p-6 rounded-xl shadow-lg space-y-4 text-sm font-mono text-white relative overflow-hidden">
        {step >= 0 && (
          <motion.div
            initial={{ x: -300 }}
            animate={{ x: 300 }}
            transition={{ duration: 1.2 }}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg w-fit shadow"
          >
            Segment 1 [SEQ:1000] →
          </motion.div>
        )}

        {step >= 1 && (
          <motion.div
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1.2 }}
            className="bg-green-400 text-black px-4 py-2 rounded-lg w-fit shadow"
          >
            ACK [ACK:1001] ←
          </motion.div>
        )}

        {step >= 2 && (
          <motion.div
            initial={{ opacity: 1 }}
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ repeat: Infinity, duration: 1 }}
            className="text-red-400"
          >
            Segment 2 [SEQ:1002] ❌ Lost
          </motion.div>
        )}

        {step >= 3 && (
          <motion.div
            className="text-yellow-300"
            animate={{ opacity: [0.2, 1, 0.2] }}
            transition={{ duration: 1.2, repeat: Infinity }}
          >
            ⏳ Timer started...
          </motion.div>
        )}

        {step >= 4 && (
          <motion.div
            initial={{ x: -300 }}
            animate={{ x: 300 }}
            transition={{ duration: 1.2 }}
            className="bg-blue-300 text-black px-4 py-2 rounded-lg w-fit shadow"
          >
            🔁 Retransmitting Segment 2 [SEQ:1002] →
          </motion.div>
        )}

        {step >= 5 && (
          <motion.div
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1.2 }}
            className="bg-green-400 text-black px-4 py-2 rounded-lg w-fit shadow animate-pulse"
          >
            ACK [ACK:1003] ←
          </motion.div>
        )}
      </div>
      </motion.div>
  )}
</AnimatePresence>



{/* Toggle Button: TCP Connection Termination */}
<button
  onClick={() => {
    setShowTermination((prev) => {
      const newState = !prev;
      if (newState) {
        setShowHandshake(false);
        setShowDataTransfer(false);
      }
      return newState;
    });
  }}
  
  className="w-full flex justify-center items-center gap-2 text-3xl font-bold text-white mb-6 py-3 px-6 rounded-xl bg-gradient-to-r from-red-500 via-pink-500 to-yellow-500 shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer"
>
  <span>🔚 TCP Connection Termination</span>
  <motion.div
    animate={{ rotate: showTermination ? 180 : 0 }}
    transition={{ duration: 0.3 }}
    className="origin-center"
  >
    <ChevronDown size={28} />
  </motion.div>
</button>

<AnimatePresence initial={false}>
  {showTermination && (
    <motion.div
      key="termination"
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="overflow-hidden"
    >
      <TcpConnectionTermination />
    </motion.div>
  )}
</AnimatePresence>

      
    </div>
  );
}
