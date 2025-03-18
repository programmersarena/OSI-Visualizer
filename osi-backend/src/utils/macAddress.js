import os from "os";
import { exec } from "child_process";

// Function to get MAC address of the user's machine
export const getClientMacAddress = () => {
  const interfaces = os.networkInterfaces();
  for (const key in interfaces) {
    for (const net of interfaces[key]) {
      if (!net.internal && net.mac !== "00:00:00:00:00:00") {
        return net.mac;
      }
    }
  }
  return "Unknown MAC";
};

// Function to get MAC address of the default gateway (router)
export const getGatewayMacAddress = async () => {
  return new Promise((resolve, reject) => {
    exec("arp -a", (error, stdout) => {
      if (error) {
        reject("Error fetching ARP table");
      }

      const lines = stdout.split("\n");
      for (const line of lines) {
        if (line.includes("gateway") || line.includes("192.168.") || line.includes("10.1")) {
          const parts = line.split(/\s+/);
          const mac = parts.find(part => part.match(/^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/));
          if (mac) {
            resolve(mac);
          }
        }
      }
      resolve("Unknown MAC");
    });
  });
};