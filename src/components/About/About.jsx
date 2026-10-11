import "./About.css";

import {
  FaReact,
  FaAngular,
  FaHtml5,
  FaCss3Alt,
  FaGitAlt,
  FaJsSquare,
  FaRobot,
  FaNodeJs
} from "react-icons/fa";
import { SiRoku } from "react-icons/si";

import {
  SiTypescript
} from "react-icons/si";

export const About = () => {

  return (

    <section id="about" className="about">
      <div className="about-container">

        {/* LEFT SIDE */}
        <div className="about-left">

          <h2 className="about-title general-title">
            About Myself
          </h2>

          <div className="about-divider" />

          <p className="about-description">
          Hi, I’m Eduardo — a Web, Roku and Game Developer from Argentina currently living in Spain. I studied video game development and interactive media, which gave me experience in programming, design, and creative problem-solving.
          <br />
          <br />
          After graduating, I joined Globant, where I worked for more than 10 years as both a Web Developer and Roku Developer, contributing to large-scale streaming and web applications for international clients.
          <br />
          <br />
          Today, I’m expanding my focus on modern web development, building applications and digital solutions for real clients as a freelance developer. I work with technologies such as React, TypeScript, and Angular, developing websites, advanced landing pages, and e-commerce platforms from initial concepts to deployment.
          <br /><br />
          I also founded <a href="https://tuchidigital.com/" target="_blank" rel="noopener noreferrer">Tuchi Digital</a>, my own web development business, where I create digital products and deliver custom web solutions for clients. Alongside this work, I continuously explore new technologies and AI-powered development tools, including ChatGPT, Claude, and AI coding agents, to improve my workflow, build better software, and keep growing as a developer.
          </p>
        </div>

        {/* RIGHT SIDE */}

        <div className="about-right">
          <div className="about-image-card">

            <img
              src="./profile.webp"
              alt="Eduardo"
            />

            <div className="about-glow" />

          </div>
          <div className="about-skills">
            <p className="about-skills-title">
              PROFICIENT IN
            </p>
            <div className="about-skills-grid">
              <span><FaJsSquare />JavaScript</span>
              <span><SiTypescript />TypeScript</span>
              <span><FaReact />React</span>
              <span><FaAngular />Angular</span>
              <span><FaHtml5 />HTML5</span>
              <span><FaCss3Alt />CSS3</span>
              <span><FaGitAlt />Git</span>
              <span><FaRobot />AI</span>
              <span><FaNodeJs />Node.js</span>
              <span><SiRoku style={{ fontSize: "2rem" }} />Brightscript</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};