"use client";
import React, { useId } from "react";

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = (angleDeg * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function wedgePath(
  cx: number,
  cy: number,
  r: number,
  startAngleDeg: number,
  endAngleDeg: number
) {
  const start = polarToCartesian(cx, cy, r, startAngleDeg);
  const end = polarToCartesian(cx, cy, r, endAngleDeg);
  const sweep = endAngleDeg - startAngleDeg;
  const largeArcFlag = Math.abs(sweep) <= 180 ? "0" : "1";

  return [
    `M ${cx} ${cy}`,
    `L ${start.x} ${start.y}`,
    `A ${r} ${r} 0 ${largeArcFlag} 1 ${end.x} ${end.y}`,
    "Z",
  ].join(" ");
}

type WheelOverlayProps = {
  size: number;
  openingDeg: number;
  overlayOpacity?: number;
  featherPx?: number;

  // NEW: counter-rotate the opening
  rotationOffsetDeg?: number; // e.g. -44 to cancel parent rotation of +44
};

export function WheelOverlay({
  size,
  openingDeg,
  overlayOpacity = 1,
  featherPx = 0,
  rotationOffsetDeg = 0,
}: WheelOverlayProps) {
  const id = useId();
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 + 1;

  // opening centered on RIGHT (0deg), but we shift it by rotationOffsetDeg
  const baseStart = -openingDeg / 2;
  const baseEnd = openingDeg / 2;

  const start = baseStart + rotationOffsetDeg;
  const end = baseEnd + rotationOffsetDeg;

  const opening = wedgePath(cx, cy, r + featherPx, start, end);

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        zIndex: 50,
      }}
    >
      <mask id={`mask-${id}`}>
        <rect width={size} height={size} fill="white" />
        <path d={opening} fill="black" />
      </mask>

      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill={`rgba(0,0,0,${overlayOpacity})`}
        mask={`url(#mask-${id})`}
      />
    </svg>
  );
}
