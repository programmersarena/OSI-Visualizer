import express from "express";
import https from "https";
import tls from "tls";
import crypto from "crypto";

const router = express.Router();
const secretKey = crypto.randomBytes(32);

const encryptData = (data) => {
    const cipher = crypto.createCipheriv("aes-256-cbc", secretKey, Buffer.alloc(16, 0));
    let encrypted = cipher.update(data, "utf8", "base64");
    encrypted += cipher.final("base64");
    return encrypted;
};

router.post("/tls-handshake", async (req, res) => {
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: "URL is required!" });

    let handshakeSteps = [];

    try {
        const options = { host: new URL(url).hostname, port: 443, rejectUnauthorized: false };
        const socket = tls.connect(options, () => {
            // Step 1: Client Hello
            handshakeSteps.push("📡 Client Hello: Sending supported ciphers & TLS version.");

            // Step 2: Server Hello
            handshakeSteps.push("🖥️ Server Hello: Choosing cipher & sending certificate.");
            const cipher = socket.getCipher();
            const tlsVersion = socket.getProtocol();
            const cert = socket.getPeerCertificate();
            console.log(cert)

            // Step 3: Certificate Exchange
            handshakeSteps.push(`📜 Server Certificate: Issued by ${cert.issuer.O}, Valid till ${cert.valid_to}.`);

            // Step 4: Key Exchange & Secure Communication
            handshakeSteps.push("🔑 Key Exchange: Generating session keys for encryption.");
            handshakeSteps.push("🔐 Secure Channel Established: Data is now encrypted.");

            // Encrypt a sample message
            const encrypted = encryptData("This is a secure message over TLS.");

            res.json({
                handshakeSteps,
                encryptedData: encrypted,
                cipherSuite: cipher.name,
                tlsVersion,
                certificate: {
                    serialNumber: cert.serialNumber,
                    publicKey: cert.pubkey,
                    validFrom: cert.valid_from,
                    validTo: cert.valid_to
                }
            });
        });

        socket.on("error", (err) => res.status(500).json({ error: "TLS Handshake failed", details: err.message }));
    } catch (err) {
        res.status(500).json({ error: "Unexpected error", details: err.message });
    }
});

export default router;
