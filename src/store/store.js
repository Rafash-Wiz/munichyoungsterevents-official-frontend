import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import eventsReducer from "./eventsSlice";
import bookingsReducer from "./bookingsSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    events: eventsReducer,
    bookings: bookingsReducer,
  },
});