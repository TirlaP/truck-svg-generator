import React from 'react';
import { palette } from '../kit/palette';
import { ChassisRail, MarkerLight, Windshield, CabDoor } from '../kit/primitives';
import type { CabRenderProps } from '../kit/types';

const CAB_HEIGHT_M = 3.9;

const CabOverSleeper: React.FC<CabRenderProps> = ({
  scale,
  cabLength,
  color = palette.cabRed,
  accent = palette.cabRedDark,
}) => {
  const L = cabLength * scale;
  const H = CAB_HEIGHT_M * scale;
  const deckY = -0.95 * scale;
  const cabTopY = -H;
  const cabBottomY = deckY - 1;

  // The forward ~60% is the cab face; rear ~40% is sleeper
  const frontSectionW = Math.min(2.3 * scale, L * 0.62);

  // Globetrotter-style raised roof over whole cab, higher at rear
  const roofRiseY = cabTopY - H * 0.05;

  const windshieldTopY = cabTopY + H * 0.12;
  const windshieldBotY = cabTopY + H * 0.52;

  return (
    <g>
      <ChassisRail length={cabLength} scale={scale} deckHeight={0.95} />

      {/* Raised roof cap (globetrotter) — curves up above base roof */}
      <path
        d={`M ${L * 0.08} ${cabTopY + 2}
            Q ${L * 0.08} ${roofRiseY} ${L * 0.22} ${roofRiseY}
            L ${L - 6} ${roofRiseY}
            Q ${L - 2} ${roofRiseY} ${L - 2} ${cabTopY + 4}
            L ${L - 2} ${cabTopY + 6}
            L ${L * 0.08} ${cabTopY + 6} Z`}
        fill={accent}
        stroke={palette.cabDark}
        strokeWidth={0.7}
      />

      {/* Cab body */}
      <rect
        x={0}
        y={cabTopY + 4}
        width={L}
        height={cabBottomY - cabTopY - 4}
        fill={color}
        stroke={palette.cabDark}
        strokeWidth={0.8}
        rx={3}
      />

      {/* Sleeper divider line */}
      <line
        x1={frontSectionW}
        y1={cabTopY + 6}
        x2={frontSectionW}
        y2={cabBottomY - 3}
        stroke={palette.cabDark}
        strokeWidth={0.5}
      />

      {/* Sleeper porthole window */}
      <circle
        cx={frontSectionW + (L - frontSectionW) * 0.55}
        cy={cabTopY + H * 0.28}
        r={Math.min(H * 0.09, 7)}
        fill={palette.window}
        stroke={palette.cabDark}
        strokeWidth={0.6}
      />

      {/* Windshield on the front face */}
      <Windshield
        x1={4}
        y1={windshieldTopY}
        x2={frontSectionW - 4}
        y2={windshieldBotY}
      />

      {/* Front grille */}
      <rect
        x={0.5}
        y={windshieldBotY + 2}
        width={frontSectionW * 0.55}
        height={H * 0.22}
        fill={accent}
        stroke={palette.cabDark}
        strokeWidth={0.5}
        rx={1}
      />
      {[0, 1, 2, 3].map((i) => (
        <line
          key={i}
          x1={2}
          x2={frontSectionW * 0.55 - 1}
          y1={windshieldBotY + 5 + i * (H * 0.22 - 6) / 3}
          y2={windshieldBotY + 5 + i * (H * 0.22 - 6) / 3}
          stroke={palette.cabDark}
          strokeWidth={0.5}
        />
      ))}

      {/* Headlight */}
      <rect
        x={1.5}
        y={cabBottomY - H * 0.16}
        width={frontSectionW * 0.2}
        height={H * 0.08}
        fill={palette.headlight}
        stroke={palette.headlightRim}
        strokeWidth={0.6}
        rx={1}
      />

      {/* Front bumper */}
      <rect x={0} y={cabBottomY - 4} width={frontSectionW} height={4} fill={palette.chassisLight} rx={1} />

      {/* Door */}
      <CabDoor x={Math.min(1.5 * scale, frontSectionW - 6)} topY={windshieldBotY + 1} bottomY={cabBottomY - 2} />
      <rect
        x={Math.min(1.5 * scale, frontSectionW - 6) - 4}
        y={cabBottomY - 2}
        width={10}
        height={2}
        fill={palette.chassisLight}
        rx={0.5}
      />

      {/* Mirror */}
      <line x1={3} y1={windshieldTopY + 3} x2={-3} y2={windshieldTopY + 3} stroke={palette.cabDark} strokeWidth={0.8} />
      <rect x={-7} y={windshieldTopY + 1} width={4} height={H * 0.18} fill={palette.cabDark} rx={0.8} />

      {/* Roof markers */}
      <MarkerLight x={L * 0.12} y={roofRiseY + 1.5} />
      <MarkerLight x={L * 0.4} y={roofRiseY + 1.5} />
      <MarkerLight x={L * 0.7} y={roofRiseY + 1.5} />
      <MarkerLight x={L * 0.92} y={roofRiseY + 1.5} />
    </g>
  );
};

export default CabOverSleeper;
