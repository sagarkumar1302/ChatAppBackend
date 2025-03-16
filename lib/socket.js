import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const userSocketMap = {}; // { userId: socketId }

// Initialize Socket.IO server with proper CORS settings
const io = new Server(server, {
    cors: {
        origin: "https://chat-appfrnt.vercel.app",
        methods: ["GET", "POST"],
    },
});

// Function to get receiver's socket ID
export function getReceiverSocketId(userId) {
    return userSocketMap[userId];
}

// Handle socket connections
io.on("connection", (socket) => {
    console.log("✅ A user connected:", socket.id);

    const userId = socket.handshake.query.userId;
    
    if (userId) {
        userSocketMap[userId] = socket.id;
        console.log(`📌 User ${userId} mapped to socket ${socket.id}`);
    }

    // Send updated list of online users
    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    // Handle user disconnect
    socket.on("disconnect", () => {
        console.log("❌ A user disconnected:", socket.id);
        
        // Remove user from userSocketMap
        for (const [id, sockId] of Object.entries(userSocketMap)) {
            if (sockId === socket.id) {
                delete userSocketMap[id];
                console.log(`📌 Removed user ${id} from active list`);
                break;
            }
        }

        // Emit updated online users list
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });

    // Handle "typing" event
    socket.on("typing", ({ to }) => {
        const receiverSocketId = getReceiverSocketId(to);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("typing");
        }
    });

    // Handle "stopTyping" event
    socket.on("stopTyping", ({ to }) => {
        const receiverSocketId = getReceiverSocketId(to);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("stopTyping");
        }
    });
});

// Export modules
export { io, app, server };
