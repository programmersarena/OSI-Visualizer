import React from "react";
import ThreeWayHandshake from "./ThreeWayHandshake";
import RouterVisualization from "./RouterVisualization";
import DnsLookup from "./DnsLookup";
import OsiLayer from "./OsiLayer";

type OsiVisualizationProps = {
  osiData: any;
  url:string;
  currentStep: number;
  isp: string | null;
};

const OsiVisualization: React.FC<OsiVisualizationProps> = ({ osiData, url, currentStep, isp }) => {
  const osiLayers = [
    { title: "Application Layer", content: <DnsLookup domain={url} /> },
    { title: "Presentation Layer", content: "SSL/TLS Encryption" },
    { title: "Session Layer", content: "TCP Handshake Verified" },
    { title: "Transport Layer", content: <ThreeWayHandshake /> },
    {
      title: "Network Layer",
      content: (
        <>
          <p className="text-gray-700">🌍 Destination IP: {osiData?.Layer3_Network.IP}</p>
          <p className="text-gray-700">🛜 Total Hops: {osiData?.Layer3_Network.Hops}</p>
          {isp && <p className="text-gray-700 font-medium">🌐 Your ISP: {isp}</p>}
          <p className="font-semibold text-gray-900 mt-2">📍 Packet Journey:</p>
          <RouterVisualization routers={osiData?.Layer3_Network.Routers} />
        </>
      ),
    },
    { title: "Data Link Layer", content: "MAC Address Info" },
    { title: "Physical Layer", content: "Network Interface Info" },
  ];

  return (
    <div className="mt-6 w-full max-w-4xl bg-gray-200 p-4 rounded-lg shadow-md">
      {osiLayers.map((layer, index) => (
        <OsiLayer key={index} title={layer.title} content={layer.content} isVisible={currentStep >= index + 1} />
      ))}
    </div>
  );
};

export default OsiVisualization;
