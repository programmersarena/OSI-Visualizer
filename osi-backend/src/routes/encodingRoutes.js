import express from "express";
import { getEncodingDetails } from "../utils/encodingUtils.js";

const router = express.Router();

// Encoding Detection Route
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

export default router;
