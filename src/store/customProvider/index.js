"use client";
import useAxios from "@/interceptor/axios-functions";
import Aos from "aos";
import { useEffect } from "react";
import { Provider, useDispatch, useSelector } from "react-redux";
import { PersistGate } from "redux-persist/lib/integration/react";
import store, { persistor } from "..";
import { signOutRequest, updateUser } from "../auth/authSlice";
import { setCount } from "../new_notification/newNotification";
import { usePathname } from "next/navigation";

export function CustomProvider({ children }) {
  useEffect(() => {
    Aos.init();
  }, []);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ApisProvider>{children}</ApisProvider>
      </PersistGate>
    </Provider>
  );
}

export default function ApisProvider({ children }) {
  const accessToken = useSelector((state) => state.authReducer.accessToken);
  const dispatch = useDispatch();
  const { Get } = useAxios();
  const pathname = usePathname();

  const getUserDetails = async () => {
    const [{ response: userResponse }] = await Promise?.all([
      Get({ route: "users/me" }),
    ]);
    if (userResponse) {
      dispatch(updateUser(userResponse?.data));
    }
  };

  useEffect(() => {
    if (accessToken) {
      getUserDetails();
    }
  }, [accessToken]);

  useEffect(() => {
    if (!accessToken) {
      dispatch(signOutRequest());
    } else {
      // getCommonData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchNotificationCount = async () => {
    const { response } = await Get({
      route: "notifications?seen=false",
      showAlert: false,
    });

    if (response) {
      const notifications =
        response?.notifications || response?.data?.notifications || [];
      dispatch(setCount(notifications.length));
    }
  };
  // Fetch notification count whenever the path changes
  useEffect(() => {
 

    fetchNotificationCount();
  }, [pathname, dispatch]);

  return children;
}
