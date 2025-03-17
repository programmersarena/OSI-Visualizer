import React from "react";

type OsiLayerProps = {
  title: string;
  content: React.ReactNode;
  isVisible: boolean;
};

const OsiLayer: React.FC<OsiLayerProps> = ({ title, content, isVisible }) => {
  return (
    <div
      className={`p-4 my-2 bg-gray-200 border border-gray-400 rounded-lg transition-all duration-700 ${
        isVisible ? "opacity-100" : "opacity-50"
      }`}
    >
      <p className="font-semibold text-gray-900">{title}:</p>
      <div className="text-sm text-gray-700">{content}</div>
    </div>
  );
};

export default OsiLayer;
