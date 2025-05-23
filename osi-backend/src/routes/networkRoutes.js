import express from "express";
import { getTracerouteHops } from "../utils/tracerouteUtils.js";

const router = express.Router();

// Traceroute Route
router.post("/network-traceroute", async (req, res) => {
    let { url } = req.body;
    if (!url) return res.status(400).json({ error: "Domain is required" });
    if (!/^https?:\/\//i.test(url)) {
        url = `https://${url}`;
    }
    try {
        const hostname = new URL(url).hostname;
        const result = await getTracerouteHops(hostname);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
