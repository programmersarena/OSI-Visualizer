import os from "os";
import { exec } from "child_process";

export const getTransmissionMode = () => {
    const interfaces = os.networkInterfaces();
    let detectedMode = "Unknown";

    for (const key in interfaces) {
        for (const net of interfaces[key]) {
            if (!net.internal && net.family === "IPv4") {

                if (key.toLowerCase().includes("wi-fi") || key.toLowerCase().includes("wlan")) {
                    return "Wi-Fi"; // Immediately return Wi-Fi if found
                } else if (key.toLowerCase().includes("ethernet") || key.toLowerCase().includes("eth")) {
                    detectedMode = "Ethernet"; // Store Ethernet if no Wi-Fi is found
                }
            }
        }
    }
    return detectedMode;
};
