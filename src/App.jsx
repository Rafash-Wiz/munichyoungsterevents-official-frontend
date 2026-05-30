import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router";
import { useDispatch } from "react-redux";
import Home from "./pages/Home";
import User from "./pages/User.jsx";

import { apiRequest } from "./lib/api";
import { clearUser, setAuthLoading, setUser } from "./store/authSlice";
import ProtectedRoute from "./routes/ProtectedRoute.jsx";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const loadCurrentUser = async () => {
      try {
        const data = await apiRequest("/api/auth/me");
        dispatch(setUser(data));
      } catch {
        dispatch(clearUser());
      } finally {
        dispatch(setAuthLoading(false));
      }
    };

    loadCurrentUser();
  }, [dispatch]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/user/:id" element={<User />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
