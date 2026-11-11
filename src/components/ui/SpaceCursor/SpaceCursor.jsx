
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

const COLORS = {
  cyan: "#55D6FF",
  blue: "#239BDB",
  white: "#EAFBFF",
  orange: "#FFB347",
};

const SPARK_COLORS = [
  COLORS.cyan,
  COLORS.cyan,
  COLORS.blue,
  COLORS.white,
  COLORS.orange,
];

const MAX_CHARGE_MS = 1200;
const MIN_CHARGE_MS = 220;

const DEBUG = false;

const debug = (...args) => {
  if (DEBUG) console.log("[SpaceCursor]", ...args);
};

const clamp = (value, min, max) =>
  Math.max(min, Math.min(max, value));

const segmentIntersectsRect = (
  x1,
  y1,
  x2,
  y2,
  rect,
  padding = 5
) => {
  const left = rect.left - padding;
  const right = rect.right + padding;
  const top = rect.top - padding;
  const bottom = rect.bottom + padding;

  const dx = x2 - x1;
  const dy = y2 - y1;

  let tMin = 0;
  let tMax = 1;

  const p = [-dx, dx, -dy, dy];
  const q = [
    x1 - left,
    right - x1,
    y1 - top,
    bottom - y1,
  ];

  for (let i = 0; i < 4; i += 1) {
    if (p[i] === 0) {
      if (q[i] < 0) return null;
      continue;
    }

    const t = q[i] / p[i];

    if (p[i] < 0) {
      if (t > tMax) return null;
      tMin = Math.max(tMin, t);
    } else {
      if (t < tMin) return null;
      tMax = Math.min(tMax, t);
    }
  }

  return tMin;
};

