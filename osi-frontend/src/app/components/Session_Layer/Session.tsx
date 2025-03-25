import React, { useEffect, useState } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:5000");

interface SessionData {
    [key: string]: {
        username: string;
        startTime: string;
        status: string;
    };
}

export default function SessionLayer() {
    const [sessions, setSessions] = useState<SessionData>({});
    const [sessionId, setSessionId] = useState<string>("");

    useEffect(() => {
        socket.on("session-update", (data: SessionData) => {
            console.log("Received active sessions:", data);
            setSessions(data);
        });

        socket.on("connect", () => {
            setSessionId(socket.id || "Unknown Session ID");
            console.log(`Connected with Session ID: ${sessionId}`);
        });

        return () => {
            socket.off("session-update");
            socket.off("connect");
        };
    }, []);


    const getAllActiveSessions = () => {
        socket.emit("render-session");
    };

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Session Layer - Active Sessions</h2>

            <button onClick={getAllActiveSessions} className="p-2 bg-red-500 text-white rounded">
                Get All Active Sessions
            </button>

            {Object.keys(sessions).length === 0 ? (
                <p>No active sessions.</p>
            ) : (
                <ul>
                    {Object.entries(sessions).map(([id, session]) => (
                        <li key={id} className="p-4 border rounded-lg shadow-sm mb-2 bg-gray-100">
                            <p>🆔 <strong>Session ID:</strong> {id}</p>
                            <p>👤 <strong>Username:</strong> {session.username}</p>
                            <p>🕰 <strong>Start Time:</strong> {new Date(session.startTime).toLocaleString()}</p>
                            <p>📊 <strong>Status:</strong> {session.status}</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
