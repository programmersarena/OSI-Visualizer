import express from "express";
import { getTransmissionMode } from "../utils/transmissionUtils.js";

const router = express.Router();

// Get Transmission Mode
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
