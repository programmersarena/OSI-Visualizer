import express from "express";
import dnsRoutes from "./routes/dnsRoutes.js";
import networkRoutes from "./routes/networkRoutes.js";
import httpRoutes from "./routes/httpRoutes.js";
import encodingRoutes from "./routes/encodingRoutes.js";
import macRoutes from "./routes/macRoutes.js";
import transmissionRoutes from "./routes/transmissionRoutes.js";
import tlsHandShake from "./routes/tlsHandshake.js"

const router = express.Router();

router.use("/dns", dnsRoutes);
router.use("/network", networkRoutes);
router.use("/http", httpRoutes);
router.use("/encoding", encodingRoutes);
router.use("/mac", macRoutes);
router.use("/transmission", transmissionRoutes);
router.use("/tls-handshake", tlsHandShake)

export default router;
