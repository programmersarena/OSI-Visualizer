"use client";
import { JSX } from "react";

interface Props {
  url: string;
}

export default function UdpVisualizer({ url }: Props): JSX.Element {
  const getDomainName = (url: string) => {
    try {
      const { hostname } = new URL(url.startsWith("http") ? url : "http://" + url);
      return hostname.replace(/^www\./, "");
    } catch {
      return url;
    }
  };

  const domain = getDomainName(url);
  const serverPort = url.startsWith("https") ? 443 : 80;
  const clientPort = 50000 + Math.floor(Math.random() * 10000);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-yellow-400">UDP: 🚀 Fast but Unreliable</h2>
      <p className="text-white text-base leading-relaxed">
  UDP (User Datagram Protocol) is a connectionless protocol that enables fast, lightweight data transmission without guaranteeing delivery, order, or error correction. It is ideal for real-time applications like video streaming or online gaming where speed is prioritized over reliability.
</p>

      <div className="bg-gray-800 p-4 rounded-lg space-y-2">
        <p>Message [No SEQ] → {domain}:{serverPort}</p>
        <p className="text-gray-400">No handshake, no ACK, no retransmission</p>
      </div>
    </div>
  );
}
