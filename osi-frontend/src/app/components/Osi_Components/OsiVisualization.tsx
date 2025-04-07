import React, { useState } from "react";
import OsiLayer from "./OsiLayer";
import DataLink from "../Datalink_Layer/DataLink";
import TlsHandshake from "../Presentation_Layer/TlsHandshake";
import ApplicationBase from "../Application_Layer/Application_Base";
import SessionLayer from "../Session_Layer/Session";
import NetworkBase from "../Network_Layer/NetworkBase";
import PhysicalLayer from "../Physical_Layer/Physical";
import TlsHandshakeRealTime from "../Presentation_Layer/TlsHandshakeRealTime";
import TransportLayerVisualizer from "../Transport_Layer/TransportLayerVisualizer";

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
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);
  const [useRealTimeTLS, setUseRealTimeTLS] = useState(false);
  const toggleLayer = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const osiLayers = [
    { title: "Application Layer", content: <ApplicationBase domain={url} /> },
    {
      title: "Presentation Layer",
      content: (
        <div>
          <div className="flex justify-center items-center">
            <button
              onClick={() => setUseRealTimeTLS(!useRealTimeTLS)}
              className="px-4 py-2  my-3 bg-blue-500 text-white  rounded-md cursor-pointer"
            >
              {useRealTimeTLS ? "Switch to Simulated TLS" : "Switch to Real-Time TLS"}
            </button>
          </div>
          {useRealTimeTLS ? <TlsHandshakeRealTime url={url} /> : <TlsHandshake url={url} />}
        </div>
      ),
    },
    { title: "Session Layer", content: <SessionLayer /> },
    { title: "Transport Layer", content: <TransportLayerVisualizer url={url}/> },
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
