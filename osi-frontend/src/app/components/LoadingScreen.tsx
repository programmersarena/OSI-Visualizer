"use client";
import { useEffect, useState } from "react";

const loadingMessages = [
  "⏳ Hold on... fetching all the secret internet details! 🤫",
  "🚀 Sending packets on a mission to gather your data...",
  "🔍 Searching through layers... almost there!",
  "🌐 Navigating through the internet maze...",
  "💡 Ever wondered how much happens behind the scenes?",
  "🛜 Routers, switches, and magic—it's all working for you!",
  "📡 Almost there! Your packets are traveling at the speed of light!",
  "⚡ Gathering network insights faster than a caffeine-powered server...",
];

const LoadingScreen: React.FC = () => {
  const [loadingIndex, setLoadingIndex] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setLoadingIndex((prev) => (prev + 1) % loadingMessages.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center mt-6 p-6 bg-blue-200 rounded-lg shadow-md animate-pulse">
      <p className="text-lg font-semibold text-blue-900">⌛ Please wait, gathering details...</p>
      <p className="text-gray-700 text-sm italic mt-2">{loadingMessages[loadingIndex]}</p>
      <div className="flex gap-2 mt-3">
        <span className="animate-bounce delay-100 text-2xl">⚙️</span>
        <span className="animate-bounce delay-200 text-2xl">🌍</span>
        <span className="animate-bounce delay-300 text-2xl">💾</span>
      </div>
    </div>
  );
};

export default LoadingScreen;
