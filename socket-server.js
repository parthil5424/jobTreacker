import express from "express";
import { Server } from "socket.io";
import { createServer } from "http";
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  //   path: "/socket.io",
  cors: "http://localhost:3000",
  methods: ["GET", "POST"],
  credentials: true,
});

io.on("connection", (socket) => {
  console.log("Connection Established with Socket Id", socket.id);
  socket.on("disconnect", (reason) => {
    console.log("❌ Socket disconnected:", socket.id, "Reason:", reason);
  });
  socket.on("statusChanged", (msg) => {
    console.log(msg);
    socket.emit("statusAccepted", `Status Change Requtest of job is Accepted`);
  });
});

const PORT = 4000;
httpServer.listen(PORT, () => {
  console.log(`Listening To Server on Port ${PORT}`);
});
