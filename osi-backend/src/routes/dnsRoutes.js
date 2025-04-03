import express from "express";
import { extractUrlDetails, getDomainDetails, getIPAddress } from "../utils/dnsUtils.js";

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

router.post("/dns-lookup", async (req, res) => {
    const { domain } = req.body;
    if (!domain) return res.status(400).json({ error: "Domain is required" });

    try {
        const result = await getDomainDetails(domain);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// URL Details Extraction
router.post("/url-details", (req, res) => {
    const { domain } = req.body;
    if (!domain) return res.status(400).json({ error: "Domain is required" });

    try {
        const details = extractUrlDetails(domain);
        res.json(details);
    } catch (error) {
        res.status(500).json({ error: "Invalid URL format" });
    }
});

export default router;
