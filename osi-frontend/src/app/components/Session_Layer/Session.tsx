import React, { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
const url = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000" ;
const socket = io(url);

interface SessionData {
    [key: string]: {
        startTime: string;
        status: string;
    };
}

export default function SessionLayer() {
    const [sessions, setSessions] = useState<SessionData>({});
    const [sessionDurations, setSessionDurations] = useState<{ [key: string]: string }>({});
    const [buttonVisible, setButtonVisible] = useState(true);
    const sessionsRef = useRef<SessionData>({});

    useEffect(() => {
        socket.on("session-update", (data: SessionData) => {
            console.log("Received active sessions:", data);
            setSessions(data);
            sessionsRef.current = data;
            setButtonVisible(false);
        });

        return () => {
            socket.off("session-update");
        };
    }, []);

    useEffect(() => {
        const updateDurations = () => {
            setSessionDurations(() => {
                const updatedDurations: { [key: string]: string } = {};
                Object.entries(sessionsRef.current).forEach(([id, session]) => {
                    const elapsed = Math.floor((Date.now() - new Date(session.startTime).getTime()) / 1000);
                    updatedDurations[id] = `${Math.floor(elapsed / 60)}m ${elapsed % 60}s`;
                });
                return updatedDurations;
            });
        };

        const interval = setInterval(updateDurations, 1000);
        return () => clearInterval(interval);
    }, []);

    const handleGetSessions = () => {
        socket.emit("request-sessions");
    };

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Session Layer - Active Sessions</h2>
            {buttonVisible && (
                <button onClick={handleGetSessions} className="p-2 bg-blue-500 text-white rounded cursor-pointer">
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
                            <p>⏳ <strong>Elapsed Time:</strong> {sessionDurations[id] || "0m 0s"}</p>
                            <p>📊 <strong>Status:</strong> {session.status}</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
