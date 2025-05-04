"use client";

import { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

interface Certificate {
    validFrom: string;
    validTo: string;
}

const TlsHandshake = ({ url }: { url: string }) => {
    const [handshakeSteps, setHandshakeSteps] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [encryptedData, setEncryptedData] = useState("");
    const [tlsVersion, setTlsVersion] = useState("");
    const [cipherSuite, setCipherSuite] = useState("");
    const [certificate, setCertificate] = useState<Certificate | null>(null);

    const fetchTlsHandshake = async () => {
        setLoading(true);
        setError("");
        setHandshakeSteps([]);
        setEncryptedData("");
        setTlsVersion("");
        setCipherSuite("");
        setCertificate(null);

        try {
            const response = await axios.post(process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/tls-handshake/tls-handshake", { url });

            setHandshakeSteps(response.data.handshakeSteps);
            setEncryptedData(response.data.encryptedData);
            setTlsVersion(response.data.tlsVersion);
            setCipherSuite(response.data.cipherSuite);
            setCertificate(response.data.certificate as Certificate);
        } catch {
            setError("⚠️ Failed to fetch TLS Handshake. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="border p-5 rounded-lg bg-gray-900 shadow-lg max-w-lg mx-auto">
            <h2 className="text-2xl  text-center font-semibold text-blue-400 mb-4">🔐 Real-Time TLS Handshake</h2>
            <p className="text-gray-400 mb-3  text-center">
                <strong>URL:</strong> <span className="text-blue-300">{url}</span>
            </p>
<div className="flex justify-center items-center">
            <motion.button
                onClick={fetchTlsHandshake}
                whileHover={{ scale: 1.05 }}    
                whileTap={{ scale: 0.95 }}
                className="px-5 py-2 bg-blue-600 text-white font-semibold rounded-md shadow-md hover:bg-blue-700 transition cursor-pointer"

                disabled={loading}
            >
                {loading ? "🔄 Processing..." : "🚀 Simulate TLS Handshake"}
            </motion.button>
</div>
            {error && <p className="text-red-500 mt-3">{error}</p>}

            {handshakeSteps.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mt-5 p-4 bg-gray-800 rounded-lg shadow-md"
                >
                    <h3 className="text-gray-300  text-center font-bold">📜 TLS Handshake Steps:</h3>
                    <ul className="list-disc pl-5 text-gray-200">
                        {handshakeSteps.map((step, index) => (
                            <motion.li
                                key={index}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.3 }}
                            >
                                {step}
                            </motion.li>
                        ))}
                    </ul>

                    <h3 className="text-gray-300  text-center font-bold mt-4">🛡️ TLS Details:</h3>
                    <p className="text-gray-300">🔗 <strong>Version:</strong> {tlsVersion}</p>
                    <p className="text-gray-300">🔒 <strong>Cipher Suite:</strong> {cipherSuite}</p>

                    {certificate && (
                        <div className="mt-4">
                            <h3 className="text-gray-300 text-center font-bold">📜 Certificate Info:</h3>
                            <p className="text-gray-300">📅 <strong>Valid From:</strong> {certificate.validFrom}</p>
                            <p className="text-gray-300">📅 <strong>Valid To:</strong> {certificate.validTo}</p>
                        </div>
                    )}

                    <h3 className="text-gray-300  text-center font-bold mt-4">🔒 Encrypted Message:</h3>
                    <p className="text-gray-300 break-words">{encryptedData}</p>
                </motion.div>
            )}
        </div>
    );
};

export default TlsHandshake;
