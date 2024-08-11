// server.js
import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import connectDB from "./config/db.js";
import authRoutes from './routes/authRoutes.js';
import cors from 'cors';
import path from 'path';
import { Server as SocketIOServer } from 'socket.io';
import Chat from "./models/Chat.js"; // Import the Chat model
import http from 'http';

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server);
const connectedUsers = {};

const corsOptions ={
    origin:["https://unishare-ten.vercel.app"],
    methods:["POST","GET"], 
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200,
 }
 // Middleware to log incoming requests
const logRequests = (req, res, next) => {
    console.log('Incoming Request:');
    console.log('Method:', req.method);
    console.log('URL:', req.url);
    console.log('Headers:', req.headers);
    console.log('Body:', req.body);
    console.log('---'); // Separator for readability
    next(); // Call the next middleware or route handler
  };
  
  // Apply middleware to log all requests
  app.use(logRequests);
  
 app.use(cors(corsOptions))// Allow requests only from specified origin
  
 
  

app.use(express.json());
app.use(morgan('dev'));
server.prependListener("request", (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
 });
// Serve uploaded images statically
const __dirname = path.resolve();
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Socket.IO setup
io.on('connection', (socket) => {
    console.log('A user connected!');

    // Join a room based on product ID
    socket.on('join-room', (productId) => {
        socket.join(productId); // Join the room with product ID
        connectedUsers[socket.id] = productId; // Store user ID and room ID
        console.log(`User ${socket.id} joined room ${productId}`);
    });

    // Handle incoming messages
    socket.on('send-message', async (data) => {
        try {
            // Validate and save the message using Chat model
            const newMessage = new Chat(data);
            await newMessage.save(); // Await the saving promise

            // Emit the message to all connected users in the same room
            io.to(connectedUsers[socket.id]).emit('receive-message', newMessage);
        } catch (err) {
            console.error('Error saving message:', err);
        }
    });
   
    
    // Handle user disconnect
    socket.on('disconnect', () => {
        const roomId = connectedUsers[socket.id];
        delete connectedUsers[socket.id];
        console.log(`User ${socket.id} disconnected from room ${roomId}`);
    });
});

// API routes
app.use('/api/v1/auth', authRoutes);

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
    console.log(`Server Running on ${PORT}`);
});
