import express from 'express';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';
import routes from './src/routes.js';

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

app.use(cors());
app.use(express.json());
app.use('/api', routes);

const activeSessions = {};

app.get('/', (req, res) => res.send("Welcome to the server's homepage"));
app.get('/livecheck', (req, res) => res.send('Server is running!'));
app.get('*', (req, res) => res.status(404).send('404 Not Found'));

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
            console.log(`User disconnected: ${socket.id}`);
            delete activeSessions[socket.id];
        }
    });

    socket.on("request-sessions", () => {
        io.emit("session-update", activeSessions);
    });
});

server.listen(5000, '0.0.0.0', () => console.log("Server running on port 5000"));

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

function gracefulShutdown() {
    console.log('Shutting down gracefully...');
    server.close(() => {
        console.log('Server closed.');
        process.exit(0);
    });
}
