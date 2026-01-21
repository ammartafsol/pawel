

"use client";

import config from "@/config";
import { getUniqueBrowserId } from "@/resources/utils/helper";
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { io } from "socket.io-client";
import { incrementCount } from "@/store/new_notification/newNotification";

// Create a new context for the socket connection
const SocketContext = createContext();

export const SocketProvider = (props) => {
  const { children } = props;
  const socket = useRef(null);
  const [isConnected, setIsConnected] = useState(false);

  const dispatch = useDispatch();
  const { accessToken, user } = useSelector((state) => state?.authReducer);

  useEffect(() => {
    if (!accessToken) return;

    const initSocket = async () => {
      socket.current = io(config?.apiBaseUrl, {
        transports: ["websocket", "polling"],
        auth: { token: `${accessToken}` },
        reconnection: true,
        reconnectionAttempts: Infinity,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        randomizationFactor: 0.5,
      });

      // get socket id
      socket.current.on("connect", () => {
        console.log("Active Socket Data 🤷‍♂️🤷‍♂️🤷‍♂️", {
          socketId: socket.current.id,
          device: getUniqueBrowserId(),
          id: user?._id,
        });
        setIsConnected(true);
      });

      socket.current.on("disconnect", (reason) => {
        console.warn("⚠️ Disconnected:", reason);
      });

      socket.current.on("reconnect_attempt", (attempt) => {
        console.log(`🔄 Trying to reconnect... (attempt ${attempt})`);
      });

      socket.current.on("reconnect", (attempt) => {
        console.log("🔗 Reconnected successfully!", attempt);
      });

      socket.current.on("reconnect_failed", () => {
        console.error("❌ Could not reconnect");
      });

      // Handle new notification events
      socket.current.on("new-notification", (data) => {
        const hasWindow = globalThis.window !== undefined;
        const currentPath = hasWindow ? globalThis.window.location.pathname : "";
        const isOnNotificationPage = currentPath.includes("/notification");

        if (!isOnNotificationPage) {
          // Simply increment the count in the Redux slice
          dispatch(incrementCount());
        }
      });

      // **************** Establish connection with socket Start ****************
      socket.current.emit("join", {
        id: user?._id,
        device: getUniqueBrowserId(),
      });
      // **************** Establish connection with socket End ****************
    };

    initSocket();

    return () => {
      if (socket.current) {
        socket.current.disconnect();
      }
    };
  }, [accessToken, dispatch, user?._id]);

  const contextValue = useMemo(
    () => ({ socket, isConnected }),
    [socket, isConnected]
  );

  // Provide the socket connection to children
  return (
    <SocketContext.Provider value={contextValue}>
      {children}
    </SocketContext.Provider>
  );
};

// Custom hook to access the socket connection
export const useSocket = () => {
  return useContext(SocketContext);
};
