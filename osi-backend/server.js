import express from "express";
import cors from "cors";
import http from "http";
import routes from "./src/routes.js";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: "*" },
});
app.use(cors());
app.use(express.json());
app.use("/api", routes);

app.get('/livecheck', (req, res) => {
    res.send('Server is running!');
});

app.get('*', (req, res) => {
    res.status(404).send('404 Not Found');
});


app.get('/', (req, res) => {
    res.send('Welcome to server\'s Homepage');
});

let activeSessions = {}

io.on("connection", (socket) => {

    activeSessions[socket.id] = {
        startTime: new Date(),
        status: "Established"
    };

    io.emit("session-update", activeSessions);

    socket.on("disconnect", () => {
        if (activeSessions[socket.id]) {
            activeSessions[socket.id].status = "Disconnected";
            io.emit("session-update", activeSessions);
            delete activeSessions[socket.id];
        }
    });

    socket.on("render-session", () => {
        if (activeSessions[socket.id]) {
            io.emit("session-update", activeSessions)
        }
    });
});


server.listen(5000, () => console.log("Server running on port 5000"));

process.on("SIGTERM", () => {
    console.log("SIGTERM received. Shutting down gracefully...");
    server.close(() => {
        console.log("Server closed.");
        process.exit(0);
    });
});

process.on("SIGINT", () => {
    console.log("SIGINT received. Shutting down...");
    server.close(() => {
        console.log("Server closed.");
        process.exit(0);
    });
});