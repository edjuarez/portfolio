
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { MdReplay } from "react-icons/md";
import "./AlienHunt.css";

const ALIEN_COUNT = 10;
const ALIEN_MAX_HEALTH = 3;
const HIT_ANIMATION_MS = 350;
const DEATH_ANIMATION_MS = 550;

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

    const zoneTop = (index / ALIEN_COUNT) * pageHeight;
    const zoneBottom = ((index + 1) / ALIEN_COUNT) * pageHeight;

    let position = null;

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

const isMobile = window.matchMedia("(pointer: coarse)").matches;

const overlapsShootable = !isMobile &&
  shootableRects.some((rect) => overlaps(candidate, rect, 35));

const overlapsAlien = aliens.some((alien) =>
  overlaps(
    candidate,
    {
      left: alien.x - alien.size / 2,
      right: alien.x + alien.size / 2,
      top: alien.y - alien.size / 2,
      bottom: alien.y + alien.size / 2,
    },
    45
  )
);

if (isMobile || (!overlapsShootable && !overlapsAlien)) {
  position = { x, y };
  break;
}
    }

    if (!position) continue;

    aliens.push({
      id: index + 1,
      x: position.x,
      y: position.y,
      size,
      duration: 3 + Math.random() * 2,
      delay: Math.random() * -5,
      hits: 0,
      hit: false,
      destroyed: false,
    });
  }

  return aliens;
};

