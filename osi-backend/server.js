import express from "express";
import cors from "cors";
import dns from "node:dns/promises";
import net from "net";
import fetch from "node-fetch";
import { exec } from "child_process";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/analyze", async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: "URL is required" });

  try {
    const hostname = extractHostname(url);
    const ipAddress = await getIPAddress(hostname);
    const tracerouteData = await getTracerouteHops(hostname);

    const osiData = {
      Layer1_Physical: "Network Interface Info",
      Layer2_DataLink: "MAC Address Info",
      Layer3_Network: { IP: ipAddress, Hops: tracerouteData.hopCount, Routers: tracerouteData.hopIPs },
      Layer4_Transport: await getPortStatus(hostname),
      Layer5_Session: "TCP Handshake Verified",
      Layer6_Presentation: "SSL/TLS Encryption",
      Layer7_Application: await getHttpHeaders(url),
    };

    res.json(osiData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Extract hostname from URL
function extractHostname(url) {
  return new URL(url).hostname;
}

// Function to get IP Address (Layer 3 - Network)
async function getIPAddress(domain) {
  try {
    const { address } = await dns.lookup(domain);
    return address;
  } catch (err) {
    throw new Error(`DNS Lookup Failed: ${err.message}`);
  }
}

// Function to perform traceroute and extract all router IPs
async function getTracerouteHops(domain) {
  return new Promise((resolve) => {
    const command = process.platform === "win32" ? `tracert -d -h 30 ${domain}` : `traceroute -n -m 30 ${domain}`;

    exec(command, (error, stdout) => {
      if (error) return resolve({ hopCount: "Traceroute failed", hopIPs: [] });

      const hopLines = stdout.split("\n").filter((line) => line.match(/^\s*\d+/));
      const hopIPs = hopLines.map((line) => {
        const match = line.match(/(\d+\.\d+\.\d+\.\d+)/);
        return match ? match[1] : "Unknown";
      });

      resolve({ hopCount: hopIPs.length, hopIPs });
    });
  });
}

// Function to check open ports (Layer 4 - Transport)
async function getPortStatus(host) {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    socket.setTimeout(2000);
    socket.on("connect", () => {
      resolve("Port 443 (HTTPS) Open");
      socket.destroy();
    });
    socket.on("error", () => resolve("Port 443 Closed"));
    socket.on("timeout", () => resolve("Port 443 Timeout"));
    socket.connect(443, host);
  });
}

// Function to get HTTP headers (Layer 7 - Application)
async function getHttpHeaders(url) {
  try {
    const response = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0" },
    });
    return Object.fromEntries(response.headers.entries());
  } catch (error) {
    return `Failed to fetch headers: ${error.message}`;
  }
}

// Start server
app.listen(5000, () => console.log("Server running on port 5000"));
