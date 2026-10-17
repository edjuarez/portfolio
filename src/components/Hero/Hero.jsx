import "./Hero.css";
import { Terminal } from "../Terminal/Terminal.jsx";
import { FaLinkedin, FaGithub } from "react-icons/fa6";
import { TbFileCvFilled  } from "react-icons/tb";

export const Hero = () => {
  return (
    <>
      <section id="home" className="hero">

        {/* LEFT SIDE */}

        <div className="hero-left">

          {/* <h2 className="hero-title">
            <span>Eduardo</span> Juárez
          </h2> */}

		<span class="glitchdist-text" data-text="Eduardo Juárez">
			<span>Eduardo Juárez</span>
		</span>

          <p className="hero-role">
            Software Engineer
          </p>
    
          <div className="about-divider" />

          <p className="hero-description">
            I build websites, applications and interactive experiences with a focus on quality and user experience.
          </p>

          {/* ICONS */}

          {/* <div className="hero-socials">

            <a
              href="https://github.com/"
              target="_blank"
            >
              GitHub
            </a>

            <a
              href="https://linkedin.com/"
              target="_blank"
            >
              LinkedIn
            </a>
            <a
              href="https://linkedin.com/"
              target="_blank"
            >
              Contact
            </a>

          </div> */}
          <div className="hero-buttons">

            <a
              href="https://github.com/edjuarez"
              target="_blank"
              className="hero-btn primary"
            >
              <FaGithub />
            </a>

            <a
              href="https://linkedin.com/in/eduardo-juarez-dev"
              target="_blank"
              className="hero-btn secondary"
            >
              <FaLinkedin  />
            </a>

            <a
              href="https://drive.google.com/file/d/1GQbZQmxDAqeYrR3Va9r_9ah9M5y6dwjv/view?usp=sharing"
              target="_blank"
              className="hero-btn secondary"
            >
              <TbFileCvFilled  style={{fontSize: '1.7rem'}} />
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
        />

      </div>
        </div>

      </section>
    </>
  );
};