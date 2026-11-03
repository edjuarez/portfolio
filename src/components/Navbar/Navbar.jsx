
import "./Navbar.css";
import { useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";

export const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="navbar">
      <nav
        className={`navbar-links ${menuOpen ? "active" : ""}`}
        id="main-navigation"
      >
        <a href="#home" onClick={closeMenu}>
          Home
        </a>

        <a href="#about" onClick={closeMenu}>
          About Me
        </a>

        <a href="#work" onClick={closeMenu}>
          My Work
        </a>

        <a href="#contact" onClick={closeMenu}>
          Contact
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
