import express from "express";
import { getHttpRequestHeaders } from "../utils/httpUtils.js";

const router = express.Router();

// Get HTTP Request Headers
router.post("/get-http-request", async (req, res) => {
    const { domain } = req.body;
    if (!domain) return res.status(400).json({ error: "URL is required" });

    try {
        const requestLines = await getHttpRequestHeaders(domain);
        res.json({ requestLines });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
