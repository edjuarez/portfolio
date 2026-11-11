
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import "./AlienHunt.css";


const ALIEN_COUNT = 10;

const createAliens = (pageHeight) => {
  const pageWidth = document.documentElement.clientWidth;

  const shootableRects = [
    ...document.querySelectorAll(
      "[data-shootable]:not([data-alien])"
    ),
  ].map((element) => {
    const rect = element.getBoundingClientRect();

    return {
      left: rect.left,
      right: rect.right,
      top: rect.top + window.scrollY,
      bottom: rect.bottom + window.scrollY,
    };
  });

  const aliens = [];

  const overlaps = (a, b, padding = 20) =>
    a.left < b.right + padding &&
    a.right > b.left - padding &&
    a.top < b.bottom + padding &&
    a.bottom > b.top - padding;

  for (let index = 0; index < ALIEN_COUNT; index += 1) {
    const size = 42 + Math.random() * 12;

    // Divide the page into 10 vertical zones.
    const zoneTop = (index / ALIEN_COUNT) * pageHeight;
    const zoneBottom = ((index + 1) / ALIEN_COUNT) * pageHeight;

    let position = null;

    // Try multiple random positions in this zone.
    for (let attempt = 0; attempt < 100; attempt += 1) {
      const x = size + Math.random() * (pageWidth - size * 2);
      const y =
        zoneTop + Math.random() * (zoneBottom - zoneTop);

      const candidate = {
        left: x - size / 2,
        right: x + size / 2,
        top: y - size / 2,
        bottom: y + size / 2,
      };

      const overlapsShootable = shootableRects.some((rect) =>
        overlaps(candidate, rect, 35)
      );

      const overlapsAlien = aliens.some((alien) =>
        overlaps(candidate, {
          left: alien.x - alien.size / 2,
          right: alien.x + alien.size / 2,
          top: alien.y - alien.size / 2,
          bottom: alien.y + alien.size / 2,
        }, 45)
      );

      if (!overlapsShootable && !overlapsAlien) {
        position = { x, y };
        break;
      }
    }

    // Skip the zone if there is no available space.
    if (!position) continue;

    aliens.push({
      id: index + 1,
      x: position.x,
      y: position.y,
      size,
      duration: 3 + Math.random() * 2,
      delay: Math.random() * -5,
      hit: false,
    });
  }

  return aliens;
};


export default function AlienHunt() {
  const [aliens, setAliens] = useState([]);
  const [pageHeight, setPageHeight] = useState(0);
  const [destroyedCount, setDestroyedCount] = useState(0);

  useEffect(() => {
    // Keep this mini-game desktop-only, like the custom cursor.
    if (!window.matchMedia("(pointer: fine)").matches) {
      return undefined;
    }

    const initialHeight = Math.max(
      document.documentElement.scrollHeight,
      document.body.scrollHeight,
      window.innerHeight
    );

    setPageHeight(initialHeight);
    setAliens(createAliens(initialHeight));

    const measurePage = () => {
      setPageHeight(
        Math.max(
          document.documentElement.scrollHeight,
          document.body.scrollHeight,
          window.innerHeight
        )
      );
    };

    const observer = new ResizeObserver(measurePage);

    observer.observe(document.body);
    observer.observe(document.documentElement);

    window.addEventListener("resize", measurePage);

    // SpaceCursor dispatches this event when a projectile hits an alien.
    const handleAlienHit = (event) => {
      const alienElement = event.target;
      const alienId = Number(alienElement.dataset.alienId);

      if (!alienId) return;

      setAliens((current) =>
        current.map((alien) =>
          alien.id === alienId
            ? { ...alien, hit: true }
            : alien
        )
      );

      setDestroyedCount((current) =>
        Math.min(current + 1, ALIEN_COUNT)
      );

      // Remove the alien after its destruction animation.
      window.setTimeout(() => {
        setAliens((current) =>
          current.filter((alien) => alien.id !== alienId)
        );
      }, 500);
    };

    document.addEventListener("alien-hit", handleAlienHit);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measurePage);
      document.removeEventListener("alien-hit", handleAlienHit);
    };
  }, []);

  if (typeof document === "undefined" || !pageHeight) {
    return null;
  }

  return createPortal(
    <>
      <div className="alien-hunt-layer" aria-hidden="true">
        {aliens.map((alien) => (
          <div
            key={alien.id}
            className={`alien ${
              alien.hit ? "alien--hit" : ""
            }`}
            data-shootable
            data-alien="true"
            data-alien-id={alien.id}
            style={{
                left: `${alien.x}px`,
                top: `${alien.y}px`,
              width: `${alien.size}px`,
              height: `${alien.size}px`,
              "--float-duration": `${alien.duration}s`,
              "--float-delay": `${alien.delay}s`,
            }}
          >
            <div className="alien__sprite" />
          </div>
        ))}
      </div>


        <div className="alien-hunt-counter" data-shootable>
        {/* <span className="alien-hunt-counter__icon">✦</span> */}

        <div className="alien-hunt-counter__content">
            <span className="alien-hunt-counter__label">
            ALIENS
            </span>

            <span className="alien-hunt-counter__score">
            <strong>{destroyedCount}</strong>
            <span>/ {ALIEN_COUNT}</span>
            </span>
        </div>

        {destroyedCount === ALIEN_COUNT && (
            <span className="alien-hunt-counter__complete">
            HUNT <br />COMPLETE
            </span>
        )}
        </div>

    </>,
    document.body
  );
}
