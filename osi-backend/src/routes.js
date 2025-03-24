import express from "express";
import { extractUrlDetails, getDomainDetails, getIPAddress } from "./utils/dnsUtils.js";
import { getTracerouteHops } from "./utils/tracerouteUtils.js";
import { getHttpRequestHeaders, getHttpHeaders } from "./utils/httpUtils.js";
import { getClientMacAddress , getGatewayMacAddress } from "./utils/macAddress.js";
import { getEncodingDetails } from "./utils/encodingUtils.js";
import { getTransmissionMode } from "./utils/transmissionUtils.js";
const router = express.Router();

router.post("/analyze", async (req, res) => {
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: "URL is required" });
    try {
        const hostname = new URL(url).hostname;
        const ipAddress = await getIPAddress(hostname);
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

  router.get("/get-transmission", (req, res) => {
    try {
      const transmissionMode = getTransmissionMode();
      res.json({ transmissionMode });
    } catch (error) {
      console.error("Error fetching transmission mode:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

export default router;


