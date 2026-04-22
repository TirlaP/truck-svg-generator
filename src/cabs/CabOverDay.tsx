import React from 'react';
import { palette } from '../kit/palette';
import { ChassisRail, MarkerLight, Windshield, CabDoor } from '../kit/primitives';
import type { CabRenderProps } from '../kit/types';

const CAB_HEIGHT_M = 3.8;

const CabOverDay: React.FC<CabRenderProps> = ({
  scale,
  cabLength,
  color = palette.cabRed,
  accent = palette.cabRedDark,
}) => {
  const L = cabLength * scale;
  const H = CAB_HEIGHT_M * scale;
  const deckY = -0.95 * scale; // top of chassis rail
  const cabTopY = -H;
  const cabBottomY = deckY - 1;

  // Windshield occupies upper ~50% of the cab face
  const windshieldTopY = cabTopY + H * 0.12;
  const windshieldBotY = cabTopY + H * 0.55;

  return (
    <g>
      {/* Chassis rail under the cab */}
      <ChassisRail length={cabLength} scale={scale} deckHeight={0.95} />

      {/* Cab body — tall rectangular box, gently rounded */}
      <rect
        x={0}
        y={cabTopY}
        width={L}
        height={cabBottomY - cabTopY}
        fill={color}
        stroke={palette.cabDark}
        strokeWidth={0.8}
        rx={3}
      />

      {/* Roof cap accent */}
      <rect x={0} y={cabTopY} width={L} height={3} fill={accent} rx={2} />

      {/* Windshield across the front-upper face */}
      <Windshield
        x1={4}
        y1={windshieldTopY}
        x2={L - 6}
        y2={windshieldBotY}
      />

      {/* Front face grille panel (big horizontal grille across lower front) */}
      <rect
        x={0.5}
        y={windshieldBotY + 2}
        width={L * 0.35}
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
          x2={L * 0.35 - 1}
          y1={windshieldBotY + 5 + i * (H * 0.22 - 6) / 3}
          y2={windshieldBotY + 5 + i * (H * 0.22 - 6) / 3}
          stroke={palette.cabDark}
          strokeWidth={0.5}
        />
      ))}

      {/* Headlight pair near front lower corner */}
      <rect
        x={1.5}
        y={cabBottomY - H * 0.16}
        width={L * 0.12}
        height={H * 0.08}
        fill={palette.headlight}
        stroke={palette.headlightRim}
        strokeWidth={0.6}
        rx={1}
      />

      {/* Front bumper */}
      <rect
        x={0}
        y={cabBottomY - 4}
        width={L * 0.6}
        height={4}
        fill={palette.chassisLight}
        stroke={palette.cabDark}
        strokeWidth={0.4}
        rx={1}
      />

      {/* Door seam ~1.5m back from front */}
      <CabDoor x={Math.min(1.5 * scale, L - 10)} topY={windshieldBotY + 1} bottomY={cabBottomY - 2} />

      {/* Step under the door */}
      <rect
        x={Math.min(1.5 * scale, L - 10) - 4}
        y={cabBottomY - 2}
        width={10}
        height={2}
        fill={palette.chassisLight}
        rx={0.5}
      />

      {/* Mirror bracket + mirror head off the A-pillar */}
      <line x1={3} y1={windshieldTopY + 3} x2={-3} y2={windshieldTopY + 3} stroke={palette.cabDark} strokeWidth={0.8} />
      <rect x={-7} y={windshieldTopY + 1} width={4} height={H * 0.18} fill={palette.cabDark} rx={0.8} />

      {/* Roof marker lights (amber) */}
      <MarkerLight x={L * 0.15} y={cabTopY + 1.5} />
      <MarkerLight x={L * 0.5} y={cabTopY + 1.5} />
      <MarkerLight x={L * 0.85} y={cabTopY + 1.5} />
    </g>
  );
};

export default CabOverDay;
