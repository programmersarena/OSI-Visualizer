import express from "express";
import { extractUrlDetails, getDomainDetails, getIPAddress } from "./utils/dnsUtils.js";
import { getTracerouteHops } from "./utils/tracerouteUtils.js";
import { getPortStatus } from "./utils/portUtils.js";
import { getHttpRequestHeaders, getHttpHeaders } from "./utils/httpUtils.js";
import { getClientMacAddress , getGatewayMacAddress } from "./utils/macAddress.js";
import { getEncodingDetails } from "./utils/encodingUtils.js";
const router = express.Router();

router.post("/analyze", async (req, res) => {
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: "URL is required" });
    try {
        const hostname = new URL(url).hostname;
        const ipAddress = await getIPAddress(hostname);
        // const tracerouteData = await getTracerouteHops(hostname);

        // const osiData = {
        //     Layer1_Physical: "Network Interface Info",
        //     Layer2_DataLink: "MAC Address Info",
        //     Layer3_Network: { IP: ipAddress, Hops: tracerouteData.hopCount, Routers: tracerouteData.hopIPs },
        //     Layer4_Transport: await getPortStatus(hostname),
        //     Layer5_Session: "TCP Handshake Verified",
        //     Layer6_Presentation: "SSL/TLS Encryption",
        //     Layer7_Application: await getHttpHeaders(url),
        // };
        res.json(ipAddress);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

//traceroute 
router.post("/network-traceroute", async (req, res) => {
  let { url } = req.body;
  if (!url) return res.status(400).json({ error: "Domain is required" });

  try {
      // Use the getTracerouteHops function to get the traceroute results
      const hostname = new URL(url).hostname;
      const result = await getTracerouteHops(hostname);
      
      // Return the traceroute results (hop count and hop IPs)
      res.json(result);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});


// DNS lookup route
router.post("/dns-lookup", async (req, res) => {
    let { domain } = req.body;
    if (!domain) return res.status(400).json({ error: "Domain is required" });
    try {
        const result = await getDomainDetails(domain); // Use the updated function
        res.json(result); // Return IP, protocol, domain, and path
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

//URL Details
router.post("/url-details", (req, res) => {
  let { domain } = req.body;
  if (!domain) return res.status(400).json({ error: "Domain is required" });

  try {
      const details = extractUrlDetails(domain);
      res.json(details); // Returns protocol, domain, and path
  } catch (error) {
      res.status(500).json({ error: "Invalid URL format" });
  }
});

//Encoding
router.post("/check-encoding", async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: "URL is required" });

  try {
    const encoding = await getEncodingDetails(url);
    res.json({ encoding });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


//HTTP header details
router.post("/get-http-request", async (req, res) => {
  const  url  = req.body.domain;
  if (!url) {
      return res.status(400).json({ error: "URL is required" });
  }
  try {
      const requestLines = await getHttpRequestHeaders(url);
      res.json({ requestLines });
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});


// MAC address route

router.get("/mac-info", async (req, res) => {
    try {
      const clientMac = getClientMacAddress();
      const gatewayMac = await getGatewayMacAddress();
  
      res.json({
        clientMac: clientMac,
        gatewayMac: gatewayMac,
      });
    } catch (error) {
      console.error("Error fetching MAC addresses:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

export default router;


