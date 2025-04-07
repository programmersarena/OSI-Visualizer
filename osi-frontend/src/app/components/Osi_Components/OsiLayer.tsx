import React, { useEffect, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

type OsiLayerProps = {
  title: string;
  content: React.ReactNode;
  isVisible: boolean;
  isExpanded: boolean;
  toggle: () => void;
  alwaysRender?: boolean;
};

const OsiLayer: React.FC<OsiLayerProps> = ({
  title,
  content,
  isVisible,
  isExpanded,
  toggle,
  alwaysRender = false, // Default: only render when expanded
}) => {
  const [shouldRender, setShouldRender] = useState(alwaysRender);

  useEffect(() => {
    if (isExpanded || alwaysRender) {
      setShouldRender(true);
    } else {
      const timer = setTimeout(() => setShouldRender(false), 500);
      return () => clearTimeout(timer);
    }
  }, [isExpanded, alwaysRender]);

  if (!isVisible) return null; // Hide the layer if it's not reached

  return (
    <div className="p-4 my-2 rounded-lg transition-all duration-700 shadow-md border border-gray-300 bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200">
      <button
        className="flex justify-between items-center w-full text-left font-semibold text-gray-900 hover:cursor-pointer"
        onClick={toggle}
      >
        <span className="hover:cursor-pointer">{title}</span>
        {isExpanded ? (
          <ChevronUp size={18} className="hover:cursor-pointer" />
        ) : (
          <ChevronDown size={18} className="hover:cursor-pointer" />
        )}
      </button>

      <div
  className={`transition-all duration-500 overflow-hidden ${
    isExpanded ? "max-h-[2000px] opacity-100 mt-2" : "max-h-0 opacity-0"
  }`}
>

        {shouldRender && (
          <div className="text-sm text-gray-700 p-2 bg-white rounded-md shadow-inner">
            {content}
          </div>
        )}
      </div>
    </div>
  );
};

export default OsiLayer;
