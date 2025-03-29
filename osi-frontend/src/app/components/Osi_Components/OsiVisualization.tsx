import React, { useState } from "react";
import ThreeWayHandshake from "../Transport_Layer/ThreeWayHandshake";
import OsiLayer from "./OsiLayer";
import DataLink from "../Datalink_Layer/DataLink";
import TlsHandshake from "../Presentation_Layer/TlsHandshake";
import ApplicationBase from "../Application_Layer/Application_Base";
import SessionLayer from "../Session_Layer/Session";
import NetworkBase from "../Network_Layer/NetworkBase";
import PhysicalLayer from "../Physical_Layer/Physical";

interface NetworkLayerData {
  IP: string;
}

interface OsiData {
  Layer3_Network: NetworkLayerData;
}

interface IspDetails {
  ip: string;
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
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0); // Initially expand the first layer

  const toggleLayer = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index); // Toggle the layer
  };

  const osiLayers = [
    { title: "Application Layer", content: <ApplicationBase domain={url} /> },
    { title: "Presentation Layer", content: <TlsHandshake url={url} /> },
    { title: "Session Layer", content: <SessionLayer /> },
    { title: "Transport Layer", content: <ThreeWayHandshake /> },
    {
      title: "Network Layer",
      content: <NetworkBase ip={osiData.Layer3_Network.IP} isp={isp} url={url} />,
      alwaysRender: true,
    },
    { title: "Data Link Layer", content: <DataLink /> },
    { title: "Physical Layer", content: <PhysicalLayer /> },
  ];

  return (
    <div className="mt-6 w-full max-w-4xl bg-gray-500 p-4 rounded-lg shadow-md">
      {osiLayers.map((layer, index) => (
        <OsiLayer
          key={index}
          title={layer.title}
          content={layer.content}
          isVisible={currentStep >= index + 1}
          isExpanded={expandedIndex === index}
          toggle={() => toggleLayer(index)}
          alwaysRender={layer.alwaysRender || false}
        />
      ))}
    </div>
  );
};

export default OsiVisualization;
