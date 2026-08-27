import React from "react";
import "./Footer.css";
import { assets } from "../assets/frontend_assets/assets";

const Footer = () => {
  // ===============================
  // Scroll to Section
  // ===============================
  const scrollToSection = (id) => {
    const section = document.getElementById(id);

    if (section) {
      section.scrollIntoView({
        behavior: "smooth",
      });
    }
  };

  return (
    <footer className="footer" id="footer">

      <div className="footer-content">

        {/* ===============================
            Footer Left
        =============================== */}
        <div className="footer-content-left">

          <img
            src={assets.logo}
            alt="Tomato"
          />

          <p>
            Tomato is your simple and convenient food
            ordering platform. Discover delicious food,
            add your favorite items to cart and place
            your order easily.
          </p>

          {/* Social Icons */}
          <div className="footer-social-icons">

            <img
              src={assets.facebook_icon}
              alt="Facebook"
              title="Facebook"
            />

            <img
              src={assets.twitter_icon}
              alt="Twitter"
              title="Twitter"
            />

            <img
              src={assets.linkedin_icon}
              alt="LinkedIn"
              title="LinkedIn"
            />

          </div>

        </div>

        {/* ===============================
            Company
        =============================== */}
        <div className="footer-content-center">

          <h2>Company</h2>

          <ul>
            <li onClick={() => scrollToSection("header")}>
              Home
            </li>

            <li onClick={() => scrollToSection("footer")}>
              About Us
            </li>

            <li onClick={() => scrollToSection("app-download")}>
              Delivery
            </li>

            <li>
              Privacy Policy
            </li>
          </ul>

        </div>

        {/* ===============================
            Contact
        =============================== */}
        <div className="footer-content-right">

          <h2>Get In Touch</h2>

          <ul>
            <li>
              <a
                href="tel:+919628105699"
                style={{
                  color: "inherit",
                  textDecoration: "none",
                }}
              >
                +91-9628105699
              </a>
            </li>

            <li>
              <a
                href="mailto:contact@tomato.com"
                style={{
                  color: "inherit",
                  textDecoration: "none",
                }}
              >
                contact@tomato.com
              </a>
            </li>
          </ul>

        </div>

      </div>

      {/* ===============================
          Divider
      =============================== */}
      <hr />

      {/* ===============================
          Copyright
      =============================== */}
      <p className="footer-copyright">
        Copyright © 2026 Tomato.com - All Rights Reserved.
      </p>

    </footer>
  );
};

export default Footer;