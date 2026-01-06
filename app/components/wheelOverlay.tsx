"use client";
import React, { useId, useMemo } from "react";

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = (angleDeg * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function wedgePath(cx: number, cy: number, r: number, start: number, end: number) {
  const s = polarToCartesian(cx, cy, r, start);
  const e = polarToCartesian(cx, cy, r, end);
  const sweep = end - start;
  const largeArcFlag = Math.abs(sweep) <= 180 ? "0" : "1";
  return `M ${cx} ${cy} L ${s.x} ${s.y} A ${r} ${r} 0 ${largeArcFlag} 1 ${e.x} ${e.y} Z`;
}

export function WheelOverlay({
  openingDeg,
  overlayOpacity = 0.75, // slightly less harsh than 1
  feather = 0.6,
  rotationOffsetDeg = 0,
  spokes = 18, // subtle "prize wheel" spokes
  dots = 48,   // subtle bulbs around rim
}: {
  openingDeg: number;
  overlayOpacity?: number;
  feather?: number;
  rotationOffsetDeg?: number;
  spokes?: number;
  dots?: number;
}) {
  const id = useId();

  // 0..100 viewBox coords
  const cx = 50;
  const cy = 50;
  const r = 50.5;

  const start = -openingDeg / 2 + rotationOffsetDeg;
  const end = openingDeg / 2 + rotationOffsetDeg;

  const opening = wedgePath(cx, cy, r + feather, start, end);

  const dotPositions = useMemo(() => {
    const arr: Array<{ x: number; y: number }> = [];
    const dotR = 46.8; // near rim
    for (let i = 0; i < dots; i++) {
      const a = (i * 360) / dots;
      const p = polarToCartesian(cx, cy, dotR, a);
      arr.push({ x: p.x, y: p.y });
    }
    return arr;
  }, [dots]);

  const spokeLines = useMemo(() => {
    const arr: Array<{ x1: number; y1: number; x2: number; y2: number }> = [];
    const inner = 12;
    const outer = 44.5;
    for (let i = 0; i < spokes; i++) {
      const a = (i * 360) / spokes;
      const p1 = polarToCartesian(cx, cy, inner, a);
      const p2 = polarToCartesian(cx, cy, outer, a);
      arr.push({ x1: p1.x, y1: p1.y, x2: p2.x, y2: p2.y });
    }
    return arr;
  }, [spokes]);

  return (
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid meet"
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 50,
      }}
    >
      <defs>
        {/* Soft silver-ish highlight gradient for rim strokes */}
        <radialGradient id={`rim-${id}`} cx="50%" cy="45%" r="65%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.35)" />
          <stop offset="60%" stopColor="rgba(255,255,255,0.10)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0.15)" />
        </radialGradient>
      </defs>

      <mask id={`mask-${id}`}>
        <rect width="100" height="100" fill="white" />
        <path d={opening} fill="black" />
      </mask>

      {/* Base dimming overlay */}
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill={`rgba(0,0,0,${overlayOpacity})`}
        mask={`url(#mask-${id})`}
      />

      {/* Everything below is "decoration" on top of the overlay.
          If you want the opening to stay totally clean, keep these masked as well. */}
      <g mask={`url(#mask-${id})`}>
        {/* Subtle rim rings */}
        <circle
          cx={cx}
          cy={cy}
          r={49.3}
          fill="none"
          stroke={`url(#rim-${id})`}
          strokeWidth={1.2}
          opacity={1}
        />
        <circle
          cx={cx}
          cy={cy}
          r={47.2}
          fill="none"
          stroke="rgba(220,220,220,0.35)"
          strokeWidth={0.9}
        />

        {/* Subtle radial spokes */}
        <g stroke="rgba(255,255,255,0.10)" strokeWidth={0.6}>
          {spokeLines.map((l, idx) => (
            <line key={idx} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} />
          ))}
        </g>

        {/* Dots around the edge (bulbs), very subtle */}
        <g>
          {dotPositions.map((p, idx) => (
  <circle
    key={idx}
    cx={p.x}
    cy={p.y}
    r={0.85}
    fill={idx % 2 === 0 ? "#eeeeee" : "#bdbdbd"}
    stroke="#ffffff"
    strokeOpacity={0.15}
    strokeWidth={0.25}
  />
))}
        </g>
      </g>
    </svg>
  );
}
