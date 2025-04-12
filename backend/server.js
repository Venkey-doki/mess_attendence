import app from "./app.js";
import { Server } from "socket.io";
import http from "http";

const PORT = process.env.PORT || 5000;

// Create HTTP server
const server = http.createServer(app);

// Create socket.io instance
const io = new Server(server, {
  cors: {
    origin: "*", // or your frontend URL
    methods: ["GET", "POST"]
  }
});

// On connection
io.on("connection", (socket) => {
  console.log("🔌 A client connected: " + socket.id);
});

export { io };

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
