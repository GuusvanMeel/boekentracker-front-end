import React, { useId, useMemo } from 'react';

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

export function WheelOverlay({  totalOptions  }:{totalOptions : number}) {
  const id = useId();
  
  // Match the winner wedge dimensions
  const cx = 223;
  const cy = 225;
  const r = 213;
  
  // Calculate opening angle based on number of options
  const openingDeg = 360 / totalOptions -2;
  
  // Opening at 3 o'clock (0 degrees), centered
  const start = -openingDeg / 2;
  const end = openingDeg / 2;

  const opening = wedgePath(cx, cy, r + 2, start, end);


  const triangles = useMemo(() => {
    const arr = [];
    const count = 32;
    for (let i = 0; i < count; i++) {
      const angle = (i * 360) / count;
      const p1 = polarToCartesian(cx, cy, r - 10, angle - 5);
      const p2 = polarToCartesian(cx, cy, r - 10, angle + 5);
      const p3 = polarToCartesian(cx, cy, r - 25, angle);
      arr.push({ p1, p2, p3 });
    }
    return arr;
  }, [r]);

  const dotPositions = useMemo(() => {
    const arr = [];
    
    const dotR = r - 5;
    for (let i = 0; i < totalOptions; i++) {
      const a = totalOptions + (i * 360) / totalOptions;
      arr.push(polarToCartesian(cx, cy, dotR, a));
    }
    return arr;
  }, [totalOptions, r]);

  const spokes = useMemo(() => {
    const arr = [];
    for (let i = 0; i < totalOptions; i++) {
      const angle = totalOptions + (i * 360) / totalOptions;
      const inner = polarToCartesian(cx, cy, 0, angle);
      const outer = polarToCartesian(cx, cy, r -10, angle);
      arr.push({ x1: inner.x, y1: inner.y, x2: outer.x, y2: outer.y });
    }
    return arr;
  }, [totalOptions, r]);



  return (
    <svg width={440} height={440} viewBox="0 0 440 440" style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 20 }}>
      <mask id={`mask-${id}`}>
        <rect width="440" height="440" fill="white" />
        <path d={opening} fill="black" />
      </mask>
      <circle cx={cx} cy={cy} r={r}  mask={`url(#mask-${id})`} />
      <g mask={`url(#mask-${id})`}>
        {/* Triangular pattern */}
        <g>
          {triangles.map((t, i) => (
            <polygon
              key={i}
              points={`${t.p1.x},${t.p1.y} ${t.p2.x},${t.p2.y} ${t.p3.x},${t.p3.y}`}
              fill="none"
              stroke={i % 2 === 0 ? "rgba(255,255,255,0.3)" : "rgba(200,200,255,0.3)"}
              strokeWidth={1.5}
            />
          ))}
        </g>
        {/* Spokes */}
         <g stroke="rgba(255,255,255,0.15)" strokeWidth={1.5}>
          {spokes.map((s, i) => (
            <line
              key={i}
              x1={s.x1}
              y1={s.y1}
              x2={s.x2}
              y2={s.y2}
            />
          ))}
        </g>
        {/* Rim circles */}
        {Array.from({ length: 12 }).map((_, i) => {
  const radius = r - 80 + i * 10;      // smaller step = more lines
  const opacity = 0.25 - i * 0.015;   // slower fade

  return (
    <circle
      key={i}
      cx={cx}
      cy={cy}
      r={radius}
      fill="none"
      stroke={`rgba(200,200,255,${opacity})`}
      strokeWidth={1.2}
    />
  );
})}

        <g>
          {dotPositions.map((p, i) => (
            <circle key={i} cx={p.x} cy={p.y} r={2.5} fill={i % 3 === 0 ? "#ffffff" : i % 3 === 1 ? "#e0e0ff" : "#c0c0ff"} opacity={0.7} />
          ))}
        </g>
      </g>
       <circle cx={cx} cy={cy} r={r - 3} fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth={2} />
       
        {/* Corner dots */}
    </svg>
  );
}