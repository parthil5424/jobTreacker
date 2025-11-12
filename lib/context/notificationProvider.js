"use client";
import { useAuthStore } from "@/Store/useAuthStore";
import { Children, createContext, useEffect, useState } from "react";
export const NotificationContext = createContext(null);

const NotificationContextProvider = ({ children }) => {
  const [allNotifications, setAllNotifications] = useState(null);
  const { user } = useAuthStore();

  const addNotification = async (data) => {
    try {
      const res = fetch("/api/Notification", {
        method: "POST",
        data: JSON.stringify(data),
      });
      if (res.status === 200) {
        const data = res.JSON();
        console.log("Data", data.data.meessage);
      }
    } catch (err) {
      console.error("Error", err);
    }
  };
  const fetchNotifications = async () => {
    try {
      const res = await fetch(`/api/Notification/${user?.id}`);
      if (res.status === 200) {
        const data = await res.json();
        setAllNotifications(data.data);
      }
    } catch (err) {
      console.error("Errror", err);
    }
  };

  const deleteNotifications = async (notificationIds) => {
    try {
      const res = await fetch(`/api/Notification/`, {
        method: "DELETE",
        id: notificationIds,
      });
      if (res.status === 200) {
        fetchNotifications();
      }
    } catch (err) {
      console.log("Something Went Wrong", err);
    }
  };

  const readNotification = async (id) => {
    try {
      const res = await fetch(`/api/Notofication/${id}`, {
        method: "PUT",
      });
      if (res.status === 200) {
        fetchNotifications();
      }
    } catch (err) {
      console.log("Something Went Wrong", err);
    }
  };
  useEffect(() => {
    try {
      if (user) {
        fetchNotifications();
      }
    } catch (err) {}
  }, [user]);

  const value = {
    fetchNotifications,
    allNotifications,
    deleteNotifications,
    readNotification,
    addNotification,
  };

  return <NotificationContext value={value}>{children}</NotificationContext>;
};

export default NotificationContextProvider;
