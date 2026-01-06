"use client"
import { useRef, useState } from 'react';
import { Wheel } from 'react-custom-roulette';
import { WheelOverlay } from './wheelOverlay';

// Helper function to create a wedge path
function createWedgePath(centerX: number, centerY: number, radius: number, startAngle: number, endAngle: number) {
  const startRad = (startAngle * Math.PI) / 180;
  const endRad = (endAngle * Math.PI) / 180;
  
  const x1 = centerX + radius * Math.cos(startRad);
  const y1 = centerY + radius * Math.sin(startRad);
  const x2 = centerX + radius * Math.cos(endRad);
  const y2 = centerY + radius * Math.sin(endRad);
  
  const largeArc = endAngle - startAngle > 180 ? 1 : 0;
  
  return `M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;
}

export default function SpinningWheel({ options }: { options: string[] }) {
  
  const data = options.map((option) => ({
    option    
  }));
  
  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(0);
  const [displayedOption, setDisplayedOption] = useState<string>(options[0] || '');
  const startY = useRef<number | null>(null);
  const startX = useRef<number | null>(null);
  const triggered = useRef(false);
  const SPIN_SWIPE_PX = 80;
  const MAX_HORIZONTAL_DRIFT = 60;
  
  const handleSpinClick = () => {
    if (!mustSpin) {
      const newPrizeNumber = Math.floor(Math.random() * data.length);
      setPrizeNumber(newPrizeNumber);
      setMustSpin(true);
      setDisplayedOption(options[newPrizeNumber]);
    }
  }
  
  const wedgeDeg = 360 / data.length;
  const centerX = 220;
  const centerY = 220;
  const radius = 215; // Larger radius to cover the entire opening
  
  // Wedge centered at -44 degrees (pointing right in the opening)
  const startAngle = -44 - wedgeDeg / 2;
  const endAngle = -44 + wedgeDeg / 2;
  const wedgePath = createWedgePath(centerX, centerY, radius, startAngle, endAngle);
  
  // Calculate text position (middle of the wedge)
  const textAngle = -44;
  const textDistance = radius * 0.7;
  const textX = centerX + textDistance * Math.cos((textAngle * Math.PI) / 180);
  const textY = centerY + textDistance * Math.sin((textAngle * Math.PI) / 180);
   
  return (
    <div
      onPointerDown={(e) => {
        triggered.current = false;
        startY.current = e.clientY;
        startX.current = e.clientX;
        (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
      }}
      onPointerMove={(e) => {
        if (startY.current == null || startX.current == null) return;
        if (triggered.current) return;
        const dy = e.clientY - startY.current;
        const dx = Math.abs(e.clientX - startX.current);
        if (dy > SPIN_SWIPE_PX && dx < MAX_HORIZONTAL_DRIFT) {
          triggered.current = true;
          handleSpinClick();
        }
      }}
      onPointerUp={() => {
        startY.current = null;
        startX.current = null;
        triggered.current = false;
      }}
      onPointerCancel={() => {
        startY.current = null;
        startX.current = null;
        triggered.current = false;
      }}
      style={{
        touchAction: "pan-x",
        userSelect: "none",
      }}
    >
      <div style={{ position: "relative", width: 440, height: 440, transform: "rotate(44deg)", transformOrigin: "center" }}>
        <Wheel
          mustStartSpinning={mustSpin}
          prizeNumber={prizeNumber}
          data={data}
          fontSize={10}
          spinDuration={0.3}
          backgroundColors={['silver', 'white']}
          radiusLineWidth={5}
          radiusLineColor='gray'
          onStopSpinning={() => setMustSpin(false)}
          pointerProps={{style:{visibility: "hidden"}}}
          disableInitialAnimation={true}
        />
        <WheelOverlay
          openingDeg={wedgeDeg}
          overlayOpacity={1}
          rotationOffsetDeg={-44}
        />
        
        {/* Result wedge overlay - perfectly centered in the opening */}
        <svg
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            pointerEvents: "none",
            zIndex: 45, // Behind overlay (50) but in front of wheel
          }}
          viewBox="0 0 440 440"
        >
          <path
            d={wedgePath}
            fill="white"
            stroke="gray"
            strokeWidth="5"
          />
          <text
            x={textX}
            y={textY}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="16"
            fontWeight="bold"
            fill="black"
            transform={`rotate(${-44}, ${textX}, ${textY})`}
          >
            {displayedOption}
          </text>
        </svg>
      </div>
      
      <div style={{ textAlign: "center", marginTop: 12 }}>
        Swipe down to spin
      </div>
    </div>
  )
}