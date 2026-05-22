import React from "react";
import { Link } from "react-router";
import logo from "../images/logo.png";
import login from "../images/login.png";

import { useAuth } from "../auth/useAuth";

export default function Header({ onAuthClick, onProfileClick }) {
  const { user, isAuthLoading } = useAuth();
  return (
    <header className="header">
      <div className="header-content">
        <div className="logo-section">
          <Link to="/">
            <img src={logo} alt="logo" />
          </Link>
        </div>
        <div className="header-actions">
          {user && (
            <button
              type="button"
              className="header-login"
              onClick={onProfileClick}
            >
              <img src={login} alt="profile" />
            </button>
          )}
          <button
            type="button"
            className="header-auth-button"
            onClick={onAuthClick}
          >
            <span>
              {isAuthLoading ? "Loading..." : user ? "Log Out" : "Login"}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
