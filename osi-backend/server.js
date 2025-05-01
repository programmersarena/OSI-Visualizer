import express from 'express';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';
import routes from './src/routes.js';

const app = express();

const FRONTEND_URL = process.env.NEXT_SOCKET_FRONTEND_URL || 'http://localhost:3000';

app.use(cors({ origin: "*" }));
app.use(express.json());

const server = http.createServer(app);

const io = new Server(server, { cors: { origin: FRONTEND_URL, credentials: true } });

app.use('/api', routes);

app.get('/', (req, res) => res.send("Welcome to the server's homepage"));
app.get('/livecheck', (req, res) => res.send('Server is running!'));
app.get('*', (req, res) => res.status(404).send('404 Not Found'));

const activeSessions = {};

io.on("connection", (socket) => {
    activeSessions[socket.id] = {
        startTime: new Date().toISOString(),
        status: "Established"
    };

    io.emit("session-update", activeSessions);

    socket.on("disconnect", () => {
        if (activeSessions[socket.id]) {
            delete activeSessions[socket.id];
            io.emit("session-update", activeSessions);
            console.log(`User disconnected: ${socket.id}`);
        }
    });

    socket.on("request-sessions", () => {
        socket.emit("session-update", activeSessions);
    });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});


process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

function gracefulShutdown() {
    console.log('Shutting down gracefully...');

    io.close(() => {
        console.log('WebSocket server closed.');

        server.close(() => {
            console.log('HTTP server closed.');
            process.exit(0);
        });
    });
}
