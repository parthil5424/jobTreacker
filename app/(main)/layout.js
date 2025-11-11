"use client";
import Navbar from "@/Components/Navbar";
import SocketProvider from "@/lib/context/socketProvider";

export default function MainLayout({ children }) {
  return (
    <div>
      <SocketProvider>
        <Navbar />
        {children}
      </SocketProvider>
    </div>
  );
}
