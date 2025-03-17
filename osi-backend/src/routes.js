import express from "express";
import { getIPAddress } from "./utils/dnsUtils.js";
import { getTracerouteHops } from "./utils/tracerouteUtils.js";
import { getPortStatus } from "./utils/portUtils.js";
import { getHttpHeaders } from "./utils/httpUtils.js";
const router = express.Router();

router.post("/analyze", async (req, res) => {
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: "URL is required" });
    try {
        const hostname = new URL(url).hostname;
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


// DNS lookup route
router.post("/dns-lookup", async (req, res) => {
    let { domain } = req.body;
    if (!domain) return res.status(400).json({ error: "Domain is required" });
    try {
        const ip = await getIPAddress(domain); // Use the utility function
        res.json({ ip }); // Return the IP address
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});





export default router;
