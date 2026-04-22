import React from 'react';
import { palette } from '../kit/palette';
import { ChassisRail, MarkerLight, Windshield, CabDoor } from '../kit/primitives';
import type { CabRenderProps } from '../kit/types';

const CAB_HEIGHT_M = 2.5;

const LightCabOver: React.FC<CabRenderProps> = ({
  scale,
  cabLength,
  color = palette.cabWhite,
  accent = palette.cabBlueDark,
}) => {
  const L = cabLength * scale;
  const H = CAB_HEIGHT_M * scale;
  const deckY = -0.85 * scale;
  const cabTopY = -H;
  const cabBottomY = deckY - 1;

  // Windshield upper 60%
  const windshieldTopY = cabTopY + H * 0.1;
  const windshieldBotY = cabTopY + H * 0.58;

  return (
    <g>
      <ChassisRail length={cabLength} scale={scale} deckHeight={0.85} />

      {/* Small cab body */}
      <rect
        x={0}
        y={cabTopY}
        width={L}
        height={cabBottomY - cabTopY}
        fill={color}
        stroke={palette.cabDark}
        strokeWidth={0.7}
        rx={2.5}
      />

      {/* Roof accent */}
      <rect x={0} y={cabTopY} width={L} height={2} fill={accent} rx={1.5} />

      {/* Windshield across front upper */}
      <Windshield
        x1={3}
        y1={windshieldTopY}
        x2={L - 4}
        y2={windshieldBotY}
      />

      {/* Small grille strip across lower face */}
      <rect
        x={1}
        y={windshieldBotY + 2}
        width={L * 0.45}
        height={H * 0.18}
        fill={accent}
        stroke={palette.cabDark}
        strokeWidth={0.4}
        rx={0.8}
      />
      {[0, 1, 2].map((i) => (
        <line
          key={i}
          x1={2}
          x2={L * 0.45 - 1}
          y1={windshieldBotY + 4 + i * (H * 0.18 - 4) / 2}
          y2={windshieldBotY + 4 + i * (H * 0.18 - 4) / 2}
          stroke={palette.cabDark}
          strokeWidth={0.4}
        />
      ))}

      {/* Modest headlight */}
      <rect
        x={1}
        y={cabBottomY - H * 0.14}
        width={L * 0.1}
        height={H * 0.08}
        fill={palette.headlight}
        stroke={palette.headlightRim}
        strokeWidth={0.5}
        rx={0.6}
      />

      {/* Front bumper */}
      <rect x={0} y={cabBottomY - 3} width={L * 0.65} height={3} fill={palette.chassisLight} rx={0.8} />

      {/* Single door */}
      <CabDoor x={Math.min(1.2 * scale, L - 8)} topY={windshieldBotY + 1} bottomY={cabBottomY - 2} />
      <rect
        x={Math.min(1.2 * scale, L - 8) - 3}
        y={cabBottomY - 2}
        width={8}
        height={2}
        fill={palette.chassisLight}
        rx={0.5}
      />

      {/* Mirror */}
      <line x1={2} y1={windshieldTopY + 3} x2={-3} y2={windshieldTopY + 3} stroke={palette.cabDark} strokeWidth={0.7} />
      <rect x={-6} y={windshieldTopY + 1} width={3} height={H * 0.2} fill={palette.cabDark} rx={0.6} />

      {/* Roof markers */}
      <MarkerLight x={L * 0.2} y={cabTopY + 1} radius={1} />
      <MarkerLight x={L * 0.8} y={cabTopY + 1} radius={1} />
    </g>
  );
};

export default LightCabOver;