export default function AlienHunt() {
  const [aliens, setAliens] = useState([]);
  const [pageHeight, setPageHeight] = useState(0);
  const [destroyedCount, setDestroyedCount] = useState(0);
  const [totalAliens, setTotalAliens] = useState(0);
  const [victoryPhase, setVictoryPhase] = useState("hidden");
    const [round, setRound] = useState(0);
  const hitTimers = useRef(new Map());
  const deathTimers = useRef(new Map());
const restartGame = () => {
  // Cancel pending hit and death timers.
  hitTimers.current.forEach((timer) => {
    window.clearTimeout(timer);
  });

  deathTimers.current.forEach((timer) => {
    window.clearTimeout(timer);
  });

  hitTimers.current.clear();
  deathTimers.current.clear();

  // Recalculate the current page height.
  const currentHeight = Math.max(
    document.documentElement.scrollHeight,
    document.body.scrollHeight,
    window.innerHeight
  );

  // Generate a new set of aliens.
  const generatedAliens = createAliens(currentHeight);

  setPageHeight(currentHeight);
  setAliens(generatedAliens);
  setTotalAliens(generatedAliens.length);
  setDestroyedCount(0);
  setVictoryPhase("hidden");
  setRound((current) => current + 1);
};
  useEffect(() => {
/*     if (!window.matchMedia("(pointer: fine)").matches) {
      return undefined;
    } */

    const initialHeight = Math.max(
      document.documentElement.scrollHeight,
      document.body.scrollHeight,
      window.innerHeight
    );

    setPageHeight(initialHeight);

    const generatedAliens = createAliens(initialHeight);

    setAliens(generatedAliens);
    setTotalAliens(generatedAliens.length);

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

    const handleAlienHit = (event) => {
      const alienElement = event.target;
      const alienId = Number(alienElement.dataset.alienId);
      const power = event.detail?.power ?? 0;

      if (!alienId) return;

      if (alienElement.dataset.alienDestroyed === "true") {
        return;
      }

      const previousHits = Number(
        alienElement.dataset.alienHits || 0
      );

      const currentHits = previousHits + 1;

      const isCharged = power > 0;
      const isDead =
        isCharged || currentHits >= ALIEN_MAX_HEALTH;

      alienElement.dataset.alienHits = String(currentHits);

      // Cancel any previous hit animation timer.
      const previousTimer = hitTimers.current.get(alienId);

      if (previousTimer) {
        window.clearTimeout(previousTimer);
        hitTimers.current.delete(alienId);
      }

      if (isDead) {
        alienElement.dataset.alienDestroyed = "true";

        alienElement.classList.remove(
          "alien--hit",
          "alien--destroyed"
        );

        void alienElement.offsetWidth;

        alienElement.classList.add("alien--destroyed");

        setAliens((current) =>
          current.map((alien) =>
            alien.id === alienId
              ? {
                  ...alien,
                  hits: currentHits,
                  hit: false,
                  destroyed: true,
                }
              : alien
          )
        );

        setDestroyedCount((current) => current + 1);

        const deathTimer = window.setTimeout(() => {
          setAliens((current) =>
            current.filter((alien) => alien.id !== alienId)
          );

          deathTimers.current.delete(alienId);
        }, DEATH_ANIMATION_MS);

        deathTimers.current.set(alienId, deathTimer);

        return;
      }

      // Non-lethal hit.
      alienElement.classList.remove(
        "alien--hit",
        "alien--destroyed"
      );

      void alienElement.offsetWidth;

      alienElement.classList.add("alien--hit");

      setAliens((current) =>
        current.map((alien) =>
          alien.id === alienId
            ? {
                ...alien,
                hits: currentHits,
                hit: true,
              }
            : alien
        )
      );

      const hitTimer = window.setTimeout(() => {
        if (
          alienElement.isConnected &&
          alienElement.dataset.alienDestroyed !== "true"
        ) {
          alienElement.classList.remove("alien--hit");
        }

        setAliens((current) =>
          current.map((alien) =>
            alien.id === alienId && !alien.destroyed
              ? { ...alien, hit: false }
              : alien
          )
        );

        hitTimers.current.delete(alienId);
      }, HIT_ANIMATION_MS);

      hitTimers.current.set(alienId, hitTimer);
    };

    document.addEventListener("alien-hit", handleAlienHit);

    return () => {
      observer.disconnect();

      window.removeEventListener("resize", measurePage);

      document.removeEventListener(
        "alien-hit",
        handleAlienHit
      );

      hitTimers.current.forEach((timer) => {
        window.clearTimeout(timer);
      });

      deathTimers.current.forEach((timer) => {
        window.clearTimeout(timer);
      });

      hitTimers.current.clear();
      deathTimers.current.clear();
    };
  }, []);

  // Victory screen timing.
  useEffect(() => {
    if (
      totalAliens === 0 ||
      destroyedCount !== totalAliens
    ) {
      return;
    }

    setVictoryPhase("visible");

    const exitTimer = window.setTimeout(() => {
      setVictoryPhase("exit");
    }, 3000);

    const hideTimer = window.setTimeout(() => {
      setVictoryPhase("hidden");
    }, 3700);

    return () => {
      window.clearTimeout(exitTimer);
      window.clearTimeout(hideTimer);
    };
  }, [destroyedCount, totalAliens]);

  if (typeof document === "undefined" || !pageHeight) {
    return null;
  }

  return createPortal(
    <>
      <div className="alien-hunt-layer" aria-hidden="true">
        {aliens.map((alien) => (
          <div
            key={`${round}-${alien.id}`}
            className={[
              "alien",
              alien.hit ? "alien--hit" : "",
              alien.destroyed ? "alien--destroyed" : "",
            ]
              .filter(Boolean)
              .join(" ")}
            data-shootable
            data-alien="true"
            data-alien-id={alien.id}
            data-alien-hits={alien.hits}
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

            {!alien.destroyed && (
              <div className="alien__health">
                {Array.from(
                  { length: ALIEN_MAX_HEALTH },
                  (_, index) => (
                    <span
                      key={index}
                      className={
                        index < alien.hits
                          ? "alien__health-point alien__health-point--lost"
                          : "alien__health-point"
                      }
                    />
                  )
                )}
              </div>
            )}
          </div>
        ))}
      </div>
<div className="alien-hunt-hud" data-shootable>
  {totalAliens > 0 && destroyedCount === totalAliens && (
    <button
      type="button"
      className="alien-hunt-restart"
      onClick={restartGame}
      aria-label="Restart alien hunt"
      title="Play again"
    >
    <MdReplay className="" />
    </button>
  )}

  <div className="alien-hunt-counter">
    <div className="alien-hunt-counter__content">
      <span className="alien-hunt-counter__label">ALIENS</span>

      <span className="alien-hunt-counter__score">
        <strong>{destroyedCount}</strong>
        <span>/ {totalAliens}</span>
      </span>
    </div>

    {totalAliens > 0 && destroyedCount === totalAliens && (
      <span className="alien-hunt-counter__complete">
        HUNT <br /> COMPLETE
      </span>
    )}
  </div>
</div>

      {victoryPhase !== "hidden" && (
        <div
          className={`alien-victory ${
            victoryPhase === "exit"
              ? "alien-victory--exit"
              : ""
          }`}
          role="status"
          aria-live="polite"
        >
          <div className="alien-victory__content">
            <span className="alien-victory__eyebrow">
              MISSION ACCOMPLISHED
            </span>

            <h2 className="alien-victory__title">
              SECTOR <span>CLEARED</span>
            </h2>

            <p className="alien-victory__subtitle">
              ALL ALIENS ELIMINATED
            </p>

            <div className="alien-victory__line" />
          </div>
        </div>
      )}
    </>,
    document.body
  );
}
