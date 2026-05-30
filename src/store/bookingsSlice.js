import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  myBookings: [],
  isLoadingBookings: false,
  bookingsError: "",
  adminBookings: [],
  isLoadingAdminBookings: false,
  adminBookingsError: "",
  adminBookingsTotalPages: 1,
};

const bookingsSlice = createSlice({
  name: "bookings",
  initialState,
  reducers: {
    setMyBookings(state, action) {
      state.myBookings = action.payload;
    },
    setBookingsLoading(state, action) {
      state.isLoadingBookings = action.payload;
    },
    setBookingsError(state, action) {
      state.bookingsError = action.payload;
    },
    clearBookingsError(state) {
      state.bookingsError = "";
    },
    setAdminBookings(state, action) {
      state.adminBookings = action.payload;
    },
    setAdminBookingsLoading(state, action) {
      state.isLoadingAdminBookings = action.payload;
    },
    setAdminBookingsError(state, action) {
      state.adminBookingsError = action.payload;
    },
    setAdminBookingsTotalPages(state, action) {
      state.adminBookingsTotalPages = action.payload;
    },
  },
});

export const {
  setMyBookings,
  setBookingsLoading,
  setBookingsError,
  clearBookingsError,
  setAdminBookings,
  setAdminBookingsLoading,
  setAdminBookingsError,
  setAdminBookingsTotalPages,
} = bookingsSlice.actions;

export default bookingsSlice.reducer;
