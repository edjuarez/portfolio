
import "./Hero.css";
import { Terminal } from "../Terminal/Terminal.jsx";
import { FaLinkedin, FaGithub } from "react-icons/fa6";
import { TbFileCvFilled } from "react-icons/tb";
import { ScrollIndicator } from "../ui/ScrollIndicator/ScrollIndicator";

export const Hero = () => {
  return (
    <section id="home" className="hero">

      <div className="hero-background" />

      {/* LEFT SIDE */}
      <div className="hero-left">

        <span
          className="glitchdist-text righteous-regular"
          data-text="Eduardo Juárez"
          data-shootable
        >
          <span>Eduardo Juárez</span>
        </span>

        <p className="hero-role">
          <span className="shootable-text" data-shootable>Software Developer</span>
        </p>

        <div className="about-divider" />

{/*         <p className="hero-description" data-shootable>
          I build websites, applications and interactive experiences
          with a focus on quality and user experience.
        </p> */}

        <div className="hero-buttons">
          <a
            href="https://github.com/edjuarez"
            target="_blank"
            rel="noopener noreferrer"
            className="hero-btn"
            aria-label="GitHub"
            data-shootable
          >
            <FaGithub />
          </a>

          <a
            href="https://linkedin.com/in/eduardo-juarez-dev"
            target="_blank"
            rel="noopener noreferrer"
            className="hero-btn"
            aria-label="LinkedIn"
            data-shootable
          >
            <FaLinkedin />
          </a>

          <a
            href="https://drive.google.com/file/d/1QKkHJtvRt4P9YBzCBnJQ-xwF4UnpBjMJ/view?usp=sharing"
            target="_blank"
            rel="noopener noreferrer"
            className="hero-btn"
            aria-label="Download CV"
            data-shootable
          >
            <TbFileCvFilled size="30" />
          </a>

        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="hero-right">

        <Terminal />

        <div className="hero-image-wrapper">
          <img
            src="./hero-image.webp"
            alt="Eduardo"
            className="hero-image"

            data-shootable
          />
        </div>

      </div>
    <ScrollIndicator />
    </section>
  );
};
