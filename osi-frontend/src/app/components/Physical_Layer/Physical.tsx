import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const PhysicalLayer = () => {
  const [bits, setBits] = useState(["1", "0", "1", "1", "0", "1", "0", "1", "0", "1", "0", "1", "0"]);
  const [transmissionMedium, setTransmissionMedium] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransmissionMode = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/transmission/get-transmission");
        const data = await res.json();
        setTransmissionMedium(data.transmissionMode);
      } catch (error) {
        console.error("Error fetching transmission mode:", error);
        setTransmissionMedium("Unknown");
      }
      setLoading(false);
    };

    fetchTransmissionMode();
  }, []);



  useEffect(() => {
    const interval = setInterval(() => {
      setBits(prev => [...prev.slice(1), Math.random() > 0.5 ? "1" : "0"]);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col  items-center justify-center rounded-lg bg-gray-900 text-white">
      <h1 className="text-xl mt-2 font-bold mb-4">
        Transmission Mode - {loading ? "Loading..." : transmissionMedium}
      </h1>
      <div className="relative w-full max-w-2xl h-40 border border-gray-300 rounded-lg overflow-hidden">
        {/* Simulating Wired Signal Line */}
        <div className="absolute top-1/3 left-0 w-full h-0.5 bg-blue-500" />
        <div className="flex absolute top-1/3 left-0 w-full h-10 items-center">
          {bits.map((bit, index) => (
            <motion.div
              key={index}
              className="text-lg font-bold bg-blue-400 text-white px-2 py-1 rounded-full mx-1"
              initial={{ opacity: 0, x: "-10%" }}
              animate={{ opacity: 1, x: index * 20 }}
              transition={{ duration: 0.5 }}
            >
              {bit}
            </motion.div>
          ))}
        </div>

        {/* Simulating Wireless Wave Transmission with More Realistic Waves */}
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute bottom-5 left-1/2 w-40 h-40 bg-transparent border-2 border-yellow-400 rounded-full"
            animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.8, 0.3] }}
            transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.5 }}
            style={{ transformOrigin: "center" }}
          />
        ))}
      </div>
      <p className="mt-4 text-sm text-gray-400">Simulating binary bit transmission & realistic wireless wave propagation</p>
    </div>
  );
};

export default PhysicalLayer;