import React from "react";
import ThreeWayHandshake from "../Transport_Layer/ThreeWayHandshake";
import OsiLayer from "./OsiLayer";
import DataLink from "../Datalink_Layer/DataLink";
import TlsHandshake from "../Presentation_Layer/TlsHandshake";
import ApplicationBase from "../Application_Layer/Application_Base";
import NetworkBase from "../Network_Layer/NetworkBase";

interface NetworkLayerData {
  IP: string;
  // Hops: number;
  // Routers: string[];
}

interface OsiData {
  Layer3_Network: NetworkLayerData;
}

interface IspDetails {
  ip:string;
  org: string;
  city: string;
  region: string;
}

type OsiVisualizationProps = {
  osiData: OsiData;
  url: string;
  currentStep: number;
  isp: IspDetails | null;
};

const OsiVisualization: React.FC<OsiVisualizationProps> = ({ osiData, url, currentStep, isp }) => {
  const osiLayers = [
    { title: "Application Layer", content: <ApplicationBase domain={url} /> },
    { title: "Presentation Layer", content: <TlsHandshake url={url}/> },
    { title: "Session Layer", content: "TCP Handshake Verified" },
    { title: "Transport Layer", content: <ThreeWayHandshake /> },
    {
      title: "Network Layer",
      content: (
  //       <>
  //         <p className="tesxt-gray-700">🌍 Destination IP: {osiData?.Layer3_Network.IP}</p>
  //         <p className="text-gray-700">🛜 Total Hops: {osiData?.Layer3_Network.Hops}</p>
  //         {isp && (
  //   <>
  //     <p className="text-gray-700 font-medium">
  //       🌐 Your ISP: {isp.org} 
  //     </p>
      
  //     {/* Add a new p tag to display your IP, city, and region */}
  //     <p className="text-gray-700 font-medium">
  //       🏠 Your IP: {isp.ip || "Unknown IP"} | City: {isp.city || "Unknown City"} | Region: {isp.region || "Unknown Region"}
  //     </p>
  //   </>
  // )}
  //         <p className="font-semibold text-gray-900 mt-2">📍 Packet Journey:</p>
  //         <RouterVisualization routers={osiData?.Layer3_Network.Routers} />
  //       </>
  <NetworkBase
  ip={osiData.Layer3_Network.IP}
  isp={isp}
  url={url}
/>
      ),
    },
    { title: "Data Link Layer", content: <DataLink /> },
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
