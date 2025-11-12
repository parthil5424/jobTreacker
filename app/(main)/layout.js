"use client";
import Navbar from "@/Components/Navbar";
import NotificationContextProvider from "@/lib/context/notificationProvider";
import SocketProvider from "@/lib/context/socketProvider";

export default function MainLayout({ children }) {
  return (
    <div>
      <NotificationContextProvider>
        <SocketProvider>
          <Navbar />
          {children}
        </SocketProvider>
      </NotificationContextProvider>
    </div>
  );
}
