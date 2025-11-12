"use client";
import { useAuthStore } from "@/Store/useAuthStore";
import { createContext, useEffect } from "react";
import socket from "../socket";

export const SocketContext = createContext(null);

const SocketProvider = ({ children }) => {
  const { user } = useAuthStore();

  useEffect(() => {
    const onConnect = () => {
      if (user?.id) {
        socket.emit("identify", user.id);
      }
    };

    const handleDisconnect = () => {
      console.log("Socket Disconnected");
    };

    socket.on("connect", onConnect);
    socket.on("disconnect", handleDisconnect);

    if (socket.connected) {
      console.log("Already connected → calling onConnect manually");
      onConnect();
    }

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", () => {
        console.log("Socket Disconnected");
      });
    };
  }, [user?.id]);
  return <SocketContext value={socket}>{children}</SocketContext>;
};

export default SocketProvider;
