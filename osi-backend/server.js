import express from "express";
import cors from "cors";
import routes from "./src/routes.js";

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api", routes);

app.get('/livecheck', (req, res) => {
    res.send('Server is running!');
  });

const server = app.listen(5000, () => console.log("Server running on port 5000"));

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