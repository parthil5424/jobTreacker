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

const userSockets = new Map();

io.on("connection", (socket) => {
  socket.on("disconnect", (reason) => {
    console.log("Socket disconnected:", socket.id, "Reason:", reason);
    if (userSockets) {
      for (const [userId, ids] of userSockets.entries()) {
        console.log("ids", ids);
        if (ids.has(socket.id)) {
          ids.delete(socket.id);
          if (ids.size == 0) {
            userSockets.delete(userId);
          }
        }
      }
    }
  });

  socket.on("identify", (userId) => {
    if (userId) {
      if (!userSockets.has(userId)) {
        userSockets.set(userId, new Set());
      }
      userSockets.get(userId).add(socket.id);
    }
  });

  socket.on("statusChanged", ({ id, status, userId }) => {
    if (userId) {
      if (userSockets.has(userId)) {
        const tabId = userSockets.get(userId);
        console.log("TabId", tabId);
        tabId.forEach((id) => {
          io.to(id).emit(
            "ApplicationStatusChanged",
            "Your Application Status Has Been Changed"
          );
        });
      }
    }
  });
});

const PORT = 4000;
httpServer.listen(PORT, () => {
  console.log(`Listening To Server on Port ${PORT}`);
});
