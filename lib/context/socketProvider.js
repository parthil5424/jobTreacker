"use client";
import { createContext } from "react";
import socket from "../socket";

export const SocketContext = createContext(null);
const SocketProvider = ({ children }) => {
  return <SocketContext value={socket}>{children}</SocketContext>;
};

export default SocketProvider;
