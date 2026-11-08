
import "./Navbar.css";
import { useState } from "react";
import {
  FiMenu,
  FiX,
  FiHome,
  FiUser,
  FiBriefcase,
  FiMail,
} from "react-icons/fi";

export const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="navbar">
      <nav
        className={`navbar-links ${menuOpen ? "active" : ""}`}
        id="main-navigation"
      >
        <a className="navbar-item" href="#home" onClick={closeMenu}>
          <FiHome className="navbar-item-icon" />
          Home
        </a>

        <a className="navbar-item" href="#about" onClick={closeMenu}>
          <FiUser className="navbar-item-icon" />
          <span>About Me</span>
        </a>

        <a className="navbar-item" href="#work" onClick={closeMenu}>
          <FiBriefcase className="navbar-item-icon" />
          <span>My Work</span>
        </a>

        <a className="navbar-item" href="#contact" onClick={closeMenu}>
          <FiMail className="navbar-item-icon" />
          <span>Contact</span>
        </a>
      </nav>

      <button
        type="button"
        className="menu-toggle"
        onClick={() => setMenuOpen((current) => !current)}
        aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
        aria-expanded={menuOpen}
        aria-controls="main-navigation"
      >
        {menuOpen ? <FiX /> : <FiMenu />}
      </button>
    </header>
  );
};
