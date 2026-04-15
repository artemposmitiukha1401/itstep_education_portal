/* eslint-disable no-undef */
import { useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "./SubjectMap.css";

const SUBJECTS = [
  {
    id: 1,
    name: "Математика",
    topics: 4,
    href: "/subject/math",
    cardColor: "#1253AA",
    accentColor: "#4a8fff",
    lightColor: "#d6e8ff",
    icon: "∑",
    pulse: Math.random() * Math.PI * 2,
    // planet flavour
    bandColor: "#0a3a7a",
    hasRing: false,
    lightAngle: -0.6,   // radians: direction of the "sun"
    atmosphereColor: "#7ab4ff",
  },
  {
    id: 2,
    name: "Українська мова",
    topics: 5,
    href: "/subject/ukrainian",
    cardColor: "#5B2D8E",
    accentColor: "#9b5de5",
    lightColor: "#ead6ff",
    icon: "А",
    pulse: Math.random() * Math.PI * 2,
    bandColor: "#3a1a60",
    hasRing: true,
    lightAngle: -0.4,
    atmosphereColor: "#c084fc",
  },
  {
    id: 3,
    name: "Історія України",
    topics: 6,
    href: "/subject/ukrainian_history",
    cardColor: "#B71C1C",
    accentColor: "#ff6b6b",
    lightColor: "#ffd6d6",
    icon: "⚑",
    pulse: Math.random() * Math.PI * 2,
    bandColor: "#7a0d0d",
    hasRing: false,
    lightAngle: -0.8,
    atmosphereColor: "#ff9f9f",
  },
  {
    id: 4,
    name: "Англійська мова",
    topics: 4,
    href: "/subject/ukrainian",
    cardColor: "#00695C",
    accentColor: "#2ec4b6",
    lightColor: "#d6f5f2",
    icon: "En",
    pulse: Math.random() * Math.PI * 2,
    bandColor: "#004d43",
    hasRing: true,
    lightAngle: -0.5,
    atmosphereColor: "#5eeada",
  },
];

const RADIUS = 80;
const SPRING_LEN = 260;
const SPRING_K = 0.018;
const DAMPING = 0.88;
const REPEL = 18000;
const DPR = window.devicePixelRatio || 1;
const HOVER_SPEED = 0.1;

function hexAlpha(hex, a) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${a})`;
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function topicWord(n) {
  if (n === 1) return "тема";
  if (n >= 2 && n <= 4) return "теми";
  return "тем";
}

// ─── planet drawing helpers ────────────────────────────────────────────────

function drawPlanetSphere(ctx, n, r) {
  const lx = Math.cos(n.lightAngle);
  const ly = Math.sin(n.lightAngle);
  // highlight offset – place it at ~35% radius toward the light
  const hx = n.x + lx * r * 0.35;
  const hy = n.y + ly * r * 0.35;

  // --- base gradient: dark side → lit side ---
  const base = ctx.createRadialGradient(hx, hy, r * 0.05, n.x, n.y, r);
  base.addColorStop(0, hexAlpha(n.lightColor, 0.95));
  base.addColorStop(0.35, n.cardColor);
  base.addColorStop(0.75, n.bandColor);
  base.addColorStop(1, "rgba(0,0,0,0.95)");
  ctx.fillStyle = base;
  ctx.fill();

  // --- surface bands (latitude-like stripes) ---
  // We clip to the circle already, so just draw horizontal ellipses
  const numBands = 3;
  for (let b = 0; b < numBands; b++) {
    const t = (b + 1) / (numBands + 1); // 0..1 across diameter
    const bandY = n.y - r + t * r * 2;
    const halfW = Math.sqrt(Math.max(0, r * r - (bandY - n.y) ** 2));
    const bandH = r * 0.07;
    ctx.beginPath();
    ctx.ellipse(n.x, bandY, halfW * 0.98, bandH, 0, 0, Math.PI * 2);
    ctx.fillStyle = hexAlpha(n.bandColor, 0.28);
    ctx.fill();
  }

  // --- specular highlight (small bright blob on the lit side) ---
  const specX = n.x + lx * r * 0.42;
  const specY = n.y + ly * r * 0.42;
  const spec = ctx.createRadialGradient(specX, specY, 0, specX, specY, r * 0.38);
  spec.addColorStop(0, "rgba(255,255,255,0.55)");
  spec.addColorStop(0.4, "rgba(255,255,255,0.12)");
  spec.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = spec;
  ctx.fill();

  // --- terminator shadow (dark limb on the opposite side) ---
  const sx = n.x - lx * r * 0.15;
  const sy = n.y - ly * r * 0.15;
  const shadow = ctx.createRadialGradient(sx, sy, r * 0.45, sx, sy, r * 1.05);
  shadow.addColorStop(0, "rgba(0,0,0,0)");
  shadow.addColorStop(1, "rgba(0,0,0,0.62)");
  ctx.fillStyle = shadow;
  ctx.fill();
}

function drawAtmosphere(ctx, n, r, hp, pulse) {
  // soft rim glow
  const atmR = r * (1.18 + pulse * 0.04 + hp * 0.06);
  const atm = ctx.createRadialGradient(n.x, n.y, r * 0.88, n.x, n.y, atmR);
  atm.addColorStop(0, hexAlpha(n.atmosphereColor, 0.28 + hp * 0.12 + pulse * 0.06));
  atm.addColorStop(0.5, hexAlpha(n.atmosphereColor, 0.08 + hp * 0.04));
  atm.addColorStop(1, "rgba(0,0,0,0)");
  ctx.beginPath();
  ctx.arc(n.x, n.y, atmR, 0, Math.PI * 2);
  ctx.fillStyle = atm;
  ctx.fill();
}

function drawOuterGlow(ctx, n, r, hp, pulse) {
  const glowR = r * 2.5;
  const glow = ctx.createRadialGradient(n.x, n.y, r * 0.4, n.x, n.y, glowR);
  glow.addColorStop(0, hexAlpha(n.accentColor, 0.18 + pulse * 0.06 + hp * 0.1));
  glow.addColorStop(0.45, hexAlpha(n.accentColor, 0.04 + hp * 0.03));
  glow.addColorStop(1, "rgba(0,0,0,0)");
  ctx.beginPath();
  ctx.arc(n.x, n.y, glowR, 0, Math.PI * 2);
  ctx.fillStyle = glow;
  ctx.fill();
}

function drawRing(ctx, n, r, hp, pulse, t) {
  const tilt = 0.35; // vertical compression (perspective)
  const rInner = r * 1.32;
  const rOuter = r * 1.78 + hp * 6;
  const spin = t * 0.00012; // very slow ring rotation

  ctx.save();
  ctx.translate(n.x, n.y);
  ctx.scale(1, tilt);
  ctx.rotate(spin);

  // back-half of ring (behind planet, drawn before sphere)
  // We use a clipping trick: just draw the full ring with low opacity;
  // the sphere drawn on top will naturally occlude the front half.
  const rg = ctx.createRadialGradient(0, 0, rInner, 0, 0, rOuter);
  rg.addColorStop(0, hexAlpha(n.accentColor, 0.0));
  rg.addColorStop(0.15, hexAlpha(n.accentColor, 0.55 + hp * 0.2 + pulse * 0.08));
  rg.addColorStop(0.5, hexAlpha(n.lightColor, 0.35 + hp * 0.1));
  rg.addColorStop(0.85, hexAlpha(n.accentColor, 0.38 + hp * 0.1));
  rg.addColorStop(1, "rgba(0,0,0,0)");

  ctx.beginPath();
  ctx.arc(0, 0, rOuter, 0, Math.PI * 2);
  ctx.arc(0, 0, rInner, 0, Math.PI * 2, true);
  ctx.fillStyle = rg;
  ctx.fill();

  ctx.restore();
}

// ─── main node draw ────────────────────────────────────────────────────────

export default function SubjectMap() {
  const navigate = useNavigate();
  const starsRef = useRef(null);
  const netRef = useRef(null);
  const stateRef = useRef({
    stars: [],
    nodes: [],
    dragging: null,
    hovered: null,
    mouse: { x: 0, y: 0 },
    mouseDownPos: { x: 0, y: 0 },
    touchNode: null,
    touchStartPos: { x: 0, y: 0 },
    W: window.innerWidth,
    H: window.innerHeight,
    rafId: null,
  });

  const initStars = useCallback(() => {
    const canvas = starsRef.current;
    if (!canvas) return;
    const w = window.innerWidth;
    const h = window.innerHeight;
    canvas.width = w * DPR;
    canvas.height = h * DPR;
    canvas.style.width = w + "px";
    canvas.style.height = h + "px";
    const stx = canvas.getContext("2d");
    stx.setTransform(DPR, 0, 0, DPR, 0, 0);
    stateRef.current.stars = Array.from({ length: 180 }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.2 + 0.2,
      a: Math.random(),
      speed: Math.random() * 0.003 + 0.001,
    }));
  }, []);

  const drawStars = useCallback((t) => {
    const canvas = starsRef.current;
    if (!canvas) return;
    const stx = canvas.getContext("2d");
    stx.clearRect(0, 0, canvas.width, canvas.height);
    stateRef.current.stars.forEach((s) => {
      s.a = 0.3 + 0.7 * Math.abs(Math.sin(t * s.speed + s.x));
      stx.beginPath();
      stx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      stx.fillStyle = `rgba(255,255,255,${s.a * 0.5})`;
      stx.fill();
    });
  }, []);

  const initNet = useCallback(() => {
    const canvas = netRef.current;
    if (!canvas) return;
    const W = window.innerWidth;
    const H = window.innerHeight;
    canvas.width = W * DPR;
    canvas.height = H * DPR;
    canvas.style.width = W + "px";
    canvas.style.height = H + "px";
    const ctx = canvas.getContext("2d");
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    stateRef.current.W = W;
    stateRef.current.H = H;

    const cx = W / 2;
    const cy = H / 2;
    const angles = [
      Math.PI * 1.3,
      Math.PI * 0.3,
      Math.PI * 0.85,
      Math.PI * 1.75,
    ];
    const dist = 220;

    stateRef.current.nodes = SUBJECTS.map((s, i) => {
      const node = {
        ...s,
        x: cx + Math.cos(angles[i]) * dist,
        y: cy + Math.sin(angles[i]) * dist,
        vx: 0,
        vy: 0,
        imgLoaded: null,
        hoverProgress: 0,
      };
      const img = new Image();
      img.src = `./assets/images/subjects_bg/${s.img}`;
      img.onload = () => (node.imgLoaded = img);
      return node;
    });
  }, []);

  const physics = useCallback(() => {
    const { nodes, W, H } = stateRef.current;

    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i];
        const b = nodes[j];
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 0.1;
        const nx = dx / dist;
        const ny = dy / dist;
        const springF = (dist - SPRING_LEN) * SPRING_K;
        a.vx += nx * springF;
        a.vy += ny * springF;
        b.vx -= nx * springF;
        b.vy -= ny * springF;
        const repF = REPEL / (dist * dist);
        a.vx -= nx * repF;
        a.vy -= ny * repF;
        b.vx += nx * repF;
        b.vy += ny * repF;
      }
    }

    nodes.forEach((n) => {
      const hoverTarget = n === stateRef.current.hovered ? 1 : 0;
      n.hoverProgress += (hoverTarget - n.hoverProgress) * HOVER_SPEED;

      if (n === stateRef.current.dragging) return;
      n.vx += (W / 2 - n.x) * 0.0008;
      n.vy += (H / 2 - n.y) * 0.0008;
      n.vx *= DAMPING;
      n.vy *= DAMPING;
      n.x += n.vx;
      n.y += n.vy;
      const margin = RADIUS + 20;
      if (n.x < margin) { n.x = margin; n.vx *= -0.5; }
      if (n.x > W - margin) { n.x = W - margin; n.vx *= -0.5; }
      if (n.y < margin) { n.y = margin; n.vy *= -0.5; }
      if (n.y > H - margin) { n.y = H - margin; n.vy *= -0.5; }
    });
  }, []);

  const drawConnections = useCallback((ctx) => {
    const { nodes } = stateRef.current;
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i];
        const b = nodes[j];
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const alpha = Math.max(0, 1 - dist / 520);
        const highlight = Math.max(a.hoverProgress, b.hoverProgress);
        const grad = ctx.createLinearGradient(a.x, a.y, b.x, b.y);
        grad.addColorStop(0, hexAlpha(a.accentColor, alpha * (0.22 + highlight * 0.43)));
        grad.addColorStop(1, hexAlpha(b.accentColor, alpha * (0.22 + highlight * 0.43)));
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1 + highlight;
        ctx.stroke();
        ctx.beginPath();
        ctx.arc((a.x + b.x) / 2, (a.y + b.y) / 2, 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${alpha * 0.18})`;
        ctx.fill();
      }
    }
  }, []);

  const drawNode = useCallback((ctx, n, t) => {
    const hp = n.hoverProgress;
    const pulse = Math.sin(t * 0.001 + n.pulse) * 0.5 + 0.5;
    const r = RADIUS + hp * 10 + pulse * 2;

    // 1. outer space glow (behind everything)
    drawOuterGlow(ctx, n, r, hp, pulse);

    // 2. back half of ring (drawn before sphere so sphere occludes front)
    if (n.hasRing) {
      ctx.save();
      // clip to back half only (below the planet centre line, roughly)
      ctx.beginPath();
      ctx.rect(n.x - r * 2.2, n.y, r * 4.4, r * 2.2);
      ctx.clip();
      drawRing(ctx, n, r, hp, pulse, t);
      ctx.restore();
    }

    // 3. sphere body (clip to circle for all internal fills)
    ctx.save();
    ctx.beginPath();
    ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
    ctx.clip();
    drawPlanetSphere(ctx, n, r);
    ctx.restore();

    // 4. front half of ring (drawn after sphere so it overlaps correctly)
    if (n.hasRing) {
      ctx.save();
      ctx.beginPath();
      ctx.rect(n.x - r * 2.2, n.y - r * 2.2, r * 4.4, r * 2.2);
      ctx.clip();
      drawRing(ctx, n, r, hp, pulse, t);
      ctx.restore();
    }

    // 5. atmosphere rim (on top of sphere)
    drawAtmosphere(ctx, n, r, hp, pulse);

    // 6. crisp edge stroke
    ctx.beginPath();
    ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
    ctx.strokeStyle = hexAlpha(n.accentColor, 0.55 + hp * 0.45 + pulse * 0.15);
    ctx.lineWidth = 1.5 + hp * 1.5;
    ctx.stroke();

    // 7. hover pulse rings
    if (hp > 0.01) {
      ctx.beginPath();
      ctx.arc(n.x, n.y, r + 8 + pulse * 7, 0, Math.PI * 2);
      ctx.strokeStyle = hexAlpha(n.accentColor, hp * (0.28 - pulse * 0.1));
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(n.x, n.y, r + 20 + pulse * 4, 0, Math.PI * 2);
      ctx.strokeStyle = hexAlpha(n.accentColor, hp * 0.1);
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // 8. icon badge
    const badgeX = n.x + r * 0.52;
    const badgeY = n.y - r * 0.54;
    const badgeR = r * 0.24;
    ctx.beginPath();
    ctx.arc(badgeX, badgeY, badgeR, 0, Math.PI * 2);
    ctx.fillStyle = hexAlpha(n.accentColor, 0.22 + hp * 0.15);
    ctx.fill();
    ctx.strokeStyle = hexAlpha(n.accentColor, 0.55 + hp * 0.2);
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.save();
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = `bold ${badgeR * 0.9}px 'Didact Gothic', sans-serif`;
    ctx.fillStyle = n.lightColor;
    ctx.fillText(n.icon, badgeX, badgeY);
    ctx.restore();

    // 9. name label + topic pill
    ctx.save();
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    const words = n.name.split(" ");
    const fontSize = r * 0.215;
    ctx.font = `600 ${fontSize}px 'Didact Gothic', sans-serif`;
    ctx.fillStyle = `rgba(255,255,255,${0.7 + hp * 0.27})`;
    ctx.shadowColor = "rgba(0,0,0,0.9)";
    ctx.shadowBlur = 6;

    if (words.length === 1) {
      ctx.fillText(n.name, n.x, n.y - 6);
    } else {
      const lineH = fontSize * 1.35;
      const totalH = words.length * lineH;
      words.forEach((word, wi) => {
        ctx.fillText(word, n.x, n.y - totalH / 2 + wi * lineH + lineH / 2 - 4);
      });
    }

    const pillY = n.y + r * 0.52;
    const pillText = `${n.topics} ${topicWord(n.topics)}`;
    const pillW = r * 0.72;
    const pillH = r * 0.27;
    ctx.shadowBlur = 0;
    roundRect(ctx, n.x - pillW / 2, pillY - pillH / 2, pillW, pillH, pillH / 2);
    ctx.fillStyle = hexAlpha(n.accentColor, 0.28 + hp * 0.27);
    ctx.fill();
    ctx.strokeStyle = hexAlpha(n.accentColor, 0.65 + hp * 0.2);
    ctx.lineWidth = 0.8;
    ctx.stroke();
    ctx.font = `400 ${r * 0.13}px 'Didact Gothic', sans-serif`;
    ctx.fillStyle = `rgba(255,255,255,${0.7 + hp * 0.27})`;
    ctx.fillText(pillText, n.x, pillY);
    ctx.restore();
  }, []);

  const getNodeAt = useCallback((x, y) => {
    const canvas = netRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    const cx = x - rect.left;
    const cy = y - rect.top;
    const { nodes } = stateRef.current;
    for (let i = nodes.length - 1; i >= 0; i--) {
      const n = nodes[i];
      const dx = cx - n.x;
      const dy = cy - n.y;
      if (dx * dx + dy * dy < (RADIUS + 12) ** 2) return n;
    }
    return null;
  }, []);

  useEffect(() => {
    initStars();
    initNet();

    const canvas = netRef.current;

    const render = (t) => {
      const ctx = canvas.getContext("2d");
      const { W, H, nodes } = stateRef.current;
      ctx.clearRect(0, 0, W * DPR, H * DPR);
      drawStars(t);
      physics();
      drawConnections(ctx);
      nodes.forEach((n) => drawNode(ctx, n, t));
      stateRef.current.rafId = requestAnimationFrame(render);
    };

    stateRef.current.rafId = requestAnimationFrame(render);

    const handleResize = () => {
      initStars();
      initNet();
    };
    window.addEventListener("resize", handleResize);

    const onMouseDown = (e) => {
      stateRef.current.mouseDownPos = { x: e.clientX, y: e.clientY };
      const n = getNodeAt(e.clientX, e.clientY);
      if (n) {
        stateRef.current.dragging = n;
        n.vx = 0;
        n.vy = 0;
        canvas.style.cursor = "grabbing";
      }
    };

    const onMouseMove = (e) => {
      const { dragging } = stateRef.current;
      if (dragging) {
        dragging.x = e.clientX;
        dragging.y = e.clientY;
      }
      const h = getNodeAt(e.clientX, e.clientY);
      if (h !== stateRef.current.hovered) {
        stateRef.current.hovered = h;
        canvas.style.cursor = h ? "pointer" : "grab";
      }
    };

    const onMouseUp = (e) => {
      const { dragging, mouseDownPos } = stateRef.current;
      if (dragging) {
        const n = dragging;
        stateRef.current.dragging = null;
        canvas.style.cursor = stateRef.current.hovered ? "pointer" : "grab";
        const dx = e.clientX - mouseDownPos.x;
        const dy = e.clientY - mouseDownPos.y;
        if (Math.abs(dx) < 8 && Math.abs(dy) < 8) navigate(n.href);
      }
    };

    const onTouchStart = (e) => {
      e.preventDefault();
      const t = e.touches[0];
      stateRef.current.touchStartPos = { x: t.clientX, y: t.clientY };
      const node = getNodeAt(t.clientX, t.clientY);
      stateRef.current.touchNode = node;
      if (node) {
        stateRef.current.dragging = node;
        node.vx = 0;
        node.vy = 0;
      }
    };

    const onTouchMove = (e) => {
      e.preventDefault();
      const { dragging } = stateRef.current;
      if (dragging) {
        dragging.x = e.touches[0].clientX;
        dragging.y = e.touches[0].clientY;
      }
    };

    const onTouchEnd = (e) => {
      const { touchNode, touchStartPos } = stateRef.current;
      if (touchNode) {
        const lastT = e.changedTouches[0];
        const dx = lastT.clientX - touchStartPos.x;
        const dy = lastT.clientY - touchStartPos.y;
        if (Math.abs(dx) < 12 && Math.abs(dy) < 12) navigate(touchNode.href);
      }
      stateRef.current.dragging = null;
      stateRef.current.touchNode = null;
    };

    canvas.addEventListener("mousedown", onMouseDown);
    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mouseup", onMouseUp);
    canvas.addEventListener("touchstart", onTouchStart, { passive: false });
    canvas.addEventListener("touchmove", onTouchMove, { passive: false });
    canvas.addEventListener("touchend", onTouchEnd);

    const state = stateRef.current;
    return () => {
      cancelAnimationFrame(state.rafId);
      window.removeEventListener("resize", handleResize);
      canvas.removeEventListener("mousedown", onMouseDown);
      canvas.removeEventListener("mousemove", onMouseMove);
      canvas.removeEventListener("mouseup", onMouseUp);
      canvas.removeEventListener("touchstart", onTouchStart);
      canvas.removeEventListener("touchmove", onTouchMove);
      canvas.removeEventListener("touchend", onTouchEnd);
    };
  }, [
    initStars,
    initNet,
    drawStars,
    physics,
    drawConnections,
    drawNode,
    getNodeAt,
    navigate,
  ]);

  return (
      <div className="subject-map">
        <canvas ref={starsRef} className="stars-canvas" />
        <canvas ref={netRef} className="net-canvas" />
      </div>
  );
}