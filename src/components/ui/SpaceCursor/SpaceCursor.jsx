
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

    debug("Pointer fine:", pointerQuery.matches);
    debug("Reduced motion:", reducedMotion);

    if (!pointerQuery.matches) {
      debug("Disabled: this device does not report a fine pointer");
      return undefined;
    }

    let animationId = 0;
    let width = window.innerWidth;
    let height = window.innerHeight;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let frame = 0;
    let previousTime = 0;
    let lastTargetLog = 0;

    const mouse = {
      x: 0,
      y: 0,
      targetX: 0,
      targetY: 0,
      angle: 0,
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
      if (event.pointerType === "touch") return;

      mouse.targetX = event.clientX;
      mouse.targetY = event.clientY;
      mouse.active = true;

      if (!mouse.initialized) {
        mouse.x = event.clientX;
        mouse.y = event.clientY;
        mouse.initialized = true;

        debug("Pointer initialized", {
          x: mouse.x,
          y: mouse.y,
        });
      }
    };

    const onPointerLeave = () => {
      mouse.active = false;
    };

    const getDirection = () => ({
      x: Math.sin(mouse.angle),
      y: -Math.cos(mouse.angle),
    });

    // Small particles when firing.
    const createParticles = (x, y) => {
      if (reducedMotion) return;

      for (let i = 0; i < 5; i += 1) {
        if (particles.length >= 150) break;

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

    // Impact sparks. Charged shots create a bigger explosion.
    const createImpactSparks = (x, y, power = 0) => {
      if (reducedMotion) return;

      const sparkCount = Math.round(14 + power * 26);

      for (let i = 0; i < sparkCount; i += 1) {
        if (particles.length >= 150) break;

        const angle =
          (Math.PI * 2 * i) / sparkCount +
          (Math.random() - 0.5) * 0.6;

        const speed =
          Math.random() * (4 + power * 3) + 2;

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

      debug("Impact sparks created", {
        x,
        y,
        sparkCount,
        power,
      });
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

      debug(charged ? "CHARGED SHOT!" : "Normal shot", {
        x,
        y,
        power,
        holdDuration,
      });

      createParticles(x, y);
    };

    // Start charging on mouse down.
    const onPointerDown = (event) => {
      if (event.button !== 0 || event.pointerType === "touch") return;
      if (!mouse.initialized) return;
      if (charge.active) return;

      charge.active = true;
      charge.startedAt = performance.now();
      charge.progress = 0;

      debug("Charging started");
    };

    // Release fires the projectile.
    const onPointerUp = (event) => {
      if (event.button !== 0 || !charge.active) return;

      const holdDuration = performance.now() - charge.startedAt;

      charge.active = false;
      charge.progress = 0;

      fireShot(holdDuration);
    };

    // Cancel charging without shooting if the browser loses focus.
    const cancelCharge = () => {
      charge.active = false;
      charge.progress = 0;
    };

const triggerHit = (element, x, y, power = 0) => {
  createImpactSparks(x, y, power);

  element.classList.remove("shot-hit", "shot-hit-charged");

  // Force animation restart
  void element.offsetWidth;

  const hitClass = power >= 0.95
    ? "shot-hit-charged"
    : "shot-hit";

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

      const radius = 17 + progress * 15 + pulse * 2;
      const alpha = 0.25 + progress * 0.55;

      ctx.save();
      ctx.translate(mouse.x, mouse.y);
      ctx.rotate(mouse.angle);

      // Outer energy glow.
      ctx.globalAlpha = alpha;
      ctx.shadowBlur = 12 + progress * 22;
      ctx.shadowColor = COLORS.cyan;
      ctx.strokeStyle = COLORS.cyan;
      ctx.lineWidth = 1.5 + progress * 2;

      ctx.beginPath();
      ctx.arc(0, 0, radius, 0, Math.PI * 2);
      ctx.stroke();

      // Inner energy ring.
      ctx.globalAlpha = 0.2 + progress * 0.5;
      ctx.shadowBlur = 8;
      ctx.strokeStyle = COLORS.white;
      ctx.lineWidth = 1;

      ctx.beginPath();
      ctx.arc(
        0,
        0,
        radius - 5,
        -Math.PI / 2,
        -Math.PI / 2 + Math.PI * 2 * progress
      );
      ctx.stroke();

      // Energy core.
      const coreRadius = 3 + progress * 5;

      ctx.globalAlpha = 0.15 + progress * 0.35;
      ctx.fillStyle = COLORS.cyan;
      ctx.shadowBlur = 15 + progress * 25;

      ctx.beginPath();
      ctx.arc(0, 0, coreRadius, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    };

    const drawShip = () => {
      ctx.save();
      ctx.translate(mouse.x, mouse.y);
      ctx.rotate(mouse.angle);

      // Engine
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

      // Wings
      ctx.fillStyle = COLORS.blue;
      ctx.fillRect(-10, 1, 4, 10);
      ctx.fillRect(-7, 7, 4, 6);
      ctx.fillRect(6, 1, 4, 10);
      ctx.fillRect(3, 7, 4, 6);

      // Main body
      ctx.fillStyle = COLORS.white;
      ctx.fillRect(-4, -9, 8, 19);
      ctx.fillRect(-6, -3, 12, 8);

      // Cockpit
      ctx.fillStyle = COLORS.cyan;
      ctx.fillRect(-2, -7, 4, 7);

      // Wing details
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

        for (const target of targets) {
          if (!target.isConnected) continue;

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
            hitTarget = target;

            hitX = previousX + (bullet.x - previousX) * hitT;
            hitY = previousY + (bullet.y - previousY) * hitT;

            break;
          }
        }

        if (hitTarget) {
          triggerHit(
            hitTarget,
            hitX,
            hitY,
            bullet.power
          );

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

        // Additional orange energy core for charged shots.
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

        if (particle.life <= 0) {
          particles.splice(i, 1);
        }
      }

      ctx.globalAlpha = 1;
    };

    const animate = (time) => {
      animationId = window.requestAnimationFrame(animate);

      const delta = previousTime
        ? Math.min(time - previousTime, 32)
        : 16.67;

      previousTime = time;
      frame += 1;

      ctx.clearRect(0, 0, width, height);

      const dx = mouse.targetX - mouse.x;
      const dy = mouse.targetY - mouse.y;

      const smoothing = 1 - Math.pow(0.78, delta / 16.67);

      mouse.x += dx * smoothing;
      mouse.y += dy * smoothing;

      if (Math.abs(dx) + Math.abs(dy) > 0.5) {
        const targetAngle = Math.atan2(dy, dx) + Math.PI / 2;

        let difference = targetAngle - mouse.angle;

        difference = Math.atan2(
          Math.sin(difference),
          Math.cos(difference)
        );

        mouse.angle += difference * (
          1 - Math.pow(0.85, delta / 16.67)
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

      updateBullets(delta);
      updateParticles(delta);

      if (mouse.active && mouse.initialized) {
        drawChargeEffect();
        drawShip();
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
