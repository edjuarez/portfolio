
import "./Navbar.css";
import { useState } from "react";
import {
  FiMenu,
  FiX
} from "react-icons/fi";
import { IoBriefcaseSharp } from "react-icons/io5";
import { GrMail } from "react-icons/gr";
import { IoMdHome } from "react-icons/io";
import { ImUser } from "react-icons/im";
export const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="navbar" data-shootable>
      <nav
        className={`navbar-links ${menuOpen ? "active" : ""}`}
        id="main-navigation"
      >
        <a className="navbar-item" href="#home" onClick={closeMenu}>
          <IoMdHome className="navbar-item-icon" />
          Home
        </a>

        <a className="navbar-item" href="#about" onClick={closeMenu}>
          <ImUser className="navbar-item-icon" />
          <span>About</span>
        </a>

        <a className="navbar-item" href="#work" onClick={closeMenu}>
          <IoBriefcaseSharp className="navbar-item-icon" />
          <span>Projects</span>
        </a>

        <a className="navbar-item" href="#contact" onClick={closeMenu}>
          <GrMail className="navbar-item-icon" />
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
