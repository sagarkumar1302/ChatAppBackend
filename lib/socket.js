import {Server} from "socket.io"
import http from "http"
import express from "express"
const app = express()
const server = http.createServer(app)
const userSocketMap ={} //{userId: socketId}
const io = new Server(server,{
    cors:{
        origin: ["https://chat-appfrnt.vercel.app/"],
    },
});
export function getRecieverSocketId(userId){
    return userSocketMap[userId];
}
//Used to store online users
io.on("connection",(socket)=>{
    console.log("A user is connected", socket.id);
    const userId = socket.handshake.query.userId;
    if(userId) userSocketMap[userId]= socket.id
    io.emit("getOnlineUsers", Object.keys(userSocketMap))
    socket.on("disconnect", ()=>{
        console.log("A user is disconnected", socket.id);
        delete userSocketMap[userId]
        io.emit("getOnlineUsers", Object.keys(userSocketMap))
        
    })
    socket.on("typing", ({ to }) => {
        const receiverSocketId = getRecieverSocketId(to);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("typing");
        }
    });

    socket.on("stopTyping", ({ to }) => {
        const receiverSocketId = getRecieverSocketId(to);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("stopTyping");
        }
    });
})
export {io, app, server}