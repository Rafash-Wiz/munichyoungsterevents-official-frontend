# Youngster Frontend

Frontend for the Munich Youngster Events platform, centered around event discovery and booking management.

This app lets users:
- browse public events
- register and log in
- book and cancel event bookings
- view attendee dashboard data
- manage events and bookings from the admin dashboard

## Features

- Public event browsing with separate views for open, coming soon, cancelled, and closed event states
- Authentication flow with register, login, logout, and protected routes
- Core booking flow with event selection, booking creation, and booking cancellation
- Attendee dashboard with paginated personal bookings and booking status tracking
- Admin dashboard for managing events, attendees, and bookings
- Event lifecycle actions including open, close, and cancel
- Centralized API layer with Axios and shared request/error handling
- Shared domain state managed with Redux Toolkit for auth, events, and bookings

## Tech Stack

- React
- Vite
- React Router
- Redux Toolkit
- React Redux
- Axios
- ESLint

## State Management

Shared domain state is managed with Redux Toolkit.

Current Redux slices:
- `auth`
- `events`
- `bookings`

Local component state is still used for view-specific UI state such as:
- popup open/close
- local filters
- temporary form input
- menu visibility

## API Layer

The app uses Axios through a shared client in:

- [src/lib/axios.js](src/lib/axios.js)

Requests are normalized through:

- [src/lib/api.js](src/lib/api.js)

Current API setup includes:
- shared `baseURL`
- `withCredentials: true`
- timeout handling
- request/response interceptors for development logging
- normalized error handling

## Scripts

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Run linting:

```bash
npm run lint
```

Preview the production build:

```bash
npm run preview
```

## Environment

The app reads the backend base URL from:

- `VITE_API_BASE_URL`

Example:

```env
VITE_API_BASE_URL=http://localhost:8080
```

## Project Notes

- Auth is fully Redux-based.
- Events and bookings have been partially migrated to Redux where shared domain state made sense.
- UI-only state is intentionally kept local instead of forcing everything into Redux.
