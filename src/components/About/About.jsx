
import "./About.css";

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
  return (
    <section id="about" className="about">
      <div className="about-container">

        <div className="about-left">
          <h2 className="section-heading">
            About Me
          </h2>

          <div className="about-divider" />

          <p className="about-description">
            Hi, I’m Eduardo — a Web, Roku and Game Developer from
            Argentina currently living in Spain. I studied video game
            development and interactive media, which gave me experience
            in programming, design, and creative problem-solving.

            <br /><br />

            After graduating, I joined Globant, where I worked for more
            than 10 years as both a Web Developer and Roku Developer,
            contributing to large-scale streaming and web applications
            for international clients.

            <br /><br />

            Today, I’m expanding my focus on modern web development,
            building applications and digital solutions for real clients
            as a freelance developer. I work with technologies such as
            React, TypeScript, and Angular, developing websites, advanced
            landing pages, and e-commerce platforms from initial concepts
            to deployment.

            <br /><br />

            I also founded{" "}
            <a
              href="https://tuchidigital.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Tuchi Digital
            </a>
            , my own web development business, where I create digital
            products and deliver custom web solutions for clients.
            Alongside this work, I continuously explore new technologies
            and AI-powered development tools, including ChatGPT, Claude,
            and AI coding agents, to improve my workflow, build better
            software, and keep growing as a developer.
          </p>
        </div>

        <div className="about-right">
          <div className="about-image-card">
            <img
              src="./profile.webp"
              alt="Eduardo"
              loading="lazy"
            />
            <div className="about-glow" />
          </div>

          <div className="about-skills">
            <p className="about-skills-title">
              TECHNOLOGIES & TOOLS
            </p>

            <div className="about-skills-grid">
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
