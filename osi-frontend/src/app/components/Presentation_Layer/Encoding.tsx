import axios from "axios";
import { useState } from "react";
import { motion } from "framer-motion";

type EncodingCheckerProps = {
  url: string;
};

const EncodingChecker: React.FC<EncodingCheckerProps> = ({ url }) => {
  const [encoding, setEncoding] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [fetching, setFetching] = useState(false);

  const fetchEncoding = async () => {
    if (!url.trim()) return;
    setError(null);
    setEncoding(null);
    setFetching(true);

    try {
      const response = await axios.post<{ encoding: string }>(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/encoding/check-encoding`,
        { url }
      );

      setTimeout(() => {
        setEncoding(response.data.encoding);
        setFetching(false);
      }, 1000); // Wait 1 sec before showing encoding
    } catch (err) {
      console.error("Encoding check failed:", err);
      setError("Encoding check failed.");
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 p-6 bg-gray-900 text-white rounded-xl shadow-lg w-96">
      {fetching ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-lg font-semibold text-yellow-400 text-center"
        >
          Fetching encoding details, please wait...
        </motion.div>
      ) : (
        !encoding &&
        !error && (
          <motion.button
            onClick={fetchEncoding}
            className="px-5 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-lg transition hover:bg-blue-700"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Check Encoding
          </motion.button>
        )
      )}

      {/* Animate Encoding Text */}
      {encoding && !fetching && (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
          }}
          className="p-2 px-3 bg-green-700 text-sm font-bold rounded-lg shadow-md"
        >
          Encoding:{" "}
          {encoding.split("").map((char, index) => (
            <motion.span
              key={index}
              variants={{
                hidden: { opacity: 0, y: -5 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ type: "spring", stiffness: 100 }}
              className="text-yellow-400"
            >
              {char}
            </motion.span>
          ))}
        </motion.div>
      )}

      {error && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="p-3 bg-red-700 text-sm font-bold rounded-lg shadow-md"
        >
          {error}
        </motion.div>
      )}
    </div>
  );
};

export default EncodingChecker;
