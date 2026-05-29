import React, { useState } from "react";
import { useNavigate } from "react-router";
import RegisteredPopUp from "./RegisteredPopUp";

import { apiRequest } from "../lib/api";
import { useAuth } from "../auth/useAuth";

export default function AuthPopup({
  isAuthOpen,
  authMode,
  setIsAuthOpen,
  setAuthMode,
}) {
  const [didAttemptRegister, setDidAttemptRegister] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [confirmRegisterEmail, setConfirmRegisterEmail] = useState("");
  const [registerName, setRegisterName] = useState("");
  const [registerLastName, setRegisterLastName] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [showRegisteredPopup, setShowRegisteredPopup] = useState(false);

  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { setUser } = useAuth();

  const navigate = useNavigate();

  function resetRegisterForm() {
    setRegisterEmail("");
    setConfirmRegisterEmail("");
    setRegisterName("");
    setRegisterLastName("");
    setRegisterPassword("");
    setDidAttemptRegister(false);
  }

  function resetLoginForm() {
    setLoginEmail("");
    setLoginPassword("");
  }

  const emailsDoNotMatch =
    didAttemptRegister && registerEmail !== confirmRegisterEmail;

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setDidAttemptRegister(true);
    setSubmitError("");

    if (registerEmail !== confirmRegisterEmail) {
      return;
    }

    const payload = {
      firstName: registerName,
      lastName: registerLastName,
      email: registerEmail,
      password: registerPassword,
    };

    try {
      setIsSubmitting(true);

      await apiRequest("/api/auth/register", {
        method: "POST",
        data: payload,
      });

      setShowRegisteredPopup(true);
      resetRegisterForm();
      setAuthMode("login");
    } catch (error) {
      setSubmitError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");

    const payload = {
      email: loginEmail,
      password: loginPassword,
    };

    try {
      setIsSubmitting(true);

      const data = await apiRequest("/api/auth/login", {
        method: "POST",
        data: payload,
      });

      setUser({
        userId: data.userId,
        email: data.email,
        role: data.role,
        firstName: data.firstName,
        lastName: data.lastName,
      });

      setIsAuthOpen(false);
      setAuthMode("login");
      resetLoginForm();
      navigate(`/user/${data.userId}`);
    } catch (error) {
      setSubmitError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    isAuthOpen && (
      <div className="modal-overlay">
        <div className="auth-popup">
          <button
            type="button"
            className="auth-popup-close"
            onClick={() => {
              setIsAuthOpen(false);
              setAuthMode("login");
              resetRegisterForm();
              resetLoginForm();
              setSubmitError("");
            }}
          >
            X
          </button>
          {showRegisteredPopup && (
            <RegisteredPopUp onClose={() => setShowRegisteredPopup(false)} />
          )}
          <button
            type="button"
            className="auth-popup-tab"
            onClick={() => {
              setAuthMode("login");
              resetRegisterForm();
              resetLoginForm();
              setSubmitError("");
            }}
          >
            login
          </button>
          <button
            type="button"
            className="auth-popup-tab"
            onClick={() => {
              setAuthMode("register");
              resetRegisterForm();
              resetLoginForm();
              setSubmitError("");
            }}
          >
            register
          </button>

          {authMode === "login" && (
            <form className="login-popup-form" onSubmit={handleLoginSubmit}>
              <input
                type="text"
                placeholder="Log-in email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                disabled={isSubmitting}
              />
              <input
                type="password"
                placeholder="Password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                disabled={isSubmitting}
              />
              {submitError && <p className="auth-popup-error">{submitError}</p>}
              <button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Signing In..." : "Login"}
              </button>
            </form>
          )}

          {authMode === "register" && (
            <form
              className="register-popup-form"
              onSubmit={handleRegisterSubmit}
            >
              <input
                type="text"
                placeholder="Name"
                value={registerName}
                onChange={(e) => setRegisterName(e.target.value)}
                disabled={isSubmitting}
              />
              <input
                type="text"
                placeholder="Last Name"
                value={registerLastName}
                onChange={(e) => setRegisterLastName(e.target.value)}
                disabled={isSubmitting}
              />
              <input
                type="text"
                placeholder="Email"
                value={registerEmail}
                onChange={(e) => setRegisterEmail(e.target.value)}
                disabled={isSubmitting}
              />
              <input
                type="text"
                placeholder="Confirm Email"
                value={confirmRegisterEmail}
                onChange={(e) => setConfirmRegisterEmail(e.target.value)}
                disabled={isSubmitting}
              />
              {emailsDoNotMatch && (
                <p className="auth-popup-error">
                  Emails do not match. Please fix the email and make sure it is
                  correct.
                </p>
              )}
              <input
                type="password"
                placeholder="Password"
                value={registerPassword}
                onChange={(e) => setRegisterPassword(e.target.value)}
                disabled={isSubmitting}
              />
              {submitError && <p className="auth-popup-error">{submitError}</p>}
              <button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Register"}
              </button>
            </form>
          )}
        </div>
      </div>
    )
  );
}
