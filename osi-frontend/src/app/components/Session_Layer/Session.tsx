import React, { useEffect, useState } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:5000");

interface SessionData {
    [key: string]: {
        startTime: string;
        status: string;
    };
}

export default function SessionLayer() {
    const [sessions, setSessions] = useState<SessionData>({});
    const [buttonVisible, setButtonVisible] = useState(true);

    useEffect(() => {
        socket.on("session-update", (data: SessionData) => {
            console.log("Received active sessions:", data);
            setSessions(data);
            setButtonVisible(false);
        });

        return () => {
            socket.off("session-update");
        };
    }, []);

    const handleGetSessions = () => {
        socket.emit("request-sessions");
    };

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Session Layer - Active Sessions</h2>
            {buttonVisible && (
                <button onClick={handleGetSessions} className="p-2 bg-blue-500 text-white rounded">
                    Get All Active Sessions
                </button>
            )}

            {Object.keys(sessions).length === 0 ? (
                <p className="mt-4">No active sessions.</p>
            ) : (
                <ul className="mt-4">
                    {Object.entries(sessions).map(([id, session]) => (
                        <li key={id} className="p-4 border rounded-lg shadow-sm mb-2 bg-gray-100">
                            <p>🆔 <strong>Session ID:</strong> {id}</p>
                            <p>🕰 <strong>Start Time:</strong> {new Date(session.startTime).toLocaleString()}</p>
                            <p>📊 <strong>Status:</strong> {session.status}</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}