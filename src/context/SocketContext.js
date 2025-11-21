"use client";

import config from "@/config";
import { getUniqueBrowserId } from "@/resources/utils/helper";
import { createContext, useContext, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { io } from "socket.io-client";

// Create a new context for the socket connection
const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const socket = useRef(null);
  const dispatch = useDispatch();

  const { accessToken, user } = useSelector((state) => state?.authReducer);

  useEffect(() => {
    if (accessToken) {
      const initSocket = async () => {
        socket.current = io(config?.apiBaseUrl, { transports: ["websocket"] });

        // get socket id
        socket.current.on("connect", () => {
          console.log("Active Socket Data 🤷‍♂️🤷‍♂️🤷‍♂️", {
            socketId: socket.current.id,
            device: getUniqueBrowserId(),
            id: user?._id,
          });
        });

        // **************** Establish connection with socket Start ****************
        socket.current.emit("join", {
          id: user?._id,
          device: getUniqueBrowserId(),
        });
        // **************** Establish connection with socket End ****************

        // **************** Notification DEMO Start ****************
        // socket.current.on("user-blocked", (data) => {
        //   RenderToast("Your account has been blocked", "info");
        //   dispatch(signOutRequest());
        // });

        // **************** NOTIFICATION DEMO End ****************
      };
      initSocket();
      return () => {
        if (socket.current) {
          socket.current.disconnect();
        }
      };
    }
  }, [accessToken, dispatch, user?._id]);

  // Provide the socket connection to children
  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

// Custom hook to access the socket connection
export const useSocket = () => {
  return useContext(SocketContext);
};
