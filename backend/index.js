import express from "express";
import bodyParser from "body-parser";
import { Server } from "socket.io";
import cors from "cors";

const io = new Server({
    cors: true
});
const app = express() ;

app.use(bodyParser.json());
app.use(cors({
    origin: ["http://localhost:5173"],
    credentials: true
}));

const emailToSocketMap = new Map() ;
const socketIdToEmailMap = new Map() ;

io.on("connection" , (socket) => {
    console.log("new connection") ;
    
    socket.on("join-room" , (data) => {
        const {roomId , email} = data ;
        console.log(`User with email ${email} joined room ${roomId}`);
        emailToSocketMap.set(email ,socket.id)
        socketIdToEmailMap.set(socket.id , email) ;
        socket.join(roomId);
        socket.emit("joined-room" , {
            roomId
        })
        socket.broadcast.to(roomId).emit("user-joined" ,{ 
            email,
        })
    })

    socket.on("call-user", (data) => {
        const {email , offer} = data ;
        const fromEmail = socketIdToEmailMap.get(socket.id) ;
        const socketId = emailToSocketMap.get(email) ;
        
        if (socketId) {
            console.log(`Forwarding call from ${fromEmail} to ${email}`);
            socket.to(socketId).emit("incoming-call", {
                from : fromEmail,
                offer
            })
        } else {
            console.log(`User ${email} not found for call`);
        }
    })

    socket.on("call-accepted" , (data) => {
        const {email , answer} = data ;
        const socketId = emailToSocketMap.get(email) ;
        
        if (socketId) {
            console.log(`Forwarding answer from ${email}`);
            socket.to(socketId).emit("call-accepted", {
                answer
            })
        } else {
            console.log(`User ${email} not found for answer`);
        }
    })

    socket.on("ice-candidate", (data) => {
        const {email, candidate} = data;
        const socketId = emailToSocketMap.get(email);
        
        if (socketId) {
            console.log(`Forwarding ICE candidate to ${email}`);
            socket.to(socketId).emit("ice-candidate", {
                candidate
            });
        } else {
            console.log(`User ${email} not found for ICE candidate`);
        }
    })

    socket.on("disconnect", () => {
        const email = socketIdToEmailMap.get(socket.id);
        if (email) {
            console.log(`User ${email} disconnected`);
            emailToSocketMap.delete(email);
            socketIdToEmailMap.delete(socket.id);
        }
    });
})

app.listen(3000, () => console.log("Server is running on port 3000"));
io.listen(3001);