import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  count: 0,
};

const newNotificationSlice = createSlice({
  name: "newNotification",
  initialState,
  reducers: {
    incrementCount: (state) => {
      state.count += 1;
    },
    decrementCount: (state) => {
      state.count = Math.max(0, state.count - 1);
    },
    resetCount: (state) => {
      state.count = 0;
    },
    setCount: (state, action) => {
      state.count = action.payload;
    },
  },
});

export const { incrementCount, decrementCount, resetCount, setCount } =
  newNotificationSlice.actions;

export default newNotificationSlice.reducer;

