import React from "react";
import shortLogo from "../images/short_logo.png";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <span className="footer-contact">Contact</span>
        <div className="footer-brand">
          <img src={shortLogo} alt="short logo" />
          <p>Copyright 2026 Youngster. All rights reserved.</p>
        </div>
        <div className="footer-spacer" />
      </div>
    </footer>
  );
}
