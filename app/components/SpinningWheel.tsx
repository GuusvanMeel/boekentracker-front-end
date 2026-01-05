"use client"
import { useRef, useState } from 'react';
import { Wheel } from 'react-custom-roulette';
import { WheelOverlay } from './wheelOverlay';


export default function SpinningWheel(  { options }: { options: string[] }) {
  const SIZE = 300;
  const data = options.map((option, index) => ({
    option,
    style: {
      backgroundColor: index % 2 === 0 ? 'white' : 'silver',
      textColor: 'black',
    },
  }));
  
  
const [mustSpin, setMustSpin] = useState(false);
const [prizeNumber, setPrizeNumber] = useState(0);

const startY = useRef<number | null>(null);
  const startX = useRef<number | null>(null);
  const triggered = useRef(false);

  const SPIN_SWIPE_PX = 80;      // hoe ver naar beneden voor spin
  const MAX_HORIZONTAL_DRIFT = 60; // voorkomt dat horizontale swipe triggert
  
    const handleSpinClick = () => {
        if (!mustSpin) {
        const newPrizeNumber = Math.floor(Math.random() * data.length);
        setPrizeNumber(newPrizeNumber);
        setMustSpin(true);
        }
    }
   
    return (
   <div
      // swipe-zone
      onPointerDown={(e) => {
        triggered.current = false;
        startY.current = e.clientY;
        startX.current = e.clientX;
        // zodat je move events blijft krijgen
        (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
      }}
      onPointerMove={(e) => {
        if (startY.current == null || startX.current == null) return;
        if (triggered.current) return;

        const dy = e.clientY - startY.current;
        const dx = Math.abs(e.clientX - startX.current);

        // alleen echte swipe-down
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
        touchAction: "pan-x", // laat horizontaal scrollen toe, maar we checken zelf vertical gesture
        userSelect: "none",
      }}
    ><div style={{ position: "relative", width: SIZE, height: SIZE, transform: "rotate(44deg)", transformOrigin: "center" }}>
  <Wheel
    mustStartSpinning={mustSpin}
    prizeNumber={1}
    data={data}
    spinDuration={0.01}
    radiusLineWidth={10}
    onStopSpinning={() => setMustSpin(false)}
  />

  <WheelOverlay
    size={SIZE}
    openingDeg={360 / data.length}
    overlayOpacity={1}
    rotationOffsetDeg={-44}
  />
</div>

      {/* optioneel: hint tekst */}
      <div style={{ textAlign: "center", marginTop: 12 }}>
        Swipe down to spin
      </div>
    </div>
  )
}
