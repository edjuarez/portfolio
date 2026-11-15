
import "./ProjectCard.css";
import {
  FiPlay,
  FiCode,
  FiMonitor,
  FiLayers,
  FiGithub,
  FiGlobe,
} from "react-icons/fi";
import { useEffect, useRef, useState } from "react";

export const ProjectCard = ({ project, expanded, onToggle }) => {
  const cardRef = useRef(null);
  const [isPreviewing, setIsPreviewing] = useState(false);
  const previewRef = useRef(null);

  const handlePreviewStart = async () => {
    if (!project.previewVideo) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const video = previewRef.current;
    if (!video) return;

    setIsPreviewing(true);
    video.currentTime = 0;

    try {
      await video.play();
    } catch {
      setIsPreviewing(false);
    }
  };

  const handlePreviewEnd = () => {
    const video = previewRef.current;

    if (video) {
      video.pause();
      video.currentTime = 0;
    }

    setIsPreviewing(false);
  };

  useEffect(() => {
    if (!expanded || !cardRef.current) return;

    const timeoutId = setTimeout(() => {
      cardRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 120);

    return () => clearTimeout(timeoutId);
  }, [expanded]);

  const renderTechIcon = (tech) => {
    switch (tech.toLowerCase()) {
      case "react":
        return <FiCode />;
      case "vite":
        return <FiMonitor />;
      case "css":
        return <FiLayers />;
      default:
        return <FiCode />;
    }
  };

  const badgeClass = {
    "Technical Demonstration": "project-badge--technical",
    "Client Project": "project-badge--client",
    "Personal Business": "project-badge--business",
    "Academic Project": "project-badge--academic",
    "Academic Project · Real Client": "project-badge--client"
  }[project.projectType] || "";

  return (
    <article
      ref={cardRef}
      className={`project-card ${isPreviewing ? "is-previewing" : ""}`}
      data-shootable
      onMouseEnter={handlePreviewStart}
      onMouseLeave={handlePreviewEnd}
    >
      <div className="project-image-wrapper">
        <img
          src={project.image}
          alt={project.title}
          className="project-image"
          loading="lazy"
          draggable={false}
        />

        {project.previewVideo && (
          <video
            ref={previewRef}
            className="project-preview-video"
            muted
            loop
            playsInline
            preload="none"
            aria-hidden="true"
          >
            <source src={project.previewVideo} type="video/mp4" />
          </video>
        )}

        {project.projectType && (
          <span className={`project-badge ${badgeClass}`}>
            {project.projectType}
          </span>
        )}
      </div>

      <div className="project-content">
          <div className="project-title">
            <h3>{project.title}</h3>
          </div>

        <p className="project-description">
          {project.description}
        </p>

        <div className="project-tech">
          {project.technologies.map((tech) => (
            <span key={tech}>
              {renderTechIcon(tech)}
              {tech}
            </span>
          ))}
        </div>

        <div className="project-actions">
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="project-btn secondary"
            >
              <FiGithub />
              GitHub
            </a>
          )}

          {project.playable && (
            <a
              href={project.gameUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="project-btn primary"
            >
              <FiPlay />
              Play
            </a>
          )}

          {(project.longDescription || project.playable) && (
            <button
              type="button"
              className="project-btn secondary"
              onClick={onToggle}
              aria-expanded={expanded}
            >
              {expanded ? "Show less" : "Details"}
            </button>
          )}

          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="project-btn primary"
            >
              <FiGlobe />
              Live
            </a>
          )}

        </div>

        <div className={`expanded-wrapper ${expanded ? "is-expanded" : ""}`}>
          <div className="expanded-inner">
            <div className="expanded-content">
              {project.longDescription && (
                <p className="expanded-description">
                  {project.longDescription}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};

export default ProjectCard;
