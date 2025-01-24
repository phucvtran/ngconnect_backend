// src/index.ts
import express, { Express } from "express";
import { Server } from "socket.io";
import http from "http";
import cors from "cors";
import "dotenv/config";

import sequelize from "./config/dbConnection";
import { ErrorHandler } from "./middlewares/ErrorHandler";
import UserRoutes from "./routes/UserRoutes";
import ListingRoutes from "./routes/ListingRoutes";
import config from "./config/config";
import RequestRoutes from "./routes/RequestRoutes";
import Conversations from "./models/Conversations";

(async () => {
  console.log("connect DB and created table");
  await sequelize.sync();
  // await sequelize.sync({ alter: true });
  // await sequelize.sync({ force: true }); // Warning: This will drop and recreate tables
})();
const app: Express = express();
const port = process.env.PORT || 8080;

app.use(cors(config.corsOptions));

app.use(express.json());

//apply routes
app.use("/api/users", UserRoutes);

app.use("/api/request", RequestRoutes);

app.use("/api/listing", ListingRoutes);

// Error Handling Middleware (Always at the end)
app.use(ErrorHandler);

app.listen(port, () => {
  console.log(`[server]: Server is running at port: ${port}`);
});

//socket io for live chat

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // Allow React frontend
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Handle incoming messages
  socket.on("sendMessage", (data) => {
    const { message, listingRequestId, senderId, receiverId } = data;
    console.error(data);
    // Emit the message to users in the same conversation
    socket.to(listingRequestId).emit("receiveMessage", data);
    // Optionally save the message to the database here
    Conversations.create(data);
  });

  // Join a conversation room
  socket.on("joinConversation", (listingRequestId) => {
    socket.join(listingRequestId);
    console.log(`User joined conversation: ${listingRequestId}`);
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

server.listen(5000, () => {
  console.log("Live Chat Server running on port 5000");
});
