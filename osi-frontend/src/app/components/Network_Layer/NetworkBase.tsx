import React, { useEffect, useState } from "react";
import RouterVisualization from "./RouterVisualization";
import axios from "axios";
import LoadingScreen from "../Osi_Components/LoadingScreen";

interface NetworkBaseProps {
  ip: string;
  url: string;
  isp: {
    ip: string;
    org: string;
    city: string;
    region: string;
  } | null;
}

const NetworkBase: React.FC<NetworkBaseProps> = ({ ip, isp, url }) => {
  const [hops, setHops] = useState<number | null>(null);
  const [routers, setRouters] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);  // Still keeping for error handling

  useEffect(() => {
    const fetchNetworkData = async () => {
      setLoading(true);
      setError(null); // Reset error state

      try {
        // API call to get hops and routers data based on the IP
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/network-traceroute`,
          { url }
        );
        const updatedRouters = [ip, ...response.data.hopIPs];

        // Assuming the response contains hops and routers info
        setHops(response.data.hopCount + 1); // Add 1 to hop count
        setRouters(updatedRouters);
      } catch (err) {
        setError("Failed to fetch network data. Please try again.");
        console.error(err); // Log the actual error
      } finally {
        setLoading(false);
      }
    };

    fetchNetworkData(); // Call the function to fetch the data
  }, [ip, url]); // Added `ip` and `url` to the dependencies array

  if (loading) {
    // If data is still loading, show the loading screen
    return <LoadingScreen />;
  }

  return (
    <div>
      <p className="text-gray-700">🌍 Destination IP: {ip}</p>
      <p className="text-gray-700">🛜 Total Hops: {hops}</p>
      {isp && (
        <>
          <p className="text-gray-700 font-medium">🌐 Your ISP: {isp.org}</p>
          <p className="text-gray-700 font-medium">
            🏠 Your IP: {isp.ip || "Unknown IP"} | City: {isp.city || "Unknown City"} | Region: {isp.region || "Unknown Region"}
          </p>
        </>
      )}
      <p className="font-semibold text-gray-900 mt-2">📍 Packet Journey:</p>
      <RouterVisualization routers={routers} />

      {/* Show error message if an error exists */}
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
};

export default NetworkBase;