export default function SpaceCursor() {
  const canvasRef = useRef(null);

  useEffect(() => {
    debug("Component mounted");

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");

    if (!canvas || !ctx) {
      console.error("[SpaceCursor] Canvas or 2D context unavailable");
      return undefined;
    }

    const pointerQuery = window.matchMedia("(pointer: fine)");
    const reducedMotionQuery = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    );

    const reducedMotion = reducedMotionQuery.matches;

    if (!pointerQuery.matches) return undefined;

    let animationId = 0;
    let width = window.innerWidth;
    let height = window.innerHeight;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let frame = 0;
    let previousTime = 0;
    let lastTargetLog = 0;
let tutorialStartedAt = null;
const TUTORIAL_DURATION = 6000;
    // Controls how frequently engine particles are emitted.
    let trailAccumulator = 0;

    const mouse = {
      x: 0,
      y: 0,
      targetX: 0,
      targetY: 0,
      angle: 0,
      speed: 0,
      active: false,
      initialized: false,
    };

    const charge = {
      active: false,
      startedAt: 0,
      progress: 0,
    };

    const bullets = [];
    const particles = [];

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const onPointerMove = (event) => {
if (tutorialStartedAt === null) {
  tutorialStartedAt = performance.now();
}
      if (event.pointerType === "touch") return;

      mouse.targetX = event.clientX;
      mouse.targetY = event.clientY;
      mouse.active = true;

      if (!mouse.initialized) {
        mouse.x = event.clientX;
        mouse.y = event.clientY;
        mouse.initialized = true;
      }
    };

    const onPointerLeave = () => {
      mouse.active = false;
      mouse.speed = 0;
      trailAccumulator = 0;
    };

    const getDirection = () => ({
      x: Math.sin(mouse.angle),
      y: -Math.cos(mouse.angle),
    });

    // Small particles when firing.
    const createParticles = (x, y) => {
      if (reducedMotion) return;

      for (let i = 0; i < 5; i += 1) {
        if (particles.length >= 250) break;

        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 2 + 1;

        particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 1,
          size: Math.random() * 2 + 1,
          color: COLORS.cyan,
          type: "particle",
        });
      }
    };

    // Speed-based engine exhaust.
    const createEngineTrail = (delta) => {
      if (reducedMotion || !mouse.active) return;

      const intensity = clamp(mouse.speed / 12, 0, 1);

      // Avoid generating smoke when the ship is almost stationary.
      if (intensity < 0.08) {
        trailAccumulator = 0;
        return;
      }

      const direction = getDirection();

      // Emit from the back of the ship.
      const exhaustX = mouse.x - direction.x * 13;
      const exhaustY = mouse.y - direction.y * 13;

      // Faster movement produces a denser trail.
      const emissionRate = 0.3 + intensity * 2.8;

      trailAccumulator += emissionRate * (delta / 16.67);

      while (trailAccumulator >= 1) {
        trailAccumulator -= 1;

        if (particles.length >= 250) break;

        const spread = (Math.random() - 0.5) * (4 + intensity * 5);
        const exhaustSpeed = Math.random() * 1.2 + 0.5;

        particles.push({
          x: exhaustX + (Math.random() - 0.5) * 4,
          y: exhaustY + (Math.random() - 0.5) * 4,

          vx:
            -direction.x * exhaustSpeed -
            direction.x * intensity * 1.2 +
            (Math.random() - 0.5) * 0.8,

          vy:
            -direction.y * exhaustSpeed -
            direction.y * intensity * 1.2 +
            (Math.random() - 0.5) * 0.8,

          life: Math.random() * 0.25 + 0.55,
          size: Math.random() * (3 + intensity * 3) + 2,
          color: Math.random() > 0.4 ? COLORS.cyan : COLORS.blue,
          type: "smoke",
        });
      }
    };

    // Impact sparks.
    const createImpactSparks = (x, y, power = 0) => {
      if (reducedMotion) return;

      const sparkCount = Math.round(14 + power * 26);

      for (let i = 0; i < sparkCount; i += 1) {
        if (particles.length >= 250) break;

        const angle =
          (Math.PI * 2 * i) / sparkCount +
          (Math.random() - 0.5) * 0.6;

        const speed = Math.random() * (4 + power * 3) + 2;

        particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: Math.random() * 0.25 + 0.7,
          size: Math.random() * (2.5 + power * 2) + 1.5,
          color: SPARK_COLORS[
            Math.floor(Math.random() * SPARK_COLORS.length)
          ],
          type: "spark",
        });
      }
    };

    // Fire a normal or charged projectile.
    const fireShot = (holdDuration = 0) => {
      if (!mouse.initialized) return;

      if (bullets.length >= 30) {
        debug("Shot skipped: bullet limit reached");
        return;
      }

      const charged = holdDuration >= MIN_CHARGE_MS;

      const power = charged
        ? clamp(holdDuration / MAX_CHARGE_MS, 0.2, 1)
        : 0;

      const direction = getDirection();
      const offset = 15;

      const x = mouse.x + direction.x * offset;
      const y = mouse.y + direction.y * offset;

      const speed = 12 + power * 3;

      bullets.push({
        x,
        y,
        vx: direction.x * speed,
        vy: direction.y * speed,
        life: 70,
        charged,
        power,
      });

      createParticles(x, y);
    };

    // Start charging.
    const onPointerDown = (event) => {
      if (event.button !== 0 || event.pointerType === "touch") return;
      if (!mouse.initialized || charge.active) return;

      charge.active = true;
      charge.startedAt = performance.now();
      charge.progress = 0;
    };

    // Release fires the projectile.
    const onPointerUp = (event) => {
      if (event.button !== 0 || !charge.active) return;

      const holdDuration = performance.now() - charge.startedAt;

      charge.active = false;
      charge.progress = 0;

      fireShot(holdDuration);
    };

    const cancelCharge = () => {
      charge.active = false;
      charge.progress = 0;
    };


const triggerHit = (element, x, y, power = 0) => {
  createImpactSparks(x, y, power);

  // Alien collision: AlienHunt handles its health.
  if (element.matches("[data-alien]")) {
    element.dispatchEvent(
      new CustomEvent("alien-hit", {
        bubbles: true,
        detail: { x, y, power },
      })
    );

    return;
  }

  element.classList.remove("shot-hit", "shot-hit-charged");

  void element.offsetWidth;

  const hitClass =
    power >= 0.95 ? "shot-hit-charged" : "shot-hit";

  element.classList.add(hitClass);

  window.setTimeout(() => {
    element.classList.remove(hitClass);
  }, 700);
};


    // Draw the energy aura while charging.

