import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "./auth/authSlice";
import commonReducer from "./common/commonSlice";
import newNotificationReducer from "./new_notification/newNotification";

const rootReducer = combineReducers({
  authReducer,
  commonReducer,
  newNotificationReducer,
});

export default rootReducer;
