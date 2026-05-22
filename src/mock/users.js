export const attendeeUser = {
  id: 1,
  role: "attendee",
  email: "attendee@youngster.com",
  password: "attendee123",
  name: "Liam",
  lastName: "Carter",
  bookings: [
    {
      eventId: 1,
      eventTitle: "Neon Pulse Festival",
      bookingStatus: "confirmed",
    },
    {
      eventId: 2,
      eventTitle: "Blue Hour Live",
      bookingStatus: "pending",
    },
    {
      eventId: 3,
      eventTitle: "Afterdark Sessions",
      bookingStatus: "canceled",
    },
  ],
};

export const adminUser = {
  id: 2,
  role: "admin",
  email: "admin@youngster.com",
  password: "admin123",
  name: "Maya",
  lastName: "Reed",
};

export const attendeeUserTwo = {
  id: 3,
  role: "attendee",
  email: "sofia@youngster.com",
  password: "sofia123",
  name: "Sofia",
  lastName: "Bennett",
  bookings: [
    {
      eventId: 2,
      eventTitle: "Blue Hour Live",
      bookingStatus: "confirmed",
    },
    {
      eventId: 4,
      eventTitle: "Velvet Midnight",
      bookingStatus: "pending",
    },
    {
      eventId: 5,
      eventTitle: "Bassline District",
      bookingStatus: "confirmed",
    },
  ],
};

export const attendeeUserThree = {
  id: 4,
  role: "attendee",
  email: "noah@youngster.com",
  password: "noah123",
  name: "Noah",
  lastName: "Hayes",
  bookings: [
    {
      eventId: 1,
      eventTitle: "Neon Pulse Festival",
      bookingStatus: "pending",
    },
    {
      eventId: 3,
      eventTitle: "Afterdark Sessions",
      bookingStatus: "confirmed",
    },
    {
      eventId: 6,
      eventTitle: "City Lights Rave",
      bookingStatus: "canceled",
    },
  ],
};

export const users = [attendeeUser, adminUser, attendeeUserTwo, attendeeUserThree];
