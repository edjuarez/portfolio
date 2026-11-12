
import "./About.css";
import { useEffect } from "react";

import {
  FaReact,
  FaAngular,
  FaHtml5,
  FaCss3Alt,
  FaGitAlt,
  FaJsSquare,
  FaRobot,
  FaNodeJs,
} from "react-icons/fa";

import {
  SiRoku,
  SiTypescript,
  SiNextdotjs,
  SiVite,
  SiTailwindcss,
  SiSupabase,
  SiPostgresql,
  SiStripe,
  SiCloudflare,
} from "react-icons/si";

const skills = [
  { name: "JavaScript", icon: <FaJsSquare />, color: "javascript" },
  { name: "TypeScript", icon: <SiTypescript />, color: "typescript" },
  { name: "React", icon: <FaReact />, color: "react" },
  { name: "Next.js", icon: <SiNextdotjs />, color: "nextjs" },
  { name: "Angular", icon: <FaAngular />, color: "angular" },
  { name: "Vite", icon: <SiVite />, color: "vite" },
  { name: "HTML5", icon: <FaHtml5 />, color: "html" },
  { name: "CSS3", icon: <FaCss3Alt />, color: "css" },
  { name: "Tailwind", icon: <SiTailwindcss />, color: "tailwind" },
  { name: "Node.js", icon: <FaNodeJs />, color: "node" },
  { name: "Supabase", icon: <SiSupabase />, color: "supabase" },
  { name: "PostgreSQL", icon: <SiPostgresql />, color: "postgres" },
  { name: "Stripe", icon: <SiStripe />, color: "stripe" },
  { name: "Cloudflare", icon: <SiCloudflare />, color: "cloudflare" },
  { name: "Git", icon: <FaGitAlt />, color: "git" },
  { name: "BrightScript", icon: <SiRoku />, color: "roku" },
  { name: "AI Tools", icon: <FaRobot />, color: "ai" },
];

export const About = () => {
useEffect(() => {
  const container = document.querySelector(".about-skills-grid");
  const items = container?.querySelectorAll(".skill-item");

  if (!container || !items?.length) return;

  const handlePointerMove = (event) => {
    items.forEach((item) => {
      const rect = item.getBoundingClientRect();

      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const dx = centerX - event.clientX;
      const dy = centerY - event.clientY;

      const distance = Math.sqrt(dx * dx + dy * dy);
      const radius = 130;

      if (distance < radius) {
        const force = (1 - distance / radius) * 18;

        const moveX = (dx / distance) * force;
        const moveY = (dy / distance) * force;

        item.style.setProperty("--move-x", `${moveX}px`);
        item.style.setProperty("--move-y", `${moveY}px`);
      } else {
        item.style.setProperty("--move-x", "0px");
        item.style.setProperty("--move-y", "0px");
      }
    });
  };

  const handlePointerLeave = () => {
    items.forEach((item) => {
      item.style.setProperty("--move-x", "0px");
      item.style.setProperty("--move-y", "0px");
    });
  };

  window.addEventListener("pointermove", handlePointerMove);
  window.addEventListener("blur", handlePointerLeave);

  return () => {
    window.removeEventListener("pointermove", handlePointerMove);
    window.removeEventListener("blur", handlePointerLeave);
    handlePointerLeave();
  };
}, []);
  return (
    <section id="about" className="about section-container">
      <div className="about-container">

        <div className="about-left">
          <h2 className="section-heading">
            <span className="shootable-text" data-shootable>About Me</span>
          </h2>

          <div className="about-divider" />

          <p className="about-description" data-shootable>
            Hi, I’m Eduardo! I'm a software developer focused on Frontend and Full Stack Development. I studied video game
            development and interactive media, which gave me experience
            in programming, design, and creative problem-solving.

            <br /><br />
            After graduating, I joined Globant, where I spent over 11 years working as a Frontend Developer on web and TV applications, contributing to large-scale projects for international clients.
            <br /><br />

            Today, I’m expanding my focus on modern web development through freelance work and my own business, <a
              href="https://tuchidigital.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Tuchi Digital
            </a>, where I build custom digital solutions for real clients, including websites, advanced landing pages, and e-commerce platforms using technologies like React, TypeScript, and Angular. I’m involved in the entire process, from initial concepts to deployment, while continuously exploring new technologies and AI-powered tools such as ChatGPT, Claude, and AI coding agents to improve my workflow, solve problems, and bring new ideas to life.

            <br /><br />

          </p>
        </div>

        <div className="about-right">
          <div className="about-image-card">
            <img
              src="./profile.webp"
              alt="Eduardo"
              loading="lazy"
              data-shootable
              draggable={false}
            />
            <div className="about-glow" />
          </div>

          <div className="about-skills">
            <p className="about-skills-title">
              TECHNOLOGIES & TOOLS
            </p>

            <div className="about-skills-grid" data-shootable>
              {skills.map((skill, index) => (
                <span
                  key={skill.name}
                  className={`skill-item skill-${skill.color}`}
                  style={{ "--skill-index": index }}
                >
                  {skill.icon}
                  {skill.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
