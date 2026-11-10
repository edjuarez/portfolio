
import "./MyWork.css";
import { useState } from "react";
import ProjectCard from "../ProjectCard/ProjectCard.jsx";
import { projects } from "../../data/projects.js";

const sectionTitles = {
  WEB: "Web Projects:",
  GAME: "Game Projects:",
};

export const MyWork = () => {
  const [expandedId, setExpandedId] = useState(null);

  const handleToggle = (id) => {
    setExpandedId((current) => (current === id ? null : id));
  };

  return (
    <section id="work" className="my-work section-container">
      <span className="about-label general-label">
        Portfolio
      </span>

      <h2 className="section-heading">
        Selected Projects
      </h2>
      <div className="about-divider" />
      <p className="about-description general-description">
        A collection of projects showcasing my work, from real-world client applications and technical assessments to academic projects and personal experiments. Explore live demos, code repositories, and documentation to get a closer look at the development process and the work behind each project.
      </p>

      {Object.entries(projects).map(([category, items]) => (
        <div key={category} className="project-category-section">
          <h3 className="section-title">
            {sectionTitles[category] || category}
          </h3>

          {category === "GAME" && (
            <p className="about-description general-description">
              All games are playable directly in your browser, with no
              downloads or installations required. Take a break, have
              some fun, and enjoy these fun mini games!
            </p>
          )}

          <div className="projects-grid">
            {items.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                expanded={expandedId === project.id}
                onToggle={() => handleToggle(project.id)}
              />
            ))}
          </div>
        </div>
      ))}
    </section>
  );
};
