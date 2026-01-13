
export default function WinnerWedge ({ totalOptions, winnerName }: {totalOptions: number, winnerName: string}) {
  // Calculate the angle for each wedge based on total options
 const wedgeAngle = 360 / totalOptions;
  
  // Center of the circle
  const cx = 223;
  const cy = 225;
  const radius = 205;
  
  // We want the wedge centered at the right (3 o'clock position)
  const startAngle = 0 - wedgeAngle / 2;
  const endAngle = 0 + wedgeAngle / 2;
  
  // Convert to radians
  const startRad = (startAngle * Math.PI) / 180;
  const endRad = (endAngle * Math.PI) / 180;
  
  // Calculate arc points
  const x1 = cx + radius * Math.cos(startRad);
  const y1 = cy + radius * Math.sin(startRad);
  const x2 = cx + radius * Math.cos(endRad);
  const y2 = cy + radius * Math.sin(endRad);
  
  // Determine if we need a large arc
  const largeArc = wedgeAngle > 180 ? 1 : 0;
  
  // Create the SVG path for the wedge
  const pathData = [
    `M ${cx} ${cy}`,
    `L ${x1} ${y1}`,
    `A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`,
    `Z`
  ].join(' ');
  
  // Calculate text position - positioned further out like in the wheel
  const textRadius = radius * 0.75; // Closer to the edge
  const textX = cx + textRadius;
  const textY = cy;

  return (
    <svg
      width={300}
      height={300}
      viewBox="0 0 440 440"
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 10,
        pointerEvents: "none",
      }}
    >
      {/* The winning wedge */}
      <path
        d={pathData}
        fill="#e5e5e5"
        stroke="#808080"
        strokeWidth="3"
      />
      
      {/* Winner text - horizontal, positioned like in the wheel */}
      <text
        x={textX -30}
        y={textY}
        textAnchor="middle"
        dominantBaseline="middle"
        fill="black"
        fontSize={10}
        fontWeight="bold"
        fontFamily="Arial, sans-serif"
        
        style={{
          pointerEvents: 'none'
        }}
      >
        {winnerName}
      </text>
    </svg>
  );
};
