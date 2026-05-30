import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  eventsList: [],
  isLoadingEvents: false,
  eventsError: "",
  adminEvents: [],
  isLoadingAdminEvents: false,
  adminEventsError: "",
  adminEventsTotalPages: 1,
};

const eventsSlice = createSlice({
  name: "events",
  initialState,
  reducers: {
    setEvents(state, action) {
      state.eventsList = action.payload;
    },
    setEventsLoading(state, action) {
      state.isLoadingEvents = action.payload;
    },
    setEventsError(state, action) {
      state.eventsError = action.payload;
    },
    clearEventsError(state) {
      state.eventsError = "";
    },
    setAdminEvents(state, action) {
      state.adminEvents = action.payload;
    },
    setAdminEventsLoading(state, action) {
      state.isLoadingAdminEvents = action.payload;
    },
    setAdminEventsError(state, action) {
      state.adminEventsError = action.payload;
    },
    setAdminEventsTotalPages(state, action) {
      state.adminEventsTotalPages = action.payload;
    },
  },
});

export const {
  setEvents,
  setEventsLoading,
  setEventsError,
  clearEventsError,
  setAdminEvents,
  setAdminEventsLoading,
  setAdminEventsError,
  setAdminEventsTotalPages,
} = eventsSlice.actions;

export default eventsSlice.reducer;
