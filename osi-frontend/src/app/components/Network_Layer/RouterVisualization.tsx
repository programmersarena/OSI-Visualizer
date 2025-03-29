import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface RouterVisualizationProps {
  routers: string[];
  
}

const RouterVisualization: React.FC<RouterVisualizationProps> = ({ routers }) => {
  const [currentHop, setCurrentHop] = useState(-1);

  useEffect(() => {
    let hop = 0;
    const interval = setInterval(() => {
      if (hop > routers.length) {
        hop = -1; // Restart after reaching the destination
      } else {
        setCurrentHop(hop);
        hop++;
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [routers.length]);

  // Split routers into multiple rows, max 5 per row
  const rows = [];
  for (let i = 0; i < routers.length; i += 4) {
    rows.push(routers.slice(i, i + 4));
  }

  return (
    <div className="flex flex-col items-center gap-4 mt-6 relative">
      {/* Source Device */}
      <div className="flex flex-col items-center">
        <span className="text-3xl">💻</span>
        <p className="text-xs font-medium  text-gray-200">Source</p>
      </div>

      {/* Routers Grid with Routes */}
      <div className="flex  flex-col items-center gap-6 relative">
        {rows.map((row, rowIndex) => (
          <div key={rowIndex} className="flex items-center gap-6 relative">
            {row.map((ip, index) => {
              const hopIndex = rowIndex * 5 + index; // Absolute hop index
              return (
                <div key={ip} className="flex flex-col items-center relative">
                  {/* Router Icon */}
                  <span className="text-3xl">📡</span>
                  <p className="text-xs text-gray-200">{ip}</p>

                  {/* Dotted line between routers */}
                  {index < row.length - 1 && (
                    <div className="absolute top-1/2 left-full w-12 h-1 border-dashed border-t-2 border-gray-500"></div>
                  )}

                  {/* Animated Packet for Current Router */}
                  {currentHop === hopIndex && (
                    <motion.div
                      className="absolute -top-6 text-2xl"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      📦
                    </motion.div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Destination */}
      <div className="flex flex-col items-center mt-6">
        <span className="text-3xl">🌍</span>
        <p className="text-xs text-gray-200 font-medium">Destination</p>
      </div>

      {/* Final Packet Arrival Animation */}
      {currentHop >= routers.length && (
        <motion.div
          className="absolute bottom-16 text-2xl"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          📦
        </motion.div>
      )}
    </div>
  );
};

export default RouterVisualization;
