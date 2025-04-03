import express from "express";
import { getClientMacAddress, getGatewayMacAddress } from "../utils/macAddress.js";

const router = express.Router();

// Get MAC Addresses
router.get("/mac-info", async (req, res) => {
    try {
        const clientMac = getClientMacAddress();
        const gatewayMac = await getGatewayMacAddress();
        res.json({ clientMac, gatewayMac });
    } catch (error) {
        console.error("Error fetching MAC addresses:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

export default router;
