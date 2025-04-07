"use client";
import { useState, useEffect, JSX } from "react";
import { motion } from "framer-motion";

type Props = {
  url: string;
};

export default function ThreeWayHandshake({ url }: Props): JSX.Element {
  const [step, setStep] = useState<number>(0);

  const getDomainName = (url: string) => {
    try {
      const { hostname } = new URL(url.startsWith("http") ? url : "http://" + url);
      return hostname.replace(/^www\./, "");
    } catch {
      return url;
    }
  };

  const domain = getDomainName(url);

  const getServerPort = (url: string) => {
    try {
      const parsed = new URL(url.startsWith("http") ? url : "http://" + url);
      return parsed.protocol === "https:" ? 443 : 80;
    } catch {
      return 443; // default fallback
    }
  };
  const clientPort = Math.floor(Math.random() * (65535 - 49152 + 1)) + 49152;
  const serverPort = getServerPort(url);

  useEffect(() => {
    const interval = setInterval(() => {
      setStep((prev) => (prev < 3 ? prev + 1 : 0));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center bg-gray-900 p-4  text-white">
      {/* <h1 className="text-3xl font-bold text-blue-400 mb-6">🔁 TCP 3-Way Handshake</h1> */}

      <div className="flex flex-col items-center w-full max-w-3xl border border-gray-700 p-6 rounded-lg bg-gray-800 shadow-md gap-6">
        <HandshakeStep
          step={step}
          number={1}
          direction="right"
          text="SYN"
          message={`Your PC → SYN: Hey ${domain}, I want to start a reliable connection.`}
        />
        <HandshakeStep
          step={step}
          number={2}
          direction="left"
          text="SYN-ACK"
          message={`${domain} → SYN-ACK: Sure! Let’s connect. I acknowledge your request.`}
        />
        <HandshakeStep
          step={step}
          number={3}
          direction="right"
          text="ACK"
          message={`Your PC → ACK: Confirmed! Let’s begin.`}
        />
      </div>
      
    </div>
  );
}

type HandshakeStepProps = {
  step: number;
  number: number;
  direction: "left" | "right";
  text: string;
  message: string;
};

const PCIcon = () => (
  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <rect x="3" y="4" width="18" height="12" rx="2" ry="2" strokeWidth="2" />
    <path strokeWidth="2" d="M8 20h8m-4-4v4" />
  </svg>
);

const ServerIcon = () => (
  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <rect x="2" y="4" width="20" height="6" rx="2" strokeWidth="2" />
    <rect x="2" y="14" width="20" height="6" rx="2" strokeWidth="2" />
    <path strokeWidth="2" d="M6 8h.01M6 18h.01" />
  </svg>
);

const HandshakeStep = ({ step, number, direction, text, message }: HandshakeStepProps) => {
  const isActive = step === number;

  return (
    <div className="flex flex-col w-full">
      <div className="flex flex-row justify-between items-center w-full p-3 border border-gray-600 rounded-lg bg-gray-700">
        <div className="flex flex-col items-center">
          <div className="w-10 h-10 bg-blue-500 flex items-center justify-center rounded-full">
            <PCIcon />
          </div>
          <p className="text-gray-300 text-xs mt-1">Your PC</p>
        </div>

        <div className="relative flex-1 flex justify-center">
          {isActive && (
            <motion.div
              key={text}
              initial={{ x: direction === "right" ? "-100%" : "100%", opacity: 0 }}
              animate={{ x: direction === "right" ? "100%" : "-100%", opacity: 1 }}
              transition={{ duration: 1 }}
              className="text-sm px-4 py-1 bg-yellow-400 text-black font-bold rounded-lg shadow-md"
            >
              {text}
            </motion.div>
          )}
        </div>

        <div className="flex flex-col items-center">
          <div className="w-10 h-10 bg-red-500 flex items-center justify-center rounded-full">
            <ServerIcon />
          </div>
          <p className="text-gray-300 text-xs mt-1">Server</p>
        </div>
      </div>

      {isActive && (
        <motion.p
          key={message}
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-sm text-gray-300 mt-2 text-center"
        >
          {message}
        </motion.p>
      )}
    </div>
  );
};
  