const drawChargeEffect = () => {
  if (!charge.active || reducedMotion) return;

  const progress = charge.progress;
  const pulse = Math.sin(frame * 0.18) * 0.5 + 0.5;

  // Larger energy field.
  const radius = 19 + progress * 13 + pulse * 2;
  const alpha = 0.35 + progress * 0.5;

  ctx.save();
  ctx.translate(mouse.x, mouse.y);

  // Outer energy aura.
  ctx.globalAlpha = 0.12 + progress * 0.2;
  ctx.shadowBlur = 25 + progress * 30;
  ctx.shadowColor = COLORS.cyan;
  ctx.strokeStyle = COLORS.cyan;
  ctx.lineWidth = 1.5;

  ctx.beginPath();
  ctx.arc(0, 0, radius + 6, 0, Math.PI * 2);
  ctx.stroke();

  // Background charging ring.
  ctx.globalAlpha = 0.3;
  ctx.shadowBlur = 0;
  ctx.strokeStyle = "rgba(85, 214, 255, 0.25)";
  ctx.lineWidth = 4;

  ctx.beginPath();
  ctx.arc(0, 0, radius, 0, Math.PI * 2);
  ctx.stroke();

  // Color changes as the charge increases.
  const chargeGradient = ctx.createLinearGradient(
    -radius,
    -radius,
    radius,
    radius
  );

  chargeGradient.addColorStop(0, COLORS.cyan);
  chargeGradient.addColorStop(0.45, COLORS.blue);
  chargeGradient.addColorStop(0.75, "#A83BFF");
  chargeGradient.addColorStop(1, COLORS.orange);

  // Progress ring.
  ctx.globalAlpha = alpha;
  ctx.shadowBlur = 15 + progress * 25;
  ctx.shadowColor =
    progress > 0.75 ? COLORS.orange : COLORS.cyan;

  ctx.strokeStyle = chargeGradient;
  ctx.lineWidth = 3.5 + progress * 2.5;
  ctx.lineCap = "round";

  ctx.beginPath();
  ctx.arc(
    0,
    0,
    radius,
    -Math.PI / 2,
    -Math.PI / 2 + Math.PI * 2 * progress
  );
  ctx.stroke();

  // Inner energy ring.
  ctx.globalAlpha = 0.25 + progress * 0.45;
  ctx.shadowBlur = 10;
  ctx.strokeStyle = COLORS.white;
  ctx.lineWidth = 1;

  ctx.beginPath();
  ctx.arc(0, 0, radius - 9, 0, Math.PI * 2);
  ctx.stroke();

  // Energy core grows while charging.
  const coreRadius = 3 + progress * 6;

  ctx.globalAlpha = 0.25 + progress * 0.5;
  ctx.fillStyle =
    progress > 0.75 ? COLORS.orange : COLORS.cyan;

  ctx.shadowBlur = 18 + progress * 30;
  ctx.shadowColor = ctx.fillStyle;

  ctx.beginPath();
  ctx.arc(0, 0, coreRadius, 0, Math.PI * 2);
  ctx.fill();

  // Small white energy core.
  ctx.globalAlpha = 0.5 + progress * 0.5;
  ctx.fillStyle = COLORS.white;
  ctx.shadowBlur = 12;

  ctx.beginPath();
  ctx.arc(0, 0, 2 + progress * 2, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
};


const drawTutorialHint = () => {
  if (
    tutorialStartedAt === null ||
    !mouse.active
  ) {
    return;
  }

  const elapsed = performance.now() - tutorialStartedAt;

  if (elapsed >= TUTORIAL_DURATION) return;

  // Fade out during the last second.
  const fadeStart = TUTORIAL_DURATION - 1000;
  const alpha =
    elapsed > fadeStart
      ? 1 - (elapsed - fadeStart) / 1000
      : 1;

  const boxWidth = 156;
  const boxHeight = 52;

  // Position above and slightly to the left of the ship.
  let x = mouse.x - boxWidth + 12;
  let y = mouse.y - boxHeight - 28;

  // Keep the tutorial inside the viewport.
  x = clamp(x, 12, width - boxWidth - 12);
  y = clamp(y, 12, height - boxHeight - 12);

  ctx.save();

  ctx.globalAlpha = alpha;

  // Panel background.
  ctx.fillStyle = "rgba(7, 20, 43, 0.96)";
  ctx.strokeStyle = "rgba(85, 214, 255, 0.8)";
  ctx.lineWidth = 1;

  ctx.shadowBlur = 14;
  ctx.shadowColor = "rgba(85, 214, 255, 0.25)";

  ctx.beginPath();
  ctx.roundRect(x, y, boxWidth, boxHeight, 7);
  ctx.fill();
  ctx.stroke();

  ctx.shadowBlur = 0;

  // Accent line.
  ctx.fillStyle = COLORS.cyan;
  ctx.fillRect(x + 9, y + 10, 2, 32);

  ctx.font = "600 11px Arial";
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";

  // First instruction.
  ctx.fillStyle = COLORS.cyan;
  ctx.fillText("CLICK:", x + 19, y + 17);

  ctx.fillStyle = COLORS.white;
  ctx.fillText("FIRE", x + 60, y + 17);

  // Second instruction.
  ctx.fillStyle = COLORS.orange;
  ctx.fillText("HOLD:", x + 19, y + 37);

  ctx.fillStyle = COLORS.white;
  ctx.fillText("POWER BLAST", x + 60, y + 37);

  ctx.restore();
};


    const drawShip = () => {
      ctx.save();
      ctx.translate(mouse.x, mouse.y);
      ctx.rotate(mouse.angle);

      // Engine.
      ctx.shadowBlur = reducedMotion ? 0 : 12;
      ctx.shadowColor = COLORS.cyan;
      ctx.fillStyle = COLORS.orange;

      ctx.fillRect(
        -3,
        12,
        6,
        5 + (reducedMotion ? 0 : Math.sin(frame * 0.3) * 2)
      );

      ctx.fillStyle = COLORS.cyan;
      ctx.fillRect(-2, 12, 4, 4);
      ctx.shadowBlur = 0;

      // Wings.
      ctx.fillStyle = COLORS.blue;
      ctx.fillRect(-10, 1, 4, 10);
      ctx.fillRect(-7, 7, 4, 6);
      ctx.fillRect(6, 1, 4, 10);
      ctx.fillRect(3, 7, 4, 6);

      // Main body.
      ctx.fillStyle = COLORS.white;
      ctx.fillRect(-4, -9, 8, 19);
      ctx.fillRect(-6, -3, 12, 8);

      // Cockpit.
      ctx.fillStyle = COLORS.cyan;
      ctx.fillRect(-2, -7, 4, 7);

      // Wing details.
      ctx.fillStyle = COLORS.orange;
      ctx.fillRect(-9, 5, 2, 3);
      ctx.fillRect(7, 5, 2, 3);

      ctx.restore();
    };

    const updateBullets = (delta) => {
      const step = delta / 16.67;

      const targets = bullets.length
        ? document.querySelectorAll("[data-shootable]")
        : [];

      if (
        DEBUG &&
        bullets.length > 0 &&
        frame - lastTargetLog > 60
      ) {
        lastTargetLog = frame;

        debug(
          "Shootable targets:",
          [...targets].map((target) => ({
            tag: target.tagName,
            className:
              typeof target.className === "string"
                ? target.className
                : target.getAttribute("class"),
            rect: target.getBoundingClientRect().toJSON(),
          }))
        );
      }

      for (let i = bullets.length - 1; i >= 0; i -= 1) {
        const bullet = bullets[i];

        const previousX = bullet.x;
        const previousY = bullet.y;

        bullet.x += bullet.vx * step;
        bullet.y += bullet.vy * step;
        bullet.life -= step;

        let hitTarget = null;
        let hitX = bullet.x;
        let hitY = bullet.y;


const collisions = [];

for (const target of targets) {
  if (!target.isConnected) continue;
  if (target.dataset.alienDestroyed === "true") continue;

  const rect = target.getBoundingClientRect();

  if (!rect.width || !rect.height) continue;

  const hitT = segmentIntersectsRect(
    previousX,
    previousY,
    bullet.x,
    bullet.y,
    rect,
    bullet.charged ? 14 : 8
  );

  if (hitT !== null) {
    collisions.push({
      target,
      hitT,
      isAlien: target.matches("[data-alien]"),
    });
  }
}

collisions.sort((a, b) => {
  // Aliens always take priority over regular elements.
  if (a.isAlien !== b.isAlien) {
    return a.isAlien ? -1 : 1;
  }

  // Otherwise, hit the closest element along the trajectory.
  return a.hitT - b.hitT;
});

const collision = collisions[0];

if (collision) {
  const { target, hitT } = collision;

  const hitX =
    previousX + (bullet.x - previousX) * hitT;

  const hitY =
    previousY + (bullet.y - previousY) * hitT;

  triggerHit(target, hitX, hitY, bullet.power);

  bullets.splice(i, 1);
  continue;
}


        if (hitTarget) {
          triggerHit(hitTarget, hitX, hitY, bullet.power);
          bullets.splice(i, 1);
          continue;
        }

        // Draw projectile.
        ctx.save();

        const projectileWidth = bullet.charged
          ? 3 + bullet.power * 5
          : 3;

        ctx.shadowBlur = reducedMotion
          ? 0
          : bullet.charged
            ? 16 + bullet.power * 20
            : 12;

        ctx.shadowColor = bullet.charged
          ? COLORS.orange
          : COLORS.cyan;

        ctx.strokeStyle = bullet.charged
          ? COLORS.white
          : COLORS.cyan;

        ctx.lineWidth = projectileWidth;
        ctx.lineCap = "round";

        ctx.beginPath();

        ctx.moveTo(
          bullet.x - bullet.vx * (bullet.charged ? 2.5 : 2),
          bullet.y - bullet.vy * (bullet.charged ? 2.5 : 2)
        );

        ctx.lineTo(bullet.x, bullet.y);
        ctx.stroke();

        if (bullet.charged) {
          ctx.shadowBlur = reducedMotion ? 0 : 12;
          ctx.shadowColor = COLORS.orange;
          ctx.strokeStyle = COLORS.orange;
          ctx.lineWidth = Math.max(1.5, bullet.power * 3);

          ctx.beginPath();
          ctx.moveTo(
            bullet.x - bullet.vx,
            bullet.y - bullet.vy
          );
          ctx.lineTo(bullet.x, bullet.y);
          ctx.stroke();
        }

        ctx.restore();

        if (
          bullet.life <= 0 ||
          bullet.x < -30 ||
          bullet.x > width + 30 ||
          bullet.y < -30 ||
          bullet.y > height + 30
        ) {
          bullets.splice(i, 1);
        }
      }
    };

    // Update and render all particles.
    const updateParticles = (delta) => {
      if (reducedMotion) {
        particles.length = 0;
        return;
      }

      const step = delta / 16.67;

      for (let i = particles.length - 1; i >= 0; i -= 1) {
        const particle = particles[i];

        particle.x += particle.vx * step;
        particle.y += particle.vy * step;

        if (particle.type === "smoke") {
          particle.vx *= Math.pow(0.97, step);
          particle.vy *= Math.pow(0.97, step);

          particle.size += 0.12 * step;
          particle.life -= 0.018 * step;

          // Soft, expanding engine smoke.
          ctx.save();

          ctx.globalAlpha = Math.max(0, particle.life) * 0.3;

          const gradient = ctx.createRadialGradient(
            particle.x,
            particle.y,
            0,
            particle.x,
            particle.y,
            particle.size * 2
          );

          gradient.addColorStop(0, particle.color);
          gradient.addColorStop(0.45, particle.color);
          gradient.addColorStop(1, "transparent");

          ctx.fillStyle = gradient;

          ctx.beginPath();
          ctx.arc(
            particle.x,
            particle.y,
            particle.size * 2,
            0,
            Math.PI * 2
          );
          ctx.fill();

          ctx.restore();
        } else {
          if (particle.type === "spark") {
            particle.vx *= Math.pow(0.96, step);
            particle.vy *= Math.pow(0.96, step);
            particle.vy += 0.025 * step;
            particle.life -= 0.055 * step;
          } else {
            particle.vx *= Math.pow(0.98, step);
            particle.vy *= Math.pow(0.98, step);
            particle.life -= 0.04 * step;
          }

          ctx.save();

          ctx.globalAlpha = Math.max(0, particle.life);
          ctx.strokeStyle = particle.color;
          ctx.fillStyle = particle.color;

          if (particle.type === "spark") {
            ctx.shadowBlur = 9;
            ctx.shadowColor = particle.color;
            ctx.lineWidth = particle.size;
            ctx.lineCap = "round";

            ctx.beginPath();
            ctx.moveTo(
              particle.x - particle.vx * 2.5,
              particle.y - particle.vy * 2.5
            );
            ctx.lineTo(particle.x, particle.y);
            ctx.stroke();
          } else {
            ctx.fillRect(
              particle.x,
              particle.y,
              particle.size,
              particle.size
            );
          }

          ctx.restore();
        }

        if (particle.life <= 0) {
          particles.splice(i, 1);
        }
      }
    };

    const animate = (time) => {
      animationId = window.requestAnimationFrame(animate);

      const delta = previousTime
        ? Math.min(time - previousTime, 32)
        : 16.67;

      previousTime = time;
      frame += 1;

      ctx.clearRect(0, 0, width, height);

      const step = delta / 16.67;

      const previousX = mouse.x;
      const previousY = mouse.y;

      const dx = mouse.targetX - mouse.x;
      const dy = mouse.targetY - mouse.y;

      const smoothing = 1 - Math.pow(0.78, step);

      mouse.x += dx * smoothing;
      mouse.y += dy * smoothing;

      // Measure actual ship movement, not raw pointer distance.
      const movementX = mouse.x - previousX;
      const movementY = mouse.y - previousY;

      mouse.speed = Math.hypot(movementX, movementY) / step;

      if (Math.abs(dx) + Math.abs(dy) > 0.5) {
        const targetAngle = Math.atan2(dy, dx) + Math.PI / 2;

        let difference = targetAngle - mouse.angle;

        difference = Math.atan2(
          Math.sin(difference),
          Math.cos(difference)
        );

        mouse.angle += difference * (
          1 - Math.pow(0.85, step)
        );
      }

      // Update charge progress.
      if (charge.active) {
        const elapsed = performance.now() - charge.startedAt;

        charge.progress = clamp(
          elapsed / MAX_CHARGE_MS,
          0,
          1
        );
      }

      // Create the trail before updating and drawing particles.
      if (mouse.active && mouse.initialized) {
        createEngineTrail(delta);
      }

      updateBullets(delta);
      updateParticles(delta);

      // Draw the ship only once per frame.
if (mouse.active && mouse.initialized) {
  drawChargeEffect();
  drawShip();
  drawTutorialHint();
}
    };

    resize();

    window.addEventListener("resize", resize);

    window.addEventListener("pointermove", onPointerMove, {
      passive: true,
    });

    window.addEventListener("pointerleave", onPointerLeave);
    window.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("pointercancel", cancelCharge);
    window.addEventListener("blur", cancelCharge);

    document.documentElement.classList.add("space-cursor-enabled");

    animationId = window.requestAnimationFrame(animate);

    debug("Event listeners registered; animation started");

    return () => {
      window.cancelAnimationFrame(animationId);

      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerleave", onPointerLeave);
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", cancelCharge);
      window.removeEventListener("blur", cancelCharge);

      document.documentElement.classList.remove(
        "space-cursor-enabled"
      );

      debug("Component unmounted; listeners removed");
    };
  }, []);

  if (typeof document === "undefined") return null;

  return createPortal(
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100vh",
        display: "block",
        pointerEvents: "none",
        zIndex: 999999,
      }}
    />,
    document.body
  );
}